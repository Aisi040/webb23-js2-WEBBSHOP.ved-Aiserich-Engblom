const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001', // Uppdatera till din frontend-serverns adress
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type'
}));

const productsFilePath = path.join(__dirname, 'data', 'products.json');

async function readProducts() {
  try {
    const data = await fs.readFile(productsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading products file:', err);
    return [];
  }
}

async function writeProducts(products) {
  try {
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
  } catch (err) {
    console.error('Error writing products file:', err);
    throw err;
  }
}

app.get('/', (req, res) => {
  res.send('Welcome to the webshop backend!');
});

app.get('/products', async (req, res, next) => {
  try {
    const { search } = req.query;
    const products = await readProducts();
    const filteredProducts = search
      ? products.filter((product) =>
          product.name.toLowerCase().includes(search.toLowerCase())
        )
      : products;
    res.json(filteredProducts);
  } catch (err) {
    next(err);
  }
});

app.post('/complete-purchase', async (req, res, next) => {
  try {
    const { productQuantities } = req.body;
    console.log("Received product quantities:", productQuantities);  // Debugging-loggning

    const allProducts = await readProducts();

    Object.entries(productQuantities).forEach(([productId, quantity]) => {
      const product = allProducts.find(p => p.id === productId);
      if (product && product.stock >= quantity) {
        console.log(`Updating stock for product ${productId}: ${product.stock} - ${quantity}`); // Före uppdatering
        product.stock -= quantity;
        console.log(`New stock for product ${productId}: ${product.stock}`); // Efter uppdatering
      }
    });

    await writeProducts(allProducts);

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'update', products: allProducts }));
      }
    });

    res.json({ success: true, message: 'Köp genomfört och lager uppdaterat' });
  } catch (err) {
    console.error('Error completing purchase:', err);
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Något gick fel på servern', error: err.message });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Servern körs på port ${port} med WebSocket-stöd`);
});

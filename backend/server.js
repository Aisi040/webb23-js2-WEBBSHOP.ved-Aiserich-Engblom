const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001',
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
    // Returnera en tom lista om det inte finns några produkter
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
    const products = await readProducts();
    res.json(products);
  } catch (err) {
    next(err);
  }
});

app.post('/purchase', async (req, res, next) => {
  // ... kod för att hantera köp ...
});

app.post('/update-inventory', async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const products = await readProducts();

    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        const updatedStock = product.stock - quantity;
        if (updatedStock < 0) {
          return { ...product, stock: 0 };
        }
        return { ...product, stock: updatedStock };
      }
      return product;
    });

    await writeProducts(updatedProducts);
    res.json({ success: true, message: 'Lager uppdaterat' });
  } catch (err) {
    console.error('Error updating inventory:', err);
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke on the server', error: err.message });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

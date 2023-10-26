const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001', // Byt ut mot din frontend-serverns adress
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

app.post('/purchase', async (req, res, next) => {
  try {
    const { products: purchasedProducts } = req.body;
    const allProducts = await readProducts();

    purchasedProducts.forEach((purchasedProduct) => {
      const product = allProducts.find(p => p.id === purchasedProduct.id);
      if (product) {
        product.stock = Math.max(0, product.stock - purchasedProduct.quantity);
      }
    });

    await writeProducts(allProducts);
    res.json({ success: true, message: 'Köp genomfört, lager uppdaterat' });
  } catch (err) {
    next(err);
  }
});

app.post('/update-inventory', async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const products = await readProducts();

    const product = products.find(p => p.id === productId);
    if (product) {
      product.stock = Math.max(0, product.stock - quantity);
      await writeProducts(products);
      res.json({ success: true, message: 'Lager uppdaterat' });
    } else {
      res.status(404).json({ success: false, message: 'Produkten hittades inte' });
    }
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

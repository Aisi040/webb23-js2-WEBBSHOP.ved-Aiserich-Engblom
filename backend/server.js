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

    const outOfStock = purchasedProducts.filter(purchasedProduct => {
      const product = allProducts.find(p => p.id === purchasedProduct.id);
      return !product || product.stock < purchasedProduct.quantity;
    });

    if (outOfStock.length > 0) {
      return res.status(400).json({ success: false, message: 'Vissa produkter finns inte i lager' });
    }

    purchasedProducts.forEach((purchasedProduct) => {
      const product = allProducts.find(p => p.id === purchasedProduct.id);
      if (product) {
        product.stock -= purchasedProduct.quantity;
      }
    });

    await writeProducts(allProducts);

    res.json({ success: true, message: 'Köp genomfört, lager uppdaterat' });
  } catch (err) {
    console.error('Error during purchase:', err);
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

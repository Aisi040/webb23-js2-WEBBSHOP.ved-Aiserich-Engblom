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

const defaultProducts = [
  { id: 1, name: 'Djupskogsveden', price: 1800, isBestseller: false, description: 'En blandning av björk, ek och ask. Perfekt för kalla vinterkvällar och ger en behaglig doft.' },
  { id: 2, name: 'Lugna nätter', price: 1500, isBestseller: true, description: 'Vår mest prisvärda ved, ett bra val för den som vill ha bra värde för pengarna.' },
  { id: 3, name: 'Premium Ek', price: 2200, isBestseller: true, description: 'Vår premium ekved ger mycket värme och har en lång brinntid.' },
  { id: 4, name: 'Björkved Deluxe', price: 2000, isBestseller: false, description: 'Björkved av hög kvalitet, väljer du detta kan du inte gå fel.' },
  { id: 5, name: 'Ask och Björk', price: 1700, isBestseller: false, description: 'En blandning av ask och björk, ger en jämn och fin brasa.' },
  { id: 6, name: 'Sommarkväll', price: 1600, isBestseller: true, description: 'Perfekt för en sommarkväll vid eldstaden eller eldkorgen.' }
];

async function readProducts() {
  try {
    const data = await fs.readFile(productsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading products file:', err);
    // Om filen inte finns, returnera standardprodukterna
    return defaultProducts;
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
    const { query } = req;
    const products = await readProducts();
    let filteredProducts = products;

    // ... kod för att filtrera produkter ...

    res.json(filteredProducts);
  } catch (err) {
    next(err);
  }
});

app.post('/purchase', async (req, res, next) => {
  // ... kod för att hantera köp ...
});

// Lägg till en API-rutt för att uppdatera lagerantalet
app.post('/update-inventory', async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const products = await readProducts();

    // Här bör du implementera logiken för att uppdatera lagret
    // baserat på productId och quantity.

    // Exempel: Hitta rätt produkt och dra av antalet från lagret.
    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        const updatedProduct = { ...product };
        updatedProduct.inventory -= quantity;
        return updatedProduct;
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

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001', // Uppdatera till din frontend-serverns adress
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type'
}));

const productsFilePath = path.join(__dirname, 'data', 'products.json');

// Funktion för att läsa produkter från JSON-filen
async function readProducts() {
  try {
    const data = await fs.readFile(productsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading products file:', err);
    return [];
  }
}

// Funktion för att skriva produkter till JSON-filen
async function writeProducts(products) {
  try {
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
  } catch (err) {
    console.error('Error writing products file:', err);
    throw err;
  }
}

// Roten av din webbserver, ger ett välkomstmeddelande
app.get('/', (req, res) => {
  res.send('Welcome to the webshop backend!');
});

// En endpoint för att hämta produkter, med möjlighet att filtrera med en sökterm
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

// En endpoint för att genomföra ett köp och uppdatera lagerstatus
app.post('/update-inventory', async (req, res, next) => { // Ändra endpoint till /update-inventory
  try {
    const { productId, quantity } = req.body; // Anpassa förväntad request body
    const allProducts = await readProducts();

    const product = allProducts.find(p => p.id === productId);

    if (!product || product.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Produkten finns inte i lager eller tillräckligt med lager' });
    }

    product.stock -= quantity;

    await writeProducts(allProducts);

    res.json({ success: true, message: 'Lager uppdaterat' });
  } catch (err) {
    console.error('Error updating inventory:', err);
    next(err);
  }
});

// Middleware för att hantera fel och skicka felmeddelanden till klienten
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Något gick fel på servern', error: err.message });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Servern körs på port ${port}`);
});

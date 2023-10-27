import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import ProductList from './components/ProductList';
import ShoppingCart from './components/ShoppingCart';
import Footer from './components/Footer'; 
import HomePage from './components/HomePage';
import BackgroundImage from './components/BackgroundImage';
import ContactPage from './components/ContactPage';
import './style.css';

function App() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/products'); 
      setProducts(response.data);
    } catch (error) {
      setError('Det gick inte att hämta produkterna');
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = product => {
    setCart([...cart, product]);
  };

  const handleRemoveFromCart = index => {
    if (index === -1) setCart([]); // Clear the entire cart
    else setCart(cart.filter((_, i) => i !== index));
  };

  const handleCheckout = async () => {
    try {
      const productQuantities = cart.reduce((acc, product) => {
        acc[product.id] = (acc[product.id] || 0) + 1;
        return acc;
      }, {});

      const purchasedProducts = Object.keys(productQuantities).map(id => ({
        id,
        quantity: productQuantities[id]
      }));

      const response = await axios.post('http://localhost:3000/purchase', { products: purchasedProducts });
      if (response.data.success) {
        alert('Köp genomfört!');
        setCart([]); // Clear the cart after purchase
        fetchProducts(); // Fetch products again to update the stock
      } else {
        alert('Kunde inte genomföra köpet: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error during purchase:', error);
      alert('Ett fel uppstod vid köp.');
    }
  };

  const handleSearch = term => {
    setSearchTerm(term.toLowerCase());
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm)
  );

  return (
    <Router>
      <Header cartCount={cart.length} onSearch={handleSearch} />
      <div className="container mt-4" style={{ minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={error ? <p>{error}</p> : <HomePage products={filteredProducts} onAddToCart={handleAddToCart} />} />
          <Route path="/produkter" element={error ? <p>{error}</p> : <ProductList products={filteredProducts} onAddToCart={handleAddToCart} />} />
          <Route path="/kundvagn" element={<ShoppingCart cart={cart} onRemoveFromCart={handleRemoveFromCart} onCheckout={handleCheckout} />} />
          <Route path="/kontakt" element={<ContactPage />} />
        </Routes>
      </div>
      <div style={{ minHeight: '200px' }}>
        {/* scrolling */}
      </div>
      <BackgroundImage />
      <Footer />
    </Router>
  );
}

export default App;

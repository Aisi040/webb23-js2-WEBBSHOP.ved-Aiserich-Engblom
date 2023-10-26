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
import PropTypes from 'prop-types';

function App() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/products'); // Byt ut mot din backend-URL
        setProducts(response.data);
      } catch (error) {
        setError('Det gick inte att hämta produkterna');
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = product => {
    setCart([...cart, product]);
  };

  const handleRemoveFromCart = index => {
    if (index === -1) setCart([]); // Clear the entire cart
    else setCart(cart.filter((_, i) => i !== index));
  };

  const handleCheckout = () => {
    alert('Köp genomfört!');
    setCart([]); // Clear the cart after purchase
  };

  return (
    <Router>
      <Header cartCount={cart.length} />
      <div className="container mt-4" style={{ minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={error ? <p>{error}</p> : <HomePage products={products} onAddToCart={handleAddToCart} />} />
          <Route path="/produkter" element={error ? <p>{error}</p> : <ProductList products={products} onAddToCart={handleAddToCart} />} />
          <Route path="/kundvagn" element={<ShoppingCart cart={cart} onRemoveFromCart={handleRemoveFromCart} onCheckout={handleCheckout} />} />
          <Route path="/kontakt" element={<ContactPage />} />
          {/* Lägg till fler Routes här om du vill */}
        </Routes>
      </div>
      <div style={{ minHeight: '200px' }}>
        {/* Extra utrymme för att möjliggöra scrolling */}
      </div>
      <BackgroundImage />
      <Footer />
    </Router>
  );
}

App.propTypes = {
  products: PropTypes.array,
  cart: PropTypes.array,
  error: PropTypes.string,
  handleAddToCart: PropTypes.func,
  handleRemoveFromCart: PropTypes.func,
  handleCheckout: PropTypes.func,
};

export default App;
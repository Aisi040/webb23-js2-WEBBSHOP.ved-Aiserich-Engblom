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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('lowest');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/products');
        setProducts(response.data);
      } catch (error) {
        setError('Det gick inte att hämta produkterna');
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();

    const ws = new WebSocket('ws://localhost:3000');

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'update' && message.products) {
        setProducts(message.products);
      }
    };

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const handleAddToCart = product => {
    const countInCart = cart.filter(item => item.id === product.id).length;

    if (countInCart < product.stock) {
      setCart([...cart, product]);
    } else {
      alert('Det finns inte tillräckligt många av denna produkt i lager för att lägga till fler.');
    }
  };

  const handleRemoveFromCart = index => {
    if (index === -1) setCart([]); 
    else setCart(cart.filter((_, i) => i !== index));
  };

  const handleCheckout = async () => {
    try {
      const productQuantities = cart.reduce((acc, product) => {
        acc[product.id] = (acc[product.id] || 0) + 1;
        return acc;
      }, {});

      const response = await axios.post('http://localhost:3000/complete-purchase', { productQuantities });

      if (response.status === 200) {
        alert('Köp genomfört!');
        setCart([]);

        setProducts(prevProducts => prevProducts.map(product => {
          const count = productQuantities[product.id] || 0;
          return { ...product, stock: Math.max(product.stock - count, 0) };
        }));
      }
    } catch (error) {
      console.error('Error completing purchase:', error);
      alert('Ett fel uppstod vid köpet.');
    }
  };

  const handleSearch = term => {
    setSearchTerm(term.toLowerCase());
  };

  const handleSort = order => {
    setSortOrder(order);
  };

  const filteredAndSortedProducts = products
    .filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    )
    .sort((a, b) => {
      if (sortOrder === 'lowest') {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });

  return (
    <Router>
      <Header cartCount={cart.length} onSearch={handleSearch} onSort={handleSort} />
      <div className="container mt-4" style={{ minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={error ? <p>{error}</p> : <HomePage products={filteredAndSortedProducts} onAddToCart={handleAddToCart} />} />
          <Route path="/produkter" element={error ? <p>{error}</p> : <ProductList products={filteredAndSortedProducts} onAddToCart={handleAddToCart} />} />
          <Route path="/kundvagn" element={<ShoppingCart cart={cart} onRemoveFromCart={handleRemoveFromCart} onCheckout={handleCheckout} />} />
          <Route path="/kontakt" element={<ContactPage />} />
        </Routes>
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

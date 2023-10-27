import React from 'react';
import Bestsellers from './Bestsellers';

function HomePage({ products, onAddToCart }) {
  const textStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    display: 'inline-block',
    padding: '5px 10px',
    borderRadius: '2px',
    textAlign: 'center',
    width: '100%',
  };

  return (
    <div>
      <h1 style={textStyle}>Välkommen till vår webbshop!</h1>
      <Bestsellers products={products} onAddToCart={onAddToCart} />
    </div>
  );
}

export default HomePage;

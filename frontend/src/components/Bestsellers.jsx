import React from 'react';
import Product from './Product';
import PropTypes from 'prop-types';

function Bestsellers({ products, onAddToCart }) {
  const bestsellers = products
    .filter(product => product.isBestseller)
    .slice(0, 3); // Hämta tre bästsäljande produkterna

  const textStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.4)', 
    padding: '5px 10px',
    borderRadius: '2px',
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        <span style={textStyle}>Våra 3 Bästsäljare:</span>
      </h2>
      <div className="row">
        {bestsellers.map(product => (
          <div key={product.id} className="col-md-4">
            <Product 
              product={product} 
              onAddToCart={onAddToCart} 
              showStockInfo={false}  // Inte visa lagerinfo
            />
          </div>
        ))}
      </div>
    </div>
  );
}

Bestsellers.propTypes = {
  products: PropTypes.array.isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default Bestsellers;

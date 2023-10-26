import React from 'react';
import Product from './Product';
import PropTypes from 'prop-types';

function ProductList({ products, onAddToCart }) {
  if (!products || products.length === 0) {
    return <p>Det finns inga produkter att visa.</p>;
  }

  return (
    <div className="container">
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-md-4 mb-4">
            <Product product={product} onAddToCart={onAddToCart} />
          </div>
        ))}
      </div>
    </div>
  );
}

ProductList.propTypes = {
  products: PropTypes.array.isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductList;

import React from 'react';
import Product from './Product';
import PropTypes from 'prop-types';

function ProductList({ products, onAddToCart }) {
  const onUpdateStock = (productId, newStock) => {
    // Här kan du uppdatera lagret i din applikationens state
    console.log(`Lager uppdaterat för produkt ${productId}: Nytt lager är ${newStock}`);
  };

  if (!products || products.length === 0) {
    return <p>Det finns inga produkter att visa.</p>;
  }

  return (
    <div className="container">
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-md-4 mb-4">
            <Product 
              product={product} 
              onAddToCart={onAddToCart}
              onUpdateStock={onUpdateStock}
            />
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

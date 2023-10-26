import React, { useState } from 'react';
import Product from './Product';
import PropTypes from 'prop-types';

function ProductList({ products, onAddToCart }) {
  const [productList, setProductList] = useState(products);

  const handleAddToCart = (product) => {
    // Din logik för att lägga till produkten i kundvagnen
    onAddToCart(product);
  };

  const handleUpdateStock = (productId, newStock) => {
    setProductList((prevProducts) => 
      prevProducts.map((product) => 
        product.id === productId ? { ...product, stock: newStock } : product
      )
    );
  };

  if (!productList || productList.length === 0) {
    return <p>Det finns inga produkter att visa.</p>;
  }

  return (
    <div className="container">
      <div className="row">
        {productList.map((product) => (
          <div key={product.id} className="col-md-4 mb-4">
            <Product 
              product={product} 
              onAddToCart={handleAddToCart}
              onUpdateStock={handleUpdateStock}
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

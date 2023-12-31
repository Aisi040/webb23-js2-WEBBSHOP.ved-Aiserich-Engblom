import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './Product.css';

const IMAGE_BASE_URL = process.env.PUBLIC_URL + '/Bilder/';

function Product({ product, onAddToCart, showStockInfo }) {
  const imageUrl = `${IMAGE_BASE_URL}${product.image}`;
  const [addingToCart, setAddingToCart] = useState(false);

  const addToCart = () => {
    setAddingToCart(true);
    onAddToCart(product);
    setAddingToCart(false);
  };

  return (
    <div className="card h-100">
      <img
        src={imageUrl}
        alt={product.name}
        className="card-img-top"
        onError={(e) => {
          e.target.src = 'fallback-image-url';
          e.target.alt = 'Bild saknas';
        }}
      />
      {product.isBestseller && (
        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
          Bästsäljare
        </span>
      )}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text flex-grow-1">{product.description}</p>
        <p className="card-text">
          <strong>{product.price} kr</strong>
        </p>
        {product.stock > 0 ? (
          <div>
            {showStockInfo && (
              <p className="card-text">
                Antal i lager: {product.stock}
              </p>
            )}
            <button
              onClick={addToCart}
              className="btn btn-primary mt-2"
              disabled={addingToCart}
            >
              {addingToCart ? 'Lägger till...' : 'Lägg till i kundvagn'}
            </button>
          </div>
        ) : (
          <div>
            <p className="card-text text-danger">
              Produkten är tyvärr slut i lager.
            </p>
            <button
              className="btn btn-secondary mt-2"
              disabled={true}
            >
              Slut i lager
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

Product.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    image: PropTypes.string,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    isBestseller: PropTypes.bool,
    stock: PropTypes.number.isRequired,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
  showStockInfo: PropTypes.bool,
};

Product.defaultProps = {
  showStockInfo: true,
};

export default Product;

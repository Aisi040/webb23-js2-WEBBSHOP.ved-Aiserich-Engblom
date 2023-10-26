import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import './Product.css';

function Product({ product, onAddToCart, onUpdateStock, showStockInfo }) {
  const imageUrl = product.image || 'standard-bild-url'; // Ersätt 'standard-bild-url' med den faktiska URL:en till din standardbild
  const [addingToCart, setAddingToCart] = useState(false);

  const addToCart = async () => {
    try {
      setAddingToCart(true);
      const result = await axios.post('http://localhost:3000/update-inventory', {
        productId: product.id,
        quantity: 1,
      });
      if (result.status === 200) {
        onAddToCart(product);
        onUpdateStock(product.id, product.stock - 1); // Uppdatera lagersaldot
      }
      setAddingToCart(false);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setAddingToCart(false);
    }
  };

  return (
    <div className="card h-100">
      <img
        src={imageUrl}
        alt={product.name}
        className="card-img-top"
        onError={(e) => {
          e.target.src = 'fallback-image-url'; // Ersätt 'fallback-image-url' med den faktiska URL:en till din fallback-bild
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
              Lägg till i kundvagn
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

Product.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    image: PropTypes.string,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    isBestseller: PropTypes.bool,
    stock: PropTypes.number.isRequired,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
  onUpdateStock: PropTypes.func.isRequired,
  showStockInfo: PropTypes.bool, // Ny prop för att styra visning av lagerstatus
};

Product.defaultProps = {
  showStockInfo: true,  // Visa lagerinfo som standard
};

export default Product;

import React from 'react';
import PropTypes from 'prop-types';
import './ProductListItem.css';

function ProductListItem({ product, onAddToCart }) {
  const imageUrl = product.image || 'standard-bild-url';

  return (
    <div className="card h-100">
      <img 
        src={imageUrl} 
        alt={product.name} 
        className="card-img-top"
        onError={(e) => { e.target.src = 'fallback-image-url'; e.target.alt='Bild saknas'; }}
      />
      {product.isBestseller && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">Bästsäljare</span>}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text flex-grow-1">{product.description}</p>
        <p className="card-text"><strong>{product.price} kr</strong></p>
        <p className="card-text">Antal i lager: {product.stock}</p> {/* Här visas antalet i lager */}
        <button onClick={() => onAddToCart(product)} className="btn btn-primary mt-2">Lägg till i kundvagn</button>
      </div>
    </div>
  );
}

ProductListItem.propTypes = {
  product: PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    isBestseller: PropTypes.bool,
    stock: PropTypes.number.isRequired, // Lägg till stock i PropTypes
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductListItem;


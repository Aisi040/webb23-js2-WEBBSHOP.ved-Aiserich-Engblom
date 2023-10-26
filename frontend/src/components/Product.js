import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios'; // Importera Axios

import './Product.css'; // Importera din CSS-fil här

function Product({ product, onAddToCart }) {
  const imageUrl = product.image || 'standard-bild-url'; // Lägg till URL för standardbild här
  const [addingToCart, setAddingToCart] = useState(false); // State för att hantera tillägg i kundvagnsstatus

  // Funktion för att göra API-anrop när en produkt läggs till i kundvagnen
  const addToCart = async () => {
    try {
      setAddingToCart(true); // Uppdatera tillägg i kundvagnsstatus till true
      await axios.post('http://localhost:3000/update-inventory', {
        productId: product.id,
        quantity: 1, // Antal att ta bort från lagret (1 st i detta fall)
      });
      onAddToCart(product); // Lägg till produkten i kundvagnen (uppdatera din kundvagnslogik här)
      setAddingToCart(false); // Återställ tillägg i kundvagnsstatus till false
    } catch (error) {
      console.error('Error adding to cart:', error);
      setAddingToCart(false); // Återställ tillägg i kundvagnsstatus till false om det uppstod ett fel
    }
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
        }} // Fallback för bild
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
            <p className="card-text">
              Antal i lager: {product.stock}
            </p>
            <button
              onClick={addToCart} // Anropa addToCart-funktionen när knappen klickas
              className="btn btn-primary mt-2"
              disabled={addingToCart} // Inaktivera knappen om produkten läggs till i kundvagnen
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
              onClick={addToCart} // Anropa addToCart-funktionen när knappen klickas
              className="btn btn-secondary mt-2"
              disabled={true} // Inaktivera knappen om produkten inte finns i lager
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
    image: PropTypes.string,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    isBestseller: PropTypes.bool,
    stock: PropTypes.number.isRequired, // Lägg till stock i propTypes
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default Product;

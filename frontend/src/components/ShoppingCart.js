import React from 'react';

function ShoppingCart({ cart, onRemoveFromCart, onCheckout }) {
  const totalPrice = cart.reduce((acc, product) => acc + product.price, 0);

  const cartStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
  };

  return (
    <div style={cartStyle}>
      <h2>Kundvagn</h2>
      <ul>
        {cart.map((product, index) => (
          <li key={index}>
            {product.name} - {product.price} SEK
            <button onClick={() => onRemoveFromCart(index)}>Ta bort</button>
            <span> Antal i lager: {product.stock}</span>
          </li>
        ))}
      </ul>
      <p>Totalt: {totalPrice} SEK</p>
      <button onClick={onCheckout}>Genomför köp</button>
      <button onClick={() => onRemoveFromCart(-1)}>Töm kundvagn</button>
    </div>
  );
}

export default ShoppingCart;

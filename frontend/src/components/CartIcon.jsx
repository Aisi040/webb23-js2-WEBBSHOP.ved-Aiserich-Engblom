
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

function CartIcon({ cartCount }) {
  return (
    <div style={{ position: 'relative' }}>
      <FontAwesomeIcon icon={faShoppingCart} size="lg" />
      {cartCount > 0 && (
        <span style={{
          position: 'absolute',
          top: 0,
          right: 0,
          backgroundColor: 'red',
          color: 'white',
          borderRadius: '50%',
          padding: '2px 6px',
          fontSize: '12px',
        }}>
          {cartCount}
        </span>
      )}
    </div>
  );
}

export default CartIcon;

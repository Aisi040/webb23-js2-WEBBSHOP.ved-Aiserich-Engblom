// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import CartIcon from './CartIcon';
import SearchBar from './SearchBar';

function Header({ cartCount, onSearch }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">VED</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Hem</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/produkter">Produkter</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/kundvagn">Kundvagn</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/kontakt">Kontakt</Link>
            </li>
          </ul>
          <SearchBar onSearch={onSearch} />
        </div>
        <Link to="/kundvagn" className="nav-link">
          <CartIcon cartCount={cartCount} />
        </Link>
      </div>
    </nav>
  );
}

export default Header;

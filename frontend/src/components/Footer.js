import React from 'react';
import './Footer.css'; // Importera din CSS-fil för stilar

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Ditt Företagsnamn</p>
      <p>Alla rättigheter förbehållna</p>
    </footer>
  );
}

export default Footer;

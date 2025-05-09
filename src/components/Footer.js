// src/components/Footer.js
import React from 'react';

function Footer() {
  return (
    <footer style={{ background: '#333', color: 'white', padding: '1rem', textAlign: 'center' }}>
      <p>© {new Date().getFullYear()} CCS Mailing Campaign. All rights reserved.</p>
      <p>Ahmed Ali Head Engineer</p>
    </footer>
  );
}

export default Footer;
// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ background: '#333', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
          CCS Mailing Campaign
        </Link>
        <div>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', marginRight: '1rem' }}>Home</Link>
          <Link to="/search" style={{ color: 'white', textDecoration: 'none', marginRight: '1rem' }}>Search</Link>
          <Link to="/import" style={{ color: 'white', textDecoration: 'none', marginRight: '1rem' }}>Import</Link>
          {/* <Link to="/export" style={{ color: 'white', textDecoration: 'none', marginRight: '1rem' }}>Export</Link> */}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
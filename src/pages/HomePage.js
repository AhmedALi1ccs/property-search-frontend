// src/pages/HomePage.js
import React from 'react';
import '../styles/HomePage.css';
import ccsLogo from '../assets/ccs-logo.png'; // You'll need to add this logo file

function HomePage() {
  return (
    <div className="home-container">
      <div className="welcome-section">
        <img src={ccsLogo} alt="CCS Logo" className="ccs-logo" />
        <h1>Welcome to the CCS Mailing Campaign Archive</h1>
        <p className="welcome-text">
          Access and search through our comprehensive database of property mailings.
          Find detailed information on properties, owners, and mailing histories.
        </p>
        <div className="button-container">
          <a href="https://ahmedali1ccs.github.io/property-search-frontend/#/search" className="cta-button">Search Properties</a>
          <a href="https://ahmedali1ccs.github.io/property-search-frontend/#/import" className="cta-button secondary">Import Data</a>
        </div>
      </div>
      
      <div className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <i className="fas fa-search feature-icon"></i>
            <h3>Advanced Search</h3>
            <p>Search by address, owner, or location to find relevant property records</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-database feature-icon"></i>
            <h3>Cash Offer</h3>
            <p>Comprehensive database of property mailings with detailed information</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-file-import feature-icon"></i>
            <h3>Easy Import</h3>
            <p>Quickly import new mailing data using our CSV upload tool</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
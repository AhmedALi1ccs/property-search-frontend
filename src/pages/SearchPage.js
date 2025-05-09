// src/pages/SearchPage.js
import React, { useState } from 'react';
import '../styles/SearchPage.css';
import axios from 'axios';
import '../styles/SearchPage.css';
function SearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('both');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
  
    // Update your search function in SearchPage.js to include error details
const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setMessage('Please enter a search term');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    
    try {
      // Add some debugging logs
      console.log('Sending search request:', searchQuery, searchType);
      
      const response = await axios.get(`http://localhost:3000/api/v1/search`, {
        params: {
          q: searchQuery,
          type: searchType
        }
      });
      
      // Log the response
      console.log('Search response:', response.data);
      
      setSearchResults(response.data);
      setIsLoading(false);
      
      if (response.data.length === 0) {
        setMessage('No results found. Try a different search term.');
      }
    } catch (error) {
      console.error('Search error:', error);
      // Show more detailed error information
      setMessage(`Error: ${error.message || 'An unknown error occurred'}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="search-container">
      <h1>Property Search</h1>
      <p className="search-intro">
        Search for properties by address, owner information, or other details.
      </p>
      
      <div className="search-form-container">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Enter address, name, or zip code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            
            <select 
              value={searchType} 
              onChange={(e) => setSearchType(e.target.value)}
              className="search-type"
            >
              <option value="both">All Addresses</option>
              <option value="property">Property Address Only</option>
              <option value="mailing">Mailing Address Only</option>
            </select>
          </div>
          
          <button type="submit" className="search-button">
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>
      
      {message && <p className="search-message">{message}</p>}
      
      {searchResults.length > 0 && (
        <div className="search-results">
          <h2>Search Results</h2>
          <div className="results-table-container">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Property Address</th>
                  <th>Mailing Address</th>
                  <th>Value</th>
                  <th>Month</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map(result => (
                  <tr key={result.id}>
                    <td>{result.full_name}</td>
                    <td>
                      {result.property_address}<br />
                      {result.property_city}, {result.property_state} {result.property_zip}
                    </td>
                    <td>
                      {result.mailing_address}<br />
                      {result.mailing_city}, {result.mailing_state} {result.mailing_zip}
                    </td>
                    <td>${parseFloat(result.checkval).toLocaleString()}</td>
                    <td>{result.mail_month}</td>
                    <td>
                      <button className="action-button view">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
// src/pages/SearchPage.js
import React, { useState, useEffect } from 'react';
import '../styles/SearchPage.css';
import axios from 'axios';
import config from '../config';

function SearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('both');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Debug useEffect
    useEffect(() => {
        console.log('Modal state changed:', showModal);
        console.log('Selected property:', selectedProperty);
    }, [showModal, selectedProperty]);

    const handleSearch = async (e) => {
        e.preventDefault();
        
        if (!searchQuery.trim()) {
          setMessage('Please enter a search term');
          return;
        }
        
        setIsLoading(true);
        setMessage('');
        
        try {
          console.log('Searching for:', searchQuery);
          const response = await axios.get(`${config.API_URL}/search`, {
            params: {
              q: searchQuery,
              type: searchType
            }
          });
          
          console.log('Search results:', response.data);
          setSearchResults(response.data);
          setIsLoading(false);
          
          if (response.data.length === 0) {
            setMessage('No results found. Try a different search term.');
          }
        } catch (error) {
          console.error('Search error:', error);
          setMessage(`Error: ${error.message || 'An unknown error occurred'}`);
          setIsLoading(false);
        }
    };

    const handleView = async (property) => {
        console.log('=== VIEW BUTTON CLICKED ===');
        console.log('Property ID:', property.id);
        console.log('Property data:', property);
        
        try {
            // Show loading state
            setMessage('Loading property details...');
            
            const url = `${config.API_URL}/mailed/${property.id}`;
            console.log('Fetching from URL:', url);
            
            const response = await axios.get(url);
            console.log('Backend response:', response.data);
            
            // Clear loading message
            setMessage('');
            
            // Set the data and show modal
            setSelectedProperty(response.data);
            setShowModal(true);
            
            console.log('Modal should be visible now');
            console.log('showModal:', true);
            console.log('selectedProperty:', response.data);
            
        } catch (error) {
            console.error('Error fetching property details:', error);
            console.error('Error response:', error.response);
            setMessage(`Error loading property details: ${error.message}`);
        }
    };

    const closeModal = () => {
        console.log('Closing modal');
        setShowModal(false);
        setSelectedProperty(null);
    };

    const formatMailPeriod = (month, year) => {
        if (!month && !year) return 'N/A';
        if (!year) return month || 'N/A';
        if (!month) return year.toString();
        return `${month} ${year}`;
    };

    const formatCheckval = (checkval) => {
        if (!checkval || checkval === 'Call us') return 'Call us';
        const num = parseFloat(checkval);
        return isNaN(num) ? checkval : `$${num.toLocaleString()}`;
    };

    const getListsPreview = (lists) => {
        if (!lists || lists === null) return 'No lists';
        const listsArray = lists.split(',').map(item => item.trim()).filter(item => item);
        if (listsArray.length === 0) return 'No lists';
        if (listsArray.length === 1) return listsArray[0];
        return `${listsArray[0]} +${listsArray.length - 1} more`;
    };

    const parseListsToArray = (lists) => {
        if (!lists || lists === null) return [];
        return lists.split(',').map(item => item.trim()).filter(item => item);
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
                  placeholder="Enter address, name, zip code, or list name..."
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
              <h2>Search Results ({searchResults.length} found)</h2>
              <div className="results-table-container">
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Property Address</th>
                      <th>Mailing Address</th>
                      <th>Value</th>
                      <th>Mail Period</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map(result => (
                      <tr key={result.id}>
                        <td>
                          <div className="name-cell">
                            <div className="full-name">{result.full_name || 'N/A'}</div>
                            {result.first_name && result.last_name && (
                              <div className="name-parts">
                                {result.first_name} {result.last_name}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="address-cell">
                            <div className="street">{result.property_address || 'N/A'}</div>
                            <div className="location">
                              {[result.property_city, result.property_state, result.property_zip]
                                .filter(Boolean)
                                .join(', ')}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="address-cell">
                            <div className="street">{result.mailing_address || 'N/A'}</div>
                            <div className="location">
                              {[result.mailing_city, result.mailing_state, result.mailing_zip]
                                .filter(Boolean)
                                .join(', ')}
                            </div>
                          </div>
                        </td>
                        <td className="value-cell">
                          {formatCheckval(result.checkval)}
                        </td>
                        <td className="period-cell">
                          {formatMailPeriod(result.mail_month, result.mail_year)}
                        </td>
        
                        <td>
                          <button 
                            className="action-button view"
                            onClick={() => handleView(result)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Modal - Simplified inline version */}
          {showModal && (
            <div 
              className="modal-overlay"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  closeModal();
                }
              }}
            >
              <div 
                className="modal-content"
                style={{
                  backgroundColor: 'white',
                  padding: '30px',
                  borderRadius: '12px',
                  maxWidth: '600px',
                  width: '90%',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                  position: 'relative'
                }}
              >
                {/* Close button */}
                <button 
                  onClick={closeModal}
                  style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    background: 'none',
                    border: 'none',
                    fontSize: '30px',
                    cursor: 'pointer',
                    color: '#6b7280',
                    lineHeight: 1,
                    padding: '5px'
                  }}
                >
                  ×
                </button>

                {selectedProperty ? (
                  <>
                    <h2 style={{marginTop: 0, marginBottom: '25px', color: '#1f2937'}}>
                      Property Details
                    </h2>
                    
                    {/* Owner Information */}
                    <div style={{marginBottom: '20px'}}>
                      <h3 style={{color: '#374151', fontSize: '18px', marginBottom: '10px'}}>
                        👤 Owner Information
                      </h3>
                      <p><strong>Full Name:</strong> {selectedProperty.full_name || 'N/A'}</p>
                      <p><strong>First Name:</strong> {selectedProperty.first_name || 'N/A'}</p>
                      <p><strong>Last Name:</strong> {selectedProperty.last_name || 'N/A'}</p>
                    </div>

                    {/* Property Address */}
                    <div style={{marginBottom: '20px'}}>
                      <h3 style={{color: '#374151', fontSize: '18px', marginBottom: '10px'}}>
                        🏠 Property Address
                      </h3>
                      <p>{selectedProperty.property_address || 'N/A'}</p>
                      <p>{selectedProperty.property_city}, {selectedProperty.property_state} {selectedProperty.property_zip}</p>
                    </div>

                    {/* Mailing Address */}
                    <div style={{marginBottom: '20px'}}>
                      <h3 style={{color: '#374151', fontSize: '18px', marginBottom: '10px'}}>
                        📮 Mailing Address
                      </h3>
                      <p>{selectedProperty.mailing_address || 'N/A'}</p>
                      <p>{selectedProperty.mailing_city}, {selectedProperty.mailing_state} {selectedProperty.mailing_zip}</p>
                    </div>

                    {/* Additional Details */}
                    <div style={{marginBottom: '20px'}}>
                      <h3 style={{color: '#374151', fontSize: '18px', marginBottom: '10px'}}>
                        📊 Additional Details
                      </h3>
                      <p>
                        <strong>Property Value:</strong>{' '}
                        <span style={{fontSize: '20px', color: '#10b981', fontWeight: 'bold'}}>
                          {formatCheckval(selectedProperty.checkval)}
                        </span>
                      </p>
                      <p>
                        <strong>Mail Period:</strong>{' '}
                        {formatMailPeriod(selectedProperty.mail_month, selectedProperty.mail_year)}
                      </p>
                    </div>

                    {/* Lists Section */}
                    <div style={{
                      marginBottom: '20px',
                      padding: '20px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '8px',
                      color: 'white'
                    }}>
                      <h3 style={{fontSize: '18px', marginBottom: '15px', color: 'white', marginTop: 0}}>
                        📋 Associated Lists
                      </h3>
                      {selectedProperty.lists && selectedProperty.lists !== null ? (
                        <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                          {parseListsToArray(selectedProperty.lists).map((list, index) => (
                            <span key={index} style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.2)',
                              padding: '8px 16px',
                              borderRadius: '20px',
                              fontSize: '14px',
                              fontWeight: '500',
                              border: '1px solid rgba(255, 255, 255, 0.3)',
                              display: 'inline-block'
                            }}>
                              {list}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p style={{fontStyle: 'italic', opacity: 0.8, margin: 0}}>
                          No lists associated with this property
                        </p>
                      )}
                    </div>

                    {/* Close Button */}
                    <button 
                      onClick={closeModal}
                      style={{
                        width: '100%',
                        padding: '12px 20px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '500'
                      }}
                    >
                      Close
                    </button>
                  </>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </div>
          )}
        </div>
    );
}

export default SearchPage;
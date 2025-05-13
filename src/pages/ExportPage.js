// In your src/pages/ExportPage.js
import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';
import '../styles/ExportPage.css';

function ExportPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [message, setMessage] = useState('');

  const handleExport = async (format) => {
    setIsExporting(true);
    setMessage('');
    
    try {
      // Make sure format is a string, not an object
      console.log(`Requesting export in ${format} format`);
      
      // Use correct string format parameter
      const response = await axios.get(`${config.API_URL}/mailed/export?format=${format}`, {
        responseType: 'blob',  // Important for file downloads
        timeout: 60000  // 60 second timeout
      });
      
      console.log('Export response:', response);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `mailed_records_${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setIsExporting(false);
      setMessage('Export successful!');
    } catch (error) {
      console.error('Export error:', error);
      console.error('Error details:', error.response?.data || 'No response data');
      setMessage(`Export error: ${error.message}`);
      setIsExporting(false);
    }
  };

  return (
    <div className="export-container">
      <h1>Export Data</h1>
      <p className="export-intro">
        Export your mailing database records in different formats.
      </p>
      
      <div className="export-buttons">
        <button 
          onClick={() => handleExport('csv')}  // Pass 'csv' as a string
          className="export-button"
          disabled={isExporting}
        >
          {isExporting ? 'Exporting...' : 'Export as CSV'}
        </button>
        
        <button 
          onClick={() => handleExport('json')}  // Pass 'json' as a string
          className="export-button"
          disabled={isExporting}
        >
          {isExporting ? 'Exporting...' : 'Export as JSON'}
        </button>
      </div>
      
      {message && <p className="export-message">{message}</p>}
    </div>
  );
}

export default ExportPage;
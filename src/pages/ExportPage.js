// src/pages/ExportPage.js
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ExportPage.css';
import config from '../config';
function ExportPage() {
  const [exportFormat, setExportFormat] = useState('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');

  const handleExport = async () => {
    setIsExporting(true);
    setExportMessage('');
    
    try {
      // Request the file from the API
      const response = await axios.get(
        `${config.API_URL}/export`, 
        {
          params: { format: exportFormat },
          responseType: 'blob' // Important for handling file downloads
        }
      );
      
      // Create a download link and trigger it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const filename = response.headers['content-disposition'] 
        ? response.headers['content-disposition'].split('filename=')[1].replace(/"/g, '')
        : `mailing-data.${exportFormat}`;
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      setExportMessage('Export completed successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      setExportMessage('Export failed. Please try again later.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="export-container">
      <h1>Export Mailing Data</h1>
      <p className="export-intro">
        Download your mailing data in your preferred format.
      </p>
      
      <div className="export-options">
        <div className="form-group">
          <label htmlFor="export-format">Select Format:</label>
          <select 
            id="export-format" 
            value={exportFormat} 
            onChange={(e) => setExportFormat(e.target.value)}
            className="export-select"
          >
            <option value="csv">CSV</option>
            <option value="xlsx">Excel (XLSX)</option>
            <option value="json">JSON</option>
          </select>
        </div>
        
        <button 
          className="export-button"
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? 'Exporting...' : 'Export Data'}
        </button>
      </div>
      
      {exportMessage && (
        <div className={`export-message ${exportMessage.includes('failed') ? 'error' : 'success'}`}>
          {exportMessage}
        </div>
      )}
      
      <div className="export-info">
        <h3>About Data Export</h3>
        <p>This tool allows you to export all mailing data for offline use and analysis. Choose your preferred file format:</p>
        <ul>
          <li><strong>CSV</strong> - Simple comma-separated values format, compatible with most spreadsheet applications</li>
          <li><strong>Excel (XLSX)</strong> - Native Microsoft Excel format with proper formatting</li>
          <li><strong>JSON</strong> - Structured data format for programmatic use</li>
        </ul>
        <p>The exported file will contain all records currently in the database.</p>
      </div>
    </div>
  );
}

export default ExportPage;
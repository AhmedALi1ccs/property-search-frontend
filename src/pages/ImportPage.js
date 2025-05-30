// src/pages/ImportPage.js
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ImportPage.css';
import config from '../config';

function ImportPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      setUploadStatus('');
      setUploadResult(null);
    } else {
      setSelectedFile(null);
      setUploadStatus('Please select a valid CSV file.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!selectedFile) {
      setUploadStatus('Please select a CSV file to upload.');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Create form data object
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    try {
      // Simulate upload progress since axios doesn't handle it natively
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);
      
      // Make actual API call to your Rails backend
      const response = await axios.post(
        `${config.API_URL}/mailed/import`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setUploadResult(response.data);
      setIsUploading(false);
      setSelectedFile(null);
      
      // Reset file input
      document.getElementById('file-upload').value = '';
    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
      setUploadStatus('An error occurred during upload. Please try again.');
    }
  };

  const downloadSampleCSV = () => {
    const headers = [
      'full_name',
      'first_name', 
      'last_name',
      'property_address',
      'property_city',
      'property_state',
      'property_zip',
      'mailing_address',
      'mailing_city',
      'mailing_state',
      'mailing_zip',
      'checkval',
      'mail_month',
      'mail_year'
    ];
    
    const sampleData = [
      [
        'John Doe',
        'John',
        'Doe', 
        '123 Main St',
        'Anytown',
        'CA',
        '12345',
        '456 Oak Ave',
        'Somewhere',
        'CA',
        '67890',
        '250000',
        'January',
        '2024'
      ]
    ];
    
    const csvContent = [headers, ...sampleData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mailing_data_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="import-container">
      <h1>Import Mailing Data</h1>
      <p className="import-intro">
        Upload your CSV file to import new mailing data into the system.
      </p>
      
      <div className="import-form-container">
        <form onSubmit={handleSubmit} className="import-form">
          <div className="file-upload-container">
            <label htmlFor="file-upload" className="file-upload-label">
              {selectedFile ? selectedFile.name : 'Choose CSV File'}
            </label>
            <input 
              type="file" 
              id="file-upload" 
              accept=".csv" 
              onChange={handleFileChange}
              className="file-upload-input"
            />
          </div>
          
          {uploadStatus && (
            <div className="upload-status error">{uploadStatus}</div>
          )}
          
          <button 
            type="submit" 
            className="upload-button"
            disabled={isUploading || !selectedFile}
          >
            {isUploading ? 'Uploading...' : 'Upload CSV'}
          </button>
          
          {isUploading && (
            <div className="progress-container">
              <div 
                className="progress-bar" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <div className="progress-text">{uploadProgress}%</div>
            </div>
          )}
        </form>
      </div>
      
      {uploadResult && (
        <div className="upload-result">
          <h2>Import Results</h2>
          <div className="result-summary">
            <div className="result-item success">
              <span className="result-number">{uploadResult.imported}</span>
              <span className="result-label">Records Imported</span>
            </div>
            <div className="result-item update">
              <span className="result-number">{uploadResult.updated}</span>
              <span className="result-label">Records Updated</span>
            </div>
            <div className="result-item error">
              <span className="result-number">{uploadResult.failed}</span>
              <span className="result-label">Failures</span>
            </div>
          </div>
          
          <div className="result-details">
            <p><strong>Total processed:</strong> {uploadResult.total}</p>
            <p><strong>Duration:</strong> {uploadResult.duration} seconds</p>
          </div>
          
          {uploadResult.errors && uploadResult.errors.length > 0 && (
            <div className="error-list">
              <h3>Errors:</h3>
              <ul>
                {uploadResult.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      <div className="csv-guidelines">
        <h3>CSV File Requirements</h3>
        <p>Your CSV file should include the following columns:</p>
        <ul>
          <li><strong>full_name</strong> - Owner's full name</li>
          <li><strong>first_name</strong> - Owner's first name</li>
          <li><strong>last_name</strong> - Owner's last name</li>
          <li><strong>property_address</strong> - Property street address</li>
          <li><strong>property_city</strong> - Property city</li>
          <li><strong>property_state</strong> - Property state (2-letter code)</li>
          <li><strong>property_zip</strong> - Property ZIP code</li>
          <li><strong>mailing_address</strong> - Mailing street address</li>
          <li><strong>mailing_city</strong> - Mailing city</li>
          <li><strong>mailing_state</strong> - Mailing state (2-letter code)</li>
          <li><strong>mailing_zip</strong> - Mailing ZIP code</li>
          <li><strong>checkval</strong> - Property value (can be in format $123,456.78 or 123456.78)</li>
          <li><strong>mail_month</strong> - Month for mailing campaign (e.g., "January", "February")</li>
          <li><strong>mail_year</strong> - Year for mailing campaign (e.g., "2024", "2025") - Optional, defaults to current year</li>
        </ul>
        
        <div className="template-download">
          <button 
            onClick={downloadSampleCSV}
            className="template-button"
          >
            Download CSV Template
          </button>
          <p>Download our sample CSV template to ensure your data is formatted correctly.</p>
        </div>

        <div className="import-notes">
          <h4>Important Notes:</h4>
          <ul>
            <li>If <strong>mail_year</strong> is not provided, it will default to the current year</li>
            <li>Records are updated based on property address - newer dates will overwrite older ones</li>
            <li>Property address is required - rows without it will be skipped</li>
            <li>Checkval can include dollar signs and commas - they will be automatically removed</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ImportPage;
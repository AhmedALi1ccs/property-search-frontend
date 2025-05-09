// src/pages/ImportPage.js
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ImportPage.css';

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
        'http://localhost:3000/api/v1/mailed/import',
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
          <li><strong>checkval</strong> - Property value (can be in format $123,456.78)</li>
          <li><strong>mail_month</strong> - Month for mailing campaign</li>
        </ul>
        <p>Download our <a href="#" className="template-link">CSV template</a> to ensure your data is formatted correctly.</p>
      </div>
    </div>
  );
}

export default ImportPage;
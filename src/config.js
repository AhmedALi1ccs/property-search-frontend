// src/config.js
const config = {
  // Use the deployed API URL to avoid CORS issues
  API_URL: 'https://mailing-database-app.uc.r.appspot.com/api/v1'
  
  // If you want to use localhost, uncomment this and make sure CORS is configured
  API_URL: process.env.NODE_ENV === 'production' 
    ? 'https://mailing-database-app.uc.r.appspot.com/api/v1'
    : 'http://localhost:3000/api/v1'
};

export default config;
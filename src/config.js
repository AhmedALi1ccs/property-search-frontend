// src/config.js
const config = {
  // Use the deployed API URL for production, localhost for development
  API_URL: process.env.NODE_ENV === 'production' 
    ? 'https://mailing-database-app.uc.r.appspot.com/api/v1'
    : 'http://localhost:3000/api/v1'
};

export default config;
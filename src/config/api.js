// src/config/api.js
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-domain.com/api/v1'
  : 'http://localhost:3000/api/v1';

export const API_ENDPOINTS = {
  MAILED: `${API_BASE_URL}/mailed`,
  SEARCH: `${API_BASE_URL}/search`,
  IMPORT: `${API_BASE_URL}/mailed/import`,
  EXPORT: `${API_BASE_URL}/mailed/export`
};
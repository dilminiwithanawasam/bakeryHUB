import axios from 'axios';

// Create a central api handler
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Points to your Node.js backend
});

// Middleware: Attach the Token to every request if we have one
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
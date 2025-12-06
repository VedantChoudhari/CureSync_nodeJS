import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true
});

// attach token if present
api.interceptors.request.use(config => {
  const token = localStorage.getItem('curesync_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

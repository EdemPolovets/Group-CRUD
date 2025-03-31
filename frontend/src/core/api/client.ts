import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosHeaders } from 'axios';
 
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
 
// Add auth token to requests
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    if (!(config.headers instanceof AxiosHeaders)) {
      config.headers = new AxiosHeaders();
    }
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});
 
export { api };

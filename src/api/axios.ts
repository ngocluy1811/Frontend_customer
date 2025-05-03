import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api', // URL của backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm token vào header nếu có
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
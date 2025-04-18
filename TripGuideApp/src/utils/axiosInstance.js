// src/axiosInstance.js или src/utils/axiosInstance.js

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // замени на свой бэкенд URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для подстановки accessToken из localStorage
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;

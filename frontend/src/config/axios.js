import axios from 'axios';

const api = axios.create({
  baseURL: 'https://cortefacil-chat-6b9c1276ad86.herokuapp.com',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api; 
// Configuração da API
const config = {
  development: {
    API_BASE_URL: 'http://localhost:5000'
  },
  production: {
    API_BASE_URL: process.env.REACT_APP_API_URL || 'https://seu-backend-url.herokuapp.com'
  }
};

// Detecta o ambiente atual
const environment = process.env.NODE_ENV || 'development';

// Exporta a configuração do ambiente atual
export const API_BASE_URL = config[environment].API_BASE_URL;

// Função helper para construir URLs da API
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

export default config;
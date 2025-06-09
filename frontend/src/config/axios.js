import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3333/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  config => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Fazendo requisição para:', config.url);
    }
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Erro na preparação da requisição:', error);
    }
    return Promise.reject({
      erro: true,
      mensagem: 'Erro na preparação da requisição'
    });
  }
);

// Interceptor para tratamento de respostas
api.interceptors.response.use(
  response => {
    console.log('Resposta recebida:', response.status);
    return response;
  },
  error => {
    console.error('Erro na resposta:', error);

    // Erro do servidor (401, 403, 500, etc)
    if (error.response) {
      console.log('Status do erro:', error.response.status);
      
      // Token inválido ou expirado
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('tipoPerfil');
        
        // Redireciona para login apenas se não estiver já na página de login
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        
        return Promise.reject({
          erro: true,
          mensagem: 'Sessão expirada. Por favor, faça login novamente.'
        });
      }

      // Acesso negado
      if (error.response.status === 403) {
        return Promise.reject({
          erro: true,
          mensagem: 'Você não tem permissão para realizar esta ação.'
        });
      }

      // Erro de validação
      if (error.response.status === 400) {
        return Promise.reject(error.response.data);
      }

      // Outros erros do servidor
      return Promise.reject({
        erro: true,
        mensagem: error.response.data.mensagem || 'Erro no servidor. Tente novamente mais tarde.'
      });
    }

    // Erro de timeout
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        erro: true,
        mensagem: 'O servidor demorou muito para responder. Tente novamente.'
      });
    }

    // Erro de conexão
    if (error.request) {
      return Promise.reject({
        erro: true,
        mensagem: 'Erro de conexão com o servidor. Verifique sua internet.'
      });
    }

    // Outros erros
    return Promise.reject({
      erro: true,
      mensagem: 'Ocorreu um erro inesperado. Tente novamente.'
    });
  }
);

export default api;
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3333'
    : 'https://cortefacil-chat-6b9c1276ad86.herokuapp.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject({
      erro: true,
      mensagem: 'Erro na preparação da requisição'
    });
  }
);

// Interceptor para tratamento de respostas
api.interceptors.response.use(
  response => response,
  error => {
    // Erro do servidor (401, 403, 500, etc)
    if (error.response) {
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
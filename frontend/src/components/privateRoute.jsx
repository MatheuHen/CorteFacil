import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../config/axios';

const PrivateRoute = ({ children }) => {
  let token = null;
  let user = null;
  let hasError = false;

  try {
    token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (userStr) {
      user = JSON.parse(userStr);
    }
  } catch (error) {
    console.error('Erro ao ler dados do localStorage:', error);
    hasError = true;
  }

  useEffect(() => {
    // Verifica se o token é válido fazendo uma requisição para o backend
    const verificarToken = async () => {
      if (!token) return;

      try {
        await api.get('/api/usuarios/verificar-token');
        console.log('Token válido');
      } catch (error) {
        console.error('Token inválido:', error);
        localStorage.clear();
        window.location.href = '/login';
      }
    };

    verificarToken();
  }, [token]);

  if (hasError || !token || !user) {
    console.log('Redirecionando para login: Token ou user não encontrados');
    return <Navigate to="/login" />;
  }

  // Verifica se é rota de usuários e se o usuário é admin
  if (window.location.pathname === '/usuarios' && user?.tipo !== 'admin') {
    console.log('Acesso negado: Usuário não é admin');
    return <Navigate to="/profile-selection" />;
  }

  return children;
};

export default PrivateRoute;
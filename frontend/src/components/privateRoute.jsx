import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  // Corrigindo a leitura do user do localStorage
  let user = { tipo: 'cliente' }; // valor padrão
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      user = JSON.parse(userStr);
    }
  } catch (error) {
    console.error('Erro ao ler user do localStorage:', error);
    return <Navigate to="/login" />;
  }

  if (!token) {
    return <Navigate to="/login" />;
  }

  // Verifica se é rota de usuários e se o usuário é admin
  if (window.location.pathname === '/usuarios' && user?.tipo !== 'admin') {
    return <Navigate to="/profile-selection" />;
  }

  return children;
};

export default PrivateRoute; 
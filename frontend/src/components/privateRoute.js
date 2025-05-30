// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from './Layout';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

export default PrivateRoute;

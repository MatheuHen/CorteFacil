import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Agendamentos from './pages/Agendamentos';
import Usuarios from './pages/Usuarios';
import ClienteDashboard from './pages/ClienteDashboard';
import BarbeiroDashboard from './pages/BarbeiroDashboard';
import ProfileSelection from './pages/ProfileSelection';
import Layout from './components/Layout';
import PrivateRoute from './components/privateRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Rotas protegidas */}
      <Route
        path="/profile-selection"
        element={
          <PrivateRoute>
            <Layout>
              <ProfileSelection />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/cliente-dashboard"
        element={
          <PrivateRoute>
            <Layout>
              <ClienteDashboard />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/barbeiro-dashboard"
        element={
          <PrivateRoute>
            <Layout>
              <BarbeiroDashboard />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/agendamentos"
        element={
          <PrivateRoute>
            <Layout>
              <Agendamentos />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/usuarios"
        element={
          <PrivateRoute>
            <Layout>
              <Usuarios />
            </Layout>
          </PrivateRoute>
        }
      />
      
      {/* Rota para qualquer outro caminho não definido */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;

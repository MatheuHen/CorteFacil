import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Agendamentos from './pages/Agendamentos.jsx';
import Usuarios from './pages/Usuarios.jsx';
import ClienteDashboard from './pages/ClienteDashboard.js';
import BarbeiroDashboard from './pages/BarbeiroDashboard.js';
import ProfileSelection from './pages/ProfileSelection.js';
import PrivateRoute from './components/privateRoute.jsx';

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
            <ProfileSelection />
          </PrivateRoute>
        }
      />
      <Route
        path="/cliente-dashboard"
        element={
          <PrivateRoute>
            <ClienteDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/barbeiro-dashboard"
        element={
          <PrivateRoute>
            <BarbeiroDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/agendamentos"
        element={
          <PrivateRoute>
            <Agendamentos />
          </PrivateRoute>
        }
      />
      <Route
        path="/usuarios"
        element={
          <PrivateRoute>
            <Usuarios />
          </PrivateRoute>
        }
      />
      
      {/* Rota para qualquer outro caminho não definido */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;

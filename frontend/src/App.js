import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Agendamentos from './pages/Agendamentos';
import Usuarios from './pages/Usuarios';
import ClienteDashboard from './pages/ClienteDashboard';
import BarbeiroDashboard from './pages/BarbeiroDashboard';
import ProfileSelection from './pages/ProfileSelection';
import PrivateRoute from './components/privateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
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
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

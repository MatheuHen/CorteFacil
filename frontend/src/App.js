import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Agendamentos from './pages/Agendamentos';
import Usuarios from './pages/Usuarios';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? <Layout>{children}</Layout> : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
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
        <Route path="/" element={<Navigate to="/agendamentos" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 
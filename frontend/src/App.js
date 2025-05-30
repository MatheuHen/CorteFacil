<<<<<<< HEAD
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
=======
// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ProfileSelection from './pages/ProfileSelection';
import ClienteDashboard from './pages/ClienteDashboard';
import BarbeiroDashboard from './pages/BarbeiroDashboard';
import PrivateRoute from './components/privateRoute';
>>>>>>> e5c03d2b0ab424ffecedba281804953725a2063b

function App() {
  return (
    <BrowserRouter>
      <Routes>
<<<<<<< HEAD
        <Route path="/login" element={<Login />} />
        <Route
          path="/agendamentos"
          element={
            <PrivateRoute>
              <Agendamentos />
=======
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/profile-selection"
          element={
            <PrivateRoute>
              <ProfileSelection />
>>>>>>> e5c03d2b0ab424ffecedba281804953725a2063b
            </PrivateRoute>
          }
        />
        <Route
<<<<<<< HEAD
          path="/usuarios"
          element={
            <PrivateRoute>
              <Usuarios />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/agendamentos" />} />
=======
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
>>>>>>> e5c03d2b0ab424ffecedba281804953725a2063b
      </Routes>
    </BrowserRouter>
  );
}

<<<<<<< HEAD
export default App; 
=======
export default App;
>>>>>>> e5c03d2b0ab424ffecedba281804953725a2063b

// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ProfileSelection from './pages/ProfileSelection';
import ClienteDashboard from './pages/ClienteDashboard';
import BarbeiroDashboard from './pages/BarbeiroDashboard';
import PrivateRoute from './components/privateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;

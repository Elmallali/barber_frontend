// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ClientRoutes } from './routes/ClientRoutes';
import { BarbierRoutes } from './routes/BarbierRoutes';

export function App() {
  const [user] = useState({
    id: 1,
    name: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    email: 'alex@example.com',
    phone: '555-123-4567',
    birthDate: '1990-05-15',
    gender: 'Male',
    totalShaves: 12,
    mostVisitedSalon: 'Classic Cuts',
    avgSessionDuration: 35,
    lastVisit: '2023-10-10',
    favoriteBarber: 'Mike Stevens'
  });

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />        
        <Route path="/client/*" element={<ClientRoutes user={user} />} />
        <Route path="/barbier/*" element={<BarbierRoutes />} />
        <Route path="*" element={<Navigate to="/client" replace />} />
      </Routes>
    </Router>
  );
}

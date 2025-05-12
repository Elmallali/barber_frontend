import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { HomePage } from './pages/HomePage';
import { BookingPage } from './pages/BookingPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { DashboardPage } from './pages/DashboardPage';
import { SelectSalonPage } from './pages/SelectSalonPage';


export function App() {
  // Mock authenticated user
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
      <div className="bg-gray-50 min-h-screen w-full text-gray-800 font-sans">
        <Layout user={user}>
          <Routes>
            <Route path="/" element={<HomePage user={user} />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/select-salon" element={<SelectSalonPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="/dashboard" element={<DashboardPage user={user} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

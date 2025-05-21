// src/routes/ClientRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/client/Layout/Layout';

import { HomePage } from '../pages/client/HomePage';
import { BookingPage } from '../pages/client/BookingPage';
import { SelectSalonPage } from '../pages/client/SelectSalonPage';
import { ConfirmationPage } from '../pages/client/ConfirmationPage';
import { DashboardPage } from '../pages/client/DashboardPage';

export function ClientRoutes({ user }) {
  return (
    <Layout user={user}>
      <Routes>
        <Route path="/" element={<HomePage user={user} />} />
        <Route path="booking" element={<BookingPage />} />
        <Route path="select-salon" element={<SelectSalonPage />} />
        <Route path="confirmation" element={<ConfirmationPage />} />
        <Route path="dashboard" element={<DashboardPage user={user} />} />
        <Route path="*" element={<Navigate to="/client" replace />} />
      </Routes>
    </Layout>
  );
}

// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';

import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

import { ClientRoutes } from './routes/ClientRoutes';
import { Layout as ClientLayout } from './components/client/Layout/Layout';
import { HomePage } from './pages/client/HomePage';
import { BookingPage } from './pages/client/BookingPage';
import { SelectSalonPage } from './pages/client/SelectSalonPage';
import { ConfirmationPage } from './pages/client/ConfirmationPage';
import { DashboardPage } from './pages/client/DashboardPage';

import { BarbierLayout } from './components/barbier/Layout';
import { Dashboard } from './pages/barbier/Dashboard';
import { Queue }     from './pages/barbier/Queue';
import { History }   from './pages/barbier/History';
import { Profile }   from './pages/barbier/Profile';
import { Settings }  from './pages/barbier/Settings';

export function App() {
  // بيانات المستخدم الوهمية
  const [user] = useState({
    id: 1,
    name: 'abdellah elhamouchi',
    avatar:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?...',
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
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* مصادقة */}
          <Route path="/login"  element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* مسارات العميل */}
          <Route path="/client" element={<ClientLayout user={user} />}>
            <Route index element={<HomePage user={user} />} />
            <Route path="booking"       element={<BookingPage />} />
            <Route path="select-salon"  element={<SelectSalonPage />} />
            <Route path="confirmation"  element={<ConfirmationPage />} />
            <Route path="dashboard"     element={<DashboardPage user={user} />} />
            <Route path="*" element={<Navigate to="/client" replace />} />
          </Route>

          {/* مسارات الحلاق (barbier) */}
          <Route path="/barbier" element={<BarbierLayout />}>
            <Route index   element={<Dashboard />} />
            <Route path="queue"    element={<Queue />} />
            <Route path="history"  element={<History />} />
            <Route path="profile"  element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/barbier" replace />} />
          </Route>

          {/* إعادة التوجيه لأي مسار غير معروف */}
          <Route path="*" element={<Navigate to="/client" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

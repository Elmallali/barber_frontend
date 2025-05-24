// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store } from './store';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import api from './service/api';

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

// Import checkAuth directly to avoid dynamic import issues
import { checkAuth } from './store/slices/authSlice';

// AppContent component to access Redux state
const AppContent = () => {
  const dispatch = useDispatch();
  const { user, isLoading, isAuthenticated } = useSelector(state => state.auth);
  const [authChecked, setAuthChecked] = useState(false);
  
  // Check authentication on page load
  useEffect(() => {
    const checkUserAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        // Set the token in API headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Dispatch the checkAuth action to validate the token and get user data
        try {
          await dispatch(checkAuth()).unwrap();
        } catch (error) {
          console.error('Authentication check failed:', error);
        }
      }
      setAuthChecked(true);
    };
    
    checkUserAuth();
  }, [dispatch]);
  
  // Show loading spinner while checking authentication
  if (isLoading || !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2 text-gray-600">Loading BarberTime...</p>
        </div>
      </div>
    );
  }
  
  return (

    <Routes>
      {/* Public Routes - Redirect to appropriate dashboard if already logged in */}
      <Route path="/login" element={
        user ? 
          <Navigate to={user.role === 'BARBER' ? '/barbier' : '/client'} replace /> : 
          <Login />
      } />
      <Route path="/register" element={
        user ? 
          <Navigate to={user.role === 'BARBER' ? '/barbier' : '/client'} replace /> : 
          <Register />
      } />

      {/* Protected Client Routes */}
      <Route path="/client" element={
        <ProtectedRoute requiredRole="CLIENT">
          <ClientLayout user={user} />
        </ProtectedRoute>
      }>
        <Route index element={<HomePage user={user} />} />
        <Route path="booking" element={<BookingPage />} />
        <Route path="select-salon" element={<SelectSalonPage />} />
        <Route path="confirmation" element={<ConfirmationPage />} />
        <Route path="dashboard" element={<DashboardPage user={user} />} />
        <Route path="*" element={<Navigate to="/client" replace />} />
      </Route>

      {/* Protected Barber Routes */}
      <Route path="/barbier" element={
        <ProtectedRoute requiredRole="BARBER">
          <BarbierLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="queue" element={<Queue />} />
        <Route path="history" element={<History />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/barbier" replace />} />
      </Route>

      {/* Default Redirect */}
      <Route path="/" element={<Navigate to={user ? (user.role === 'BARBER' ? '/barbier' : '/client') : '/login'} replace />} />
      <Route path="*" element={<Navigate to={user ? (user.role === 'BARBER' ? '/barbier' : '/client') : '/login'} replace />} />
    </Routes>
  );
};

// Main App component
export function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}

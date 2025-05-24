import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * ProtectedRoute component that redirects to login if user is not authenticated
 * or if the user's role doesn't match the required role
 */
export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();
  const token = localStorage.getItem('token');

  // If authentication is still loading, show a loading indicator
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if ((!isAuthenticated && !token) || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific role is required and user doesn't have it, redirect to appropriate page
  if (requiredRole && user.role !== requiredRole) {
    // Redirect based on the user's actual role
    if (user.role === 'BARBER') {
      return <Navigate to="/barbier" replace />;
    } else {
      return <Navigate to="/client" replace />;
    }
  }

  // User is authenticated and has the required role (or no specific role is required)
  return children;
};

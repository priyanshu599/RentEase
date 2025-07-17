// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // If user is not logged in, redirect them to the login page
    // Pass the current location so we can redirect them back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user?.role !== role) {
    // If user is logged in but does not have the required role,
    // redirect them to the homepage or an unauthorized page.
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

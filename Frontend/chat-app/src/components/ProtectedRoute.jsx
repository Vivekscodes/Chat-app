import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  console.log('isAuthenticated:', isAuthenticated);

  if (isAuthenticated) {
    return children;
  }
  return <Navigate to="/login" />;
};

export default ProtectedRoute;
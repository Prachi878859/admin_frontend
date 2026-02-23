// File should be named: protectedRoutes.jsx (lowercase p)
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {
  const isAuthenticated = localStorage.getItem('adminToken');
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoutes;
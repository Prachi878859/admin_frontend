import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './AdminLogin'; // ✅ Correct path
import AdminLayout from './AdminLayout'; // ✅ Correct path
import Dashboard from './Dashboard'; // ✅ Correct path
import ProtectedRoutes from './protectedRoutes'; // ✅ Correct path (note: .jsx extension)
import UserManagement from './User_Management';
import ReportScreen from './Reports';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<AdminLogin />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoutes />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Add more protected routes here */}
            <Route path="/users" element={<UserManagement />} />
            {/* <Route path="/report" element={<div className="p-8"><h1 className="text-2xl font-bold">Report</h1></div>} /> */}
            <Route path="/report" element={<ReportScreen/>}/>
          </Route>
        </Route>

        {/* Fallback route - redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
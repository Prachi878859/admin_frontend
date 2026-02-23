// Alternative version using Tailwind classes instead of inline styles
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Sidebar - Fixed Height */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-1 bg-white border-r border-gray-200 overflow-hidden">
          {/* Logo at top of sidebar */}
          <div className="flex items-center h-16 px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-red-600 select-none">Koso Admin</h1>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto">
            <nav className="px-4 py-4 space-y-1">
              {/* Dashboard Link */}
              <Link
                to="/dashboard"
                className="group flex items-center px-3 py-3 text-sm font-medium rounded-lg text-gray-900 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 select-none focus:outline-none focus:ring-0"
              >
                <svg className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>
              
              {/* Users Link */}
              <Link
                to="/users"
                className="group flex items-center px-3 py-3 text-sm font-medium rounded-lg text-gray-900 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 select-none focus:outline-none focus:ring-0"
              >
                <svg className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.67 1.67l-1.06-1.06a2 2 0 00-2.83 0l-4.24 4.24a8 8 0 01-2.83 0l-4.24-4.24a2 2 0 00-2.83 0l-1.06 1.06" />
                </svg>
                Users
              </Link>
              
              {/* Reports Link */}
              <Link
                to="/report"
                className="group flex items-center px-3 py-3 text-sm font-medium rounded-lg text-gray-900 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 select-none focus:outline-none focus:ring-0"
              >
                <svg className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Reports
              </Link>
            </nav>
          </div>

          {/* User Info and Logout Button */}
          <div className="flex-shrink-0 border-t border-gray-200 p-4">
            {/* User Info */}
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3 select-none">
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate select-none">Admin User</p>
                <p className="text-xs font-medium text-gray-500 truncate select-none">admin@koso.com</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-semibold rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 select-none focus:outline-none focus:ring-0"
            >
              <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex-shrink-0 bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <h1 className="text-lg font-bold text-red-600 select-none">Koso Admin</h1>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
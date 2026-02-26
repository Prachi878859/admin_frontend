import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './api/axiosInstance';

const Dashboard = () => {
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      
      const response = await axiosInstance.get('/users/');
      
      if (response.data && response.data.success) {
        const usersData = response.data.data || [];
        const totalUsers = response.data.count || 0;
        
        // Count active and inactive users
        let activeUsers = 0;
        let inactiveUsers = 0;
        
        usersData.forEach(user => {
          const status = user.status ? user.status.toLowerCase() : '';
          
          if (status === 'active') {
            activeUsers++;
          } else if (status === 'inactive') {
            inactiveUsers++;
          } else {
            // If status is not specified, consider as active by default
            activeUsers++;
          }
        });
        
        // Update state with calculated values
        setUserStats({
          totalUsers,
          activeUsers,
          inactiveUsers
        });
        
        setUsers(usersData);
        setError(null);
      } else {
        setError('Invalid API response structure');
        
        // Set empty data if API response is invalid
        setUserStats({
          totalUsers: 0,
          activeUsers: 0,
          inactiveUsers: 0
        });
        setUsers([]);
      }
    } catch (err) {
      setError('Failed to load user statistics. Please check your connection.');
      
      // Set empty data if API fails
      setUserStats({
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0
      });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Handle navigation to User Management
  const handleViewAllUsers = () => {
    navigate('/users');
  };

  // Handle navigation to individual user details (click on user row)
  const handleViewUserDetails = (userId) => {
    navigate(`/users/${userId}`);
  };

  const stats = [
    { 
      name: 'Total Users', 
      value: loading ? 'Loading...' : userStats.totalUsers.toLocaleString(), 
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 5.197a6 6 0 00-9-5.197M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    { 
      name: 'Active Users', 
      value: loading ? 'Loading...' : userStats.activeUsers.toLocaleString(), 
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      name: 'Inactive Users', 
      value: loading ? 'Loading...' : userStats.inactiveUsers.toLocaleString(), 
      color: 'bg-gradient-to-r from-gray-500 to-gray-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header - Removed space between Dashboard Overview and layout */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Here's what's happening with your platform today.
        </p>
        {error && (
          <div className="mt-3 px-4 py-2 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {stats.map((stat, index) => (
          <div 
            key={stat.name}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
          >
            <div className={`h-2 ${stat.color}`}></div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                    <div className={`h-12 w-12 rounded-full ${stat.color} flex items-center justify-center shadow-md`}>
                      <span className="text-white">
                        {stat.icon}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      ) : (
                        stat.value
                      )}
                    </p>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        ))}
      </div>

      {/* Main Content - Users Table */}
      <div className="bg-white rounded-xl shadow-lg mt-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Recent Users
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {loading ? 'Loading...' : `Showing ${Math.min(users.length, 5)} of ${users.length} users`}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {/* <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Total: {loading ? '...' : userStats.totalUsers}
              </div> */}
              <button 
                onClick={handleViewAllUsers}
                className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center transition-colors duration-200"
              >
                View All
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td
  className="px-6 py-4 whitespace-nowrap"
  onClick={(e) => e.stopPropagation()}
>
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                          <div className="ml-4">
                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                            <div className="h-3 w-24 bg-gray-100 rounded mt-2"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-40 bg-gray-200 rounded"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                      </td>
                    </tr>
                  ))
                ) : users.length > 0 ? (
                  users.slice(0, 5).map((user) => (
                    <tr 
  key={user.id} 
  className="hover:bg-gray-50 transition-colors duration-200"
>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-100 to-red-200 flex items-center justify-center">
                            <span className="text-red-600 font-bold text-lg">
                              {user.Name?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{user.Name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          user.status?.toLowerCase() === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status?.toLowerCase() === 'active' ? (
                            <>
                              <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                              Active
                            </>
                          ) : (
                            <>
                              <span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span>
                              Inactive
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.Email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(user.created_at)}</div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                        </svg>
                        <p className="text-lg font-medium">No users found</p>
                        <p className="mt-1">No data available from the API</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
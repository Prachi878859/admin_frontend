// import React, { useState, useEffect } from 'react';
// import axiosInstance from './api/axiosInstance';

// const UserManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('All');
  
//   // Status update state
//   const [updatingStatusId, setUpdatingStatusId] = useState(null);
//   const [statusUpdateError, setStatusUpdateError] = useState(null);
//   const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(false);
  
//   // Add User Modal state
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [addFormData, setAddFormData] = useState({
//     Name: '',
//     Email: '',
//     Password: ''
//   });
//   const [addFormErrors, setAddFormErrors] = useState({});
//   const [addSubmitting, setAddSubmitting] = useState(false);
//   const [addSubmitSuccess, setAddSubmitSuccess] = useState(false);

//   // Edit User Modal state
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editFormData, setEditFormData] = useState({
//     id: '',
//     Name: '',
//     Email: '',
//     Password: '',
//     confirmPassword: ''
//   });
//   const [editFormErrors, setEditFormErrors] = useState({});
//   const [editSubmitting, setEditSubmitting] = useState(false);
//   const [editSubmitSuccess, setEditSubmitSuccess] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);
//   const [showPasswordFields, setShowPasswordFields] = useState(false);

//   // Delete state
//   const [deletingId, setDeletingId] = useState(null);
//   const [deleteError, setDeleteError] = useState(null);
//   const [deleteSuccess, setDeleteSuccess] = useState(false);

//   // Fetch users from API
//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await axiosInstance.get('/users');
      
//       if (response.data.success) {
//         const formattedUsers = response.data.data.map(user => ({
//           id: user.id,
//           name: user.Name,
//           email: user.Email,
//           status: user.status || 'Active',
//           joinDate: user.created_at ? new Date(user.created_at).toLocaleDateString('en-CA') : new Date().toLocaleDateString('en-CA')
//         }));
        
//         setUsers(formattedUsers);
//       } else {
//         throw new Error(response.data.message || 'Failed to fetch users');
//       }
//     } catch (err) {
//       console.error('Error fetching users:', err);
//       setError(err.response?.data?.message || err.message || 'Failed to load users. Please try again.');
//       setUsers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Toggle user status (Activate/Deactivate)
//   const toggleUserStatus = async (id) => {
//     try {
//       const user = users.find(u => u.id === id);
//       if (!user) {
//         alert('User not found');
//         return;
//       }
      
//       const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
//       const confirmMessage = user.status === 'Active' 
//         ? `Are you sure you want to deactivate user "${user.name}"?\n\nDeactivated users cannot log in to the application.`
//         : `Are you sure you want to activate user "${user.name}"?\n\nActivated users will be able to log in to the application.`;
      
//       if (!window.confirm(confirmMessage)) {
//         return;
//       }
      
//       setUpdatingStatusId(id);
//       setStatusUpdateError(null);
//       setStatusUpdateSuccess(false);
      
//       const response = await axiosInstance.put(`/users/${id}/status`, { 
//         status: newStatus 
//       });
      
//       if (response.data.success) {
//         setStatusUpdateSuccess(true);
        
//         // Update local state
//         setUsers(users.map(user => 
//           user.id === id 
//             ? { ...user, status: newStatus }
//             : user
//         ));
        
//         // Show success message
//         setTimeout(() => {
//           setStatusUpdateSuccess(false);
//         }, 3000);
//       } else {
//         throw new Error(response.data.message || 'Failed to update user status');
//       }
//     } catch (err) {
//       console.error('Error updating user status:', err);
//       setStatusUpdateError(err.response?.data?.message || err.message || 'Failed to update user status. Please try again.');
      
//       // Show error for 5 seconds
//       setTimeout(() => {
//         setStatusUpdateError(null);
//       }, 5000);
//     } finally {
//       setUpdatingStatusId(null);
//     }
//   };

//   // Handle Add modal open
//   const openAddUserModal = () => {
//     setShowAddModal(true);
//     setAddSubmitSuccess(false);
//     setAddFormData({ Name: '', Email: '', Password: '' });
//     setAddFormErrors({});
//     // Prevent body scroll when modal is open
//     document.body.style.overflow = 'hidden';
//   };

//   // Handle Add modal close
//   const closeAddModal = () => {
//     setShowAddModal(false);
//     setAddFormData({ Name: '', Email: '', Password: '' });
//     setAddFormErrors({});
//     setAddSubmitSuccess(false);
//     // Re-enable body scroll
//     document.body.style.overflow = 'unset';
//   };

//   // Handle Edit modal open
//   const openEditUserModal = (user) => {
//     setEditingUser(user);
//     setShowEditModal(true);
//     setEditSubmitSuccess(false);
//     setEditFormData({
//       id: user.id,
//       Name: user.name,
//       Email: user.email,
//       Password: '',
//       confirmPassword: ''
//     });
//     setEditFormErrors({});
//     setShowPasswordFields(false);
//     // Prevent body scroll when modal is open
//     document.body.style.overflow = 'hidden';
//   };

//   // Handle Edit modal close
//   const closeEditModal = () => {
//     setShowEditModal(false);
//     setEditFormData({ id: '', Name: '', Email: '', Password: '', confirmPassword: '' });
//     setEditFormErrors({});
//     setEditSubmitSuccess(false);
//     setEditingUser(null);
//     setShowPasswordFields(false);
//     // Re-enable body scroll
//     document.body.style.overflow = 'unset';
//   };

//   // Handle form input changes for Add
//   const handleAddInputChange = (e) => {
//     const { name, value } = e.target;
//     setAddFormData({
//       ...addFormData,
//       [name]: value
//     });
//     // Clear error for this field when user starts typing
//     if (addFormErrors[name]) {
//       setAddFormErrors({
//         ...addFormErrors,
//         [name]: ''
//       });
//     }
//   };

//   // Handle form input changes for Edit
//   const handleEditInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditFormData({
//       ...editFormData,
//       [name]: value
//     });
//     // Clear error for this field when user starts typing
//     if (editFormErrors[name]) {
//       setEditFormErrors({
//         ...editFormErrors,
//         [name]: ''
//       });
//     }
//   };

//   // Toggle password fields visibility
//   const togglePasswordFields = () => {
//     setShowPasswordFields(!showPasswordFields);
//     if (!showPasswordFields) {
//       // Clear password fields when showing
//       setEditFormData({
//         ...editFormData,
//         Password: '',
//         confirmPassword: ''
//       });
//       // Clear password errors
//       setEditFormErrors({
//         ...editFormErrors,
//         Password: '',
//         confirmPassword: ''
//       });
//     }
//   };

//   // Validate Add form
//   const validateAddForm = () => {
//     const errors = {};
    
//     if (!addFormData.Name.trim()) {
//       errors.Name = 'Name is required';
//     }
    
//     if (!addFormData.Email.trim()) {
//       errors.Email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addFormData.Email)) {
//       errors.Email = 'Please enter a valid email address';
//     }
    
//     if (!addFormData.Password) {
//       errors.Password = 'Password is required';
//     } else if (addFormData.Password.length < 6) {
//       errors.Password = 'Password must be at least 6 characters';
//     }
    
//     return errors;
//   };

//   // Validate Edit form
//   const validateEditForm = () => {
//     const errors = {};
    
//     if (!editFormData.Name.trim()) {
//       errors.Name = 'Name is required';
//     }
    
//     if (!editFormData.Email.trim()) {
//       errors.Email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFormData.Email)) {
//       errors.Email = 'Please enter a valid email address';
//     }
    
//     // Validate password fields if they are shown and filled
//     if (showPasswordFields) {
//       if (editFormData.Password) {
//         if (editFormData.Password.length < 6) {
//           errors.Password = 'Password must be at least 6 characters';
//         }
        
//         if (!editFormData.confirmPassword) {
//           errors.confirmPassword = 'Please confirm your password';
//         } else if (editFormData.Password !== editFormData.confirmPassword) {
//           errors.confirmPassword = 'Passwords do not match';
//         }
//       } else {
//         errors.Password = 'Password is required when updating';
//       }
//     }
    
//     return errors;
//   };

//   // Handle Add form submission
//   const handleAddSubmit = async (e) => {
//     e.preventDefault();
    
//     const errors = validateAddForm();
//     if (Object.keys(errors).length > 0) {
//       setAddFormErrors(errors);
//       return;
//     }
    
//     try {
//       setAddSubmitting(true);
//       setAddFormErrors({});
      
//       const response = await axiosInstance.post('/users/register', addFormData);
      
//       if (response.data.success) {
//         setAddSubmitSuccess(true);
        
//         // Refresh users list after successful creation
//         setTimeout(() => {
//           fetchUsers();
//           closeAddModal();
//         }, 2000);
//       } else {
//         throw new Error(response.data.message || 'Failed to create user');
//       }
//     } catch (err) {
//       console.error('Error creating user:', err);
      
//       // Handle specific errors
//       if (err.response?.data?.message === 'Email already exists' || err.response?.data?.message?.includes('already exists')) {
//         setAddFormErrors({
//           Email: 'This email is already registered'
//         });
//       } else {
//         setAddFormErrors({
//           general: err.response?.data?.message || err.message || 'Failed to create user. Please try again.'
//         });
//       }
//     } finally {
//       setAddSubmitting(false);
//     }
//   };

//   // Handle Edit form submission
//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
    
//     const errors = validateEditForm();
//     if (Object.keys(errors).length > 0) {
//       setEditFormErrors(errors);
//       return;
//     }
    
//     try {
//       setEditSubmitting(true);
//       setEditFormErrors({});
      
//       // Prepare data for API
//       const updateData = {
//         Name: editFormData.Name,
//         Email: editFormData.Email
//       };
      
//       // Include password only if updating
//       if (showPasswordFields && editFormData.Password) {
//         updateData.Password = editFormData.Password;
//       }
      
//       const response = await axiosInstance.put(`/users/${editFormData.id}`, updateData);
      
//       if (response.data.success) {
//         setEditSubmitSuccess(true);
        
//         // Update local state
//         setUsers(users.map(user => 
//           user.id === editFormData.id 
//             ? { 
//                 ...user, 
//                 name: editFormData.Name, 
//                 email: editFormData.Email 
//               } 
//             : user
//         ));
        
//         // Close modal after success
//         setTimeout(() => {
//           closeEditModal();
//         }, 1500);
//       } else {
//         throw new Error(response.data.message || 'Failed to update user');
//       }
//     } catch (err) {
//       console.error('Error updating user:', err);
      
//       // Handle specific errors
//       if (err.response?.data?.message === 'Email already exists' || err.response?.data?.message?.includes('already exists')) {
//         setEditFormErrors({
//           Email: 'This email is already registered'
//         });
//       } else if (err.response?.data?.message?.includes('Password must be at least')) {
//         setEditFormErrors({
//           Password: err.response.data.message
//         });
//       } else {
//         setEditFormErrors({
//           general: err.response?.data?.message || err.message || 'Failed to update user. Please try again.'
//         });
//       }
//     } finally {
//       setEditSubmitting(false);
//     }
//   };

//   // Delete user with enhanced error handling
//   const deleteUser = async (id) => {
//     const userToDelete = users.find(u => u.id === id);
    
//     if (!userToDelete) {
//       alert('User not found');
//       return;
//     }
    
//     if (!window.confirm(`Are you sure you want to delete user "${userToDelete.name}" (${userToDelete.email})? This action cannot be undone.`)) {
//       return;
//     }
    
//     try {
//       setDeletingId(id);
//       setDeleteError(null);
//       setDeleteSuccess(false);
      
//       // Make DELETE request to the API endpoint
//       const response = await axiosInstance.delete(`/users/${id}`);
      
//       if (response.data.success) {
//         setDeleteSuccess(true);
        
//         // Update local state by removing the deleted user
//         setUsers(users.filter(user => user.id !== id));
        
//         // Show success message
//         setTimeout(() => {
//           setDeleteSuccess(false);
//         }, 3000);
//       } else {
//         throw new Error(response.data.message || 'Failed to delete user');
//       }
//     } catch (err) {
//       console.error('Error deleting user:', err);
//       setDeleteError(err.response?.data?.message || err.message || 'Failed to delete user. Please try again.');
      
//       // Show error for 5 seconds
//       setTimeout(() => {
//         setDeleteError(null);
//       }, 5000);
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   // Filter users
//   const filteredUsers = users.filter(user => {
//     const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = filterStatus === 'All' || user.status === filterStatus;
//     return matchesSearch && matchesStatus;
//   });

//   const statusColors = {
//     Active: 'bg-green-100 text-green-800 border border-green-200',
//     Inactive: 'bg-gray-100 text-gray-800 border border-gray-200',
//   };

//   return (
//     <div className="space-y-6 no-select p-4 md:p-6">
//       {/* Header */}
//       <div className="md:flex md:items-center md:justify-between">
//         <div className="flex-1 min-w-0">
//           <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
//           <p className="mt-1 text-sm text-gray-500">
//             Manage all users in your platform. View, edit, and delete user accounts.
//           </p>
//         </div>
//         <div className="mt-4 md:mt-0">
//           <button 
//             onClick={openAddUserModal}
//             className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
//           >
//             <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//             </svg>
//             Add New User
//           </button>
//         </div>
//       </div>

//       {/* Status Update Success/Error Messages */}
//       {statusUpdateSuccess && (
//         <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//           <div className="flex items-center">
//             <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//             </svg>
//             <span className="text-green-700 font-medium">User status updated successfully!</span>
//           </div>
//         </div>
//       )}

//       {statusUpdateError && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//           <div className="flex items-center">
//             <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//             </svg>
//             <span className="text-red-700">{statusUpdateError}</span>
//           </div>
//           <button 
//             onClick={() => setStatusUpdateError(null)}
//             className="mt-2 px-3 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
//           >
//             Dismiss
//           </button>
//         </div>
//       )}

//       {/* Delete Success/Error Messages */}
//       {deleteSuccess && (
//         <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//           <div className="flex items-center">
//             <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//             </svg>
//             <span className="text-green-700 font-medium">User deleted successfully!</span>
//           </div>
//         </div>
//       )}

//       {deleteError && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//           <div className="flex items-center">
//             <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//             </svg>
//             <span className="text-red-700">{deleteError}</span>
//           </div>
//           <button 
//             onClick={() => setDeleteError(null)}
//             className="mt-2 px-3 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
//           >
//             Dismiss
//           </button>
//         </div>
//       )}

//       {/* Loading State */}
//       {loading && (
//         <div className="bg-white shadow rounded-lg p-8 text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading users from database...</p>
//         </div>
//       )}

//       {/* Error State */}
//       {error && !loading && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//           <div className="flex items-center">
//             <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//             </svg>
//             <span className="text-red-700">{error}</span>
//           </div>
//           <button 
//             onClick={fetchUsers}
//             className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
//           >
//             Retry
//           </button>
//         </div>
//       )}

//       {!loading && !error && (
//         <>
//           {/* Filters */}
//           <div className="bg-white shadow rounded-lg border border-gray-200">
//             <div className="px-4 py-5 sm:p-6">
//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                 {/* Search */}
//                 <div>
//                   <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
//                     Search Users
//                   </label>
//                   <div className="relative rounded-md shadow-sm">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                       </svg>
//                     </div>
//                     <input
//                       type="text"
//                       id="search"
//                       className="focus:ring-red-500 focus:border-red-500 block w-full pl-10 pr-12 py-2.5 sm:text-sm border-gray-300 rounded-lg transition-colors duration-200"
//                       placeholder="Search by name or email"
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                   </div>
//                 </div>

//                 {/* Status Filter */}
//                 <div>
//                   <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
//                     Filter by Status
//                   </label>
//                   <select
//                     id="status"
//                     className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-lg transition-colors duration-200"
//                     value={filterStatus}
//                     onChange={(e) => setFilterStatus(e.target.value)}
//                   >
//                     <option value="All">All Statuses</option>
//                     <option value="Active">Active</option>
//                     <option value="Inactive">Inactive</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Users Table */}
//           <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
//             <div className="px-4 py-5 sm:p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-lg font-medium text-gray-900">All Users ({filteredUsers.length})</h3>
//                 <div className="flex items-center space-x-3">
//                   <span className="text-sm text-gray-500">
//                     Showing {filteredUsers.length} of {users.length} users
//                   </span>
//                   <button 
//                     onClick={fetchUsers}
//                     className="inline-flex items-center px-3.5 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors duration-200"
//                   >
//                     <svg className="h-4 w-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                     </svg>
//                     Refresh
//                   </button>
//                 </div>
//               </div>
              
//               {filteredUsers.length === 0 ? (
//                 <div className="text-center py-12">
//                   <svg className="mx-auto h-14 w-14 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   <h3 className="mt-4 text-lg font-medium text-gray-900">No users found</h3>
//                   <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
//                     {searchTerm || filterStatus !== 'All' 
//                       ? "Try adjusting your search or filter" 
//                       : "No users in the system yet. Click 'Add New User' to add your first user."}
//                   </p>
//                   {(searchTerm || filterStatus !== 'All') && (
//                     <button
//                       onClick={() => {
//                         setSearchTerm('');
//                         setFilterStatus('All');
//                       }}
//                       className="mt-4 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors duration-200"
//                     >
//                       Clear Filters
//                     </button>
//                   )}
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto rounded-lg border border-gray-200">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           User
//                         </th>
//                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Status
//                         </th>
//                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Actions
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {filteredUsers.map((user) => (
//                         <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex items-center">
//                               <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3 border border-red-200">
//                                 <svg className="h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                                   <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
//                                 </svg>
//                               </div>
//                               <div>
//                                 <div className="text-sm font-medium text-gray-900">{user.name}</div>
//                                 <div className="text-sm text-gray-500">{user.email}</div>
//                                 <div className="flex items-center mt-1">
//                                   <span className="text-xs text-gray-500">
//                                     Joined: {user.joinDate}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[user.status] || 'bg-gray-100 text-gray-800'}`}>
//                               {user.status}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                             <div className="flex space-x-2">
//                               <button
//                                 onClick={() => toggleUserStatus(user.id)}
//                                 disabled={updatingStatusId === user.id}
//                                 className={`px-3 py-1.5 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors duration-200 ${
//                                   user.status === 'Active' 
//                                     ? 'bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-300 border border-red-200' 
//                                     : 'bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-300 border border-green-200'
//                                 } ${updatingStatusId === user.id ? 'opacity-50 cursor-not-allowed' : ''}`}
//                               >
//                                 {updatingStatusId === user.id ? (
//                                   <span className="flex items-center">
//                                     <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                     </svg>
//                                     Updating...
//                                   </span>
//                                 ) : (
//                                   user.status === 'Active' ? 'Deactivate' : 'Activate'
//                                 )}
//                               </button>
//                               <button 
//                                 onClick={() => openEditUserModal(user)}
//                                 className="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1 border border-blue-200 transition-colors duration-200"
//                               >
//                                 Edit
//                               </button>
//                               <button
//                                 onClick={() => deleteUser(user.id)}
//                                 disabled={deletingId === user.id}
//                                 className={`px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-1 border border-red-200 transition-colors duration-200 ${
//                                   deletingId === user.id ? 'opacity-50 cursor-not-allowed' : ''
//                                 }`}
//                               >
//                                 {deletingId === user.id ? (
//                                   <span className="flex items-center">
//                                     <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                     </svg>
//                                     Deleting...
//                                   </span>
//                                 ) : (
//                                   'Delete'
//                                 )}
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         </>
//       )}

//       {/* Add User Modal - RESPONSIVE */}
//       {showAddModal && (
//         <div className="fixed inset-0 z-50">
//           {/* Background overlay with your specified class */}
//           <div 
//             className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto"
//             onClick={closeAddModal}
//           >
//             {/* Modal panel - Responsive width and height */}
//             <div 
//               className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto my-auto transform transition-all max-h-[90vh] overflow-y-auto"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="p-4 sm:p-6">
//                 {/* Modal header */}
//                 <div className="mb-4">
//                   <h3 className="text-lg font-semibold text-gray-900">
//                     Add New User
//                   </h3>
//                   <p className="text-sm text-gray-500 mt-1">
//                     Fill in the details to create a new user account.
//                   </p>
//                 </div>
                
//                 {addSubmitSuccess ? (
//                   <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//                     <div className="flex items-center">
//                       <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                       </svg>
//                       <span className="text-green-700 font-medium">User created successfully!</span>
//                     </div>
//                     <p className="mt-2 text-sm text-green-600">
//                       The user will appear in the list shortly.
//                     </p>
//                     <button
//                       onClick={closeAddModal}
//                       className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
//                     >
//                       Close
//                     </button>
//                   </div>
//                 ) : (
//                   <form onSubmit={handleAddSubmit} className="space-y-4">
//                     {/* General error */}
//                     {addFormErrors.general && (
//                       <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//                         <div className="flex items-center">
//                           <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                           </svg>
//                           <p className="text-sm text-red-600">{addFormErrors.general}</p>
//                         </div>
//                       </div>
//                     )}

//                     {/* Name field */}
//                     <div>
//                       <label htmlFor="Name" className="block text-sm font-medium text-gray-700 mb-1">
//                         Full Name *
//                       </label>
//                       <input
//                         type="text"
//                         id="Name"
//                         name="Name"
//                         value={addFormData.Name}
//                         onChange={handleAddInputChange}
//                         className={`block w-full px-3 py-2.5 text-sm border rounded-lg transition-colors duration-200 ${
//                           addFormErrors.Name 
//                             ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
//                             : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
//                         }`}
//                         placeholder="Enter full name"
//                         autoComplete="off"
//                       />
//                       {addFormErrors.Name && (
//                         <p className="mt-1 text-sm text-red-600">{addFormErrors.Name}</p>
//                       )}
//                     </div>

//                     {/* Email field */}
//                     <div>
//                       <label htmlFor="Email" className="block text-sm font-medium text-gray-700 mb-1">
//                         Email Address *
//                       </label>
//                       <input
//                         type="email"
//                         id="Email"
//                         name="Email"
//                         value={addFormData.Email}
//                         onChange={handleAddInputChange}
//                         className={`block w-full px-3 py-2.5 text-sm border rounded-lg transition-colors duration-200 ${
//                           addFormErrors.Email 
//                             ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
//                             : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
//                         }`}
//                         placeholder="Enter email address"
//                         autoComplete="off"
//                       />
//                       {addFormErrors.Email && (
//                         <p className="mt-1 text-sm text-red-600">{addFormErrors.Email}</p>
//                       )}
//                     </div>

//                     {/* Password field */}
//                     <div>
//                       <label htmlFor="Password" className="block text-sm font-medium text-gray-700 mb-1">
//                         Password *
//                       </label>
//                       <input
//                         type="password"
//                         id="Password"
//                         name="Password"
//                         value={addFormData.Password}
//                         onChange={handleAddInputChange}
//                         className={`block w-full px-3 py-2.5 text-sm border rounded-lg transition-colors duration-200 ${
//                           addFormErrors.Password 
//                             ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
//                             : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
//                         }`}
//                         placeholder="Enter password (min. 6 characters)"
//                         autoComplete="new-password"
//                       />
//                       {addFormErrors.Password && (
//                         <p className="mt-1 text-sm text-red-600">{addFormErrors.Password}</p>
//                       )}
//                       <p className="mt-2 text-xs text-gray-500 italic">
//                         Note: For security reasons, passwords are currently stored in plain text. Consider updating to hashed passwords in production.
//                       </p>
//                     </div>

//                     {/* Form actions - Responsive button layout */}
//                     <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
//                       <button
//                         type="button"
//                         onClick={closeAddModal}
//                         className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors duration-200"
//                         disabled={addSubmitting}
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="submit"
//                         disabled={addSubmitting}
//                         className="w-full sm:w-auto px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
//                       >
//                         {addSubmitting ? (
//                           <span className="flex items-center justify-center">
//                             <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                             </svg>
//                             Creating...
//                           </span>
//                         ) : (
//                           'Create User'
//                         )}
//                       </button>
//                     </div>
//                   </form>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit User Modal - RESPONSIVE */}
//       {showEditModal && (
//         <div className="fixed inset-0 z-50">
//           {/* Background overlay with your specified class */}
//           <div 
//             className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto"
//             onClick={closeEditModal}
//           >
//             {/* Modal panel - Responsive with max height and overflow */}
//             <div 
//               className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto my-auto transform transition-all max-h-[90vh] overflow-y-auto"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="p-4 sm:p-6">
//                 {/* Modal header */}
//                 <div className="mb-4">
//                   <h3 className="text-lg font-semibold text-gray-900">
//                     Edit User
//                   </h3>
//                   <p className="text-sm text-gray-500 mt-1">
//                     Update the user details for {editingUser?.name}.
//                   </p>
//                 </div>
                
//                 {editSubmitSuccess ? (
//                   <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//                     <div className="flex items-center">
//                       <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                       </svg>
//                       <span className="text-green-700 font-medium">User updated successfully!</span>
//                     </div>
//                     <p className="mt-2 text-sm text-green-600">
//                       The user details have been updated.
//                     </p>
//                     <button
//                       onClick={closeEditModal}
//                       className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
//                     >
//                       Close
//                     </button>
//                   </div>
//                 ) : (
//                   <form onSubmit={handleEditSubmit} className="space-y-4">
//                     {/* General error */}
//                     {editFormErrors.general && (
//                       <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//                         <div className="flex items-center">
//                           <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                           </svg>
//                           <p className="text-sm text-red-600">{editFormErrors.general}</p>
//                         </div>
//                       </div>
//                     )}

//                     {/* User ID (hidden) */}
//                     <input type="hidden" name="id" value={editFormData.id} />

//                     {/* Name field */}
//                     <div>
//                       <label htmlFor="editName" className="block text-sm font-medium text-gray-700 mb-1">
//                         Full Name *
//                       </label>
//                       <input
//                         type="text"
//                         id="editName"
//                         name="Name"
//                         value={editFormData.Name}
//                         onChange={handleEditInputChange}
//                         className={`block w-full px-3 py-2.5 text-sm border rounded-lg transition-colors duration-200 ${
//                           editFormErrors.Name 
//                             ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
//                             : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
//                         }`}
//                         placeholder="Enter full name"
//                         autoComplete="off"
//                       />
//                       {editFormErrors.Name && (
//                         <p className="mt-1 text-sm text-red-600">{editFormErrors.Name}</p>
//                       )}
//                     </div>

//                     {/* Email field */}
//                     <div>
//                       <label htmlFor="editEmail" className="block text-sm font-medium text-gray-700 mb-1">
//                         Email Address *
//                       </label>
//                       <input
//                         type="email"
//                         id="editEmail"
//                         name="Email"
//                         value={editFormData.Email}
//                         onChange={handleEditInputChange}
//                         className={`block w-full px-3 py-2.5 text-sm border rounded-lg transition-colors duration-200 ${
//                           editFormErrors.Email 
//                             ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
//                             : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
//                         }`}
//                         placeholder="Enter email address"
//                         autoComplete="off"
//                       />
//                       {editFormErrors.Email && (
//                         <p className="mt-1 text-sm text-red-600">{editFormErrors.Email}</p>
//                       )}
//                     </div>

//                     {/* Password Update Section */}
//                     <div className="border border-gray-200 rounded-lg p-4">
//                       <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 space-y-2 sm:space-y-0">
//                         <div>
//                           <h4 className="text-sm font-medium text-gray-700">Password Update</h4>
//                           <p className="text-xs text-gray-500">Optional - Leave blank to keep current password</p>
//                         </div>
//                         <button
//                           type="button"
//                           onClick={togglePasswordFields}
//                           className={`px-3 py-1.5 text-xs rounded-lg transition-colors duration-200 w-full sm:w-auto ${
//                             showPasswordFields
//                               ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
//                               : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200'
//                           }`}
//                         >
//                           {showPasswordFields ? 'Cancel Password Update' : 'Update Password'}
//                         </button>
//                       </div>

//                       {showPasswordFields && (
//                         <div className="space-y-3 pt-2 border-t border-gray-100">
//                           <div>
//                             <label htmlFor="editPassword" className="block text-sm font-medium text-gray-700 mb-1">
//                               New Password *
//                             </label>
//                             <input
//                               type="password"
//                               id="editPassword"
//                               name="Password"
//                               value={editFormData.Password}
//                               onChange={handleEditInputChange}
//                               className={`block w-full px-3 py-2.5 text-sm border rounded-lg transition-colors duration-200 ${
//                                 editFormErrors.Password 
//                                   ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
//                                   : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
//                               }`}
//                               placeholder="Enter new password (min. 6 characters)"
//                               autoComplete="new-password"
//                             />
//                             {editFormErrors.Password && (
//                               <p className="mt-1 text-sm text-red-600">{editFormErrors.Password}</p>
//                             )}
//                           </div>

//                           <div>
//                             <label htmlFor="editConfirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
//                               Confirm New Password *
//                             </label>
//                             <input
//                               type="password"
//                               id="editConfirmPassword"
//                               name="confirmPassword"
//                               value={editFormData.confirmPassword}
//                               onChange={handleEditInputChange}
//                               className={`block w-full px-3 py-2.5 text-sm border rounded-lg transition-colors duration-200 ${
//                                 editFormErrors.confirmPassword 
//                                   ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
//                                   : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
//                               }`}
//                               placeholder="Confirm new password"
//                               autoComplete="new-password"
//                             />
//                             {editFormErrors.confirmPassword && (
//                               <p className="mt-1 text-sm text-red-600">{editFormErrors.confirmPassword}</p>
//                             )}
//                           </div>
                          
//                           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
//                             <div className="flex items-start">
//                               <svg className="h-5 w-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                                 <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                               </svg>
//                               <div>
//                                 <p className="text-xs font-medium text-yellow-800">Security Notice</p>
//                                 <p className="text-xs text-yellow-700 mt-1">
//                                   Passwords are currently stored in plain text. If you update the password, 
//                                   the user will receive an email with their new credentials.
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     {/* Current status display */}
//                     {editingUser && (
//                       <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
//                         <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
//                           <div>
//                             <span className="text-sm font-medium text-gray-700">Current Status:</span>
//                             <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[editingUser.status] || 'bg-gray-100 text-gray-800'}`}>
//                               {editingUser.status}
//                             </span>
//                           </div>
//                           <p className="text-xs text-gray-500 mt-2">
//                             Member since: {editingUser.joinDate}
//                           </p>
//                         </div>
//                       </div>
//                     )}

//                     {/* Form actions - Responsive button layout */}
//                     <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
//                       <button
//                         type="button"
//                         onClick={closeEditModal}
//                         className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors duration-200"
//                         disabled={editSubmitting}
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="submit"
//                         disabled={editSubmitting}
//                         className="w-full sm:w-auto px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
//                       >
//                         {editSubmitting ? (
//                           <span className="flex items-center justify-center">
//                             <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                             </svg>
//                             Updating...
//                           </span>
//                         ) : (
//                           'Update User'
//                         )}
//                       </button>
//                     </div>
//                   </form>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserManagement;



// import React, { useState, useEffect } from 'react';
// import axiosInstance from './api/axiosInstance';

// const UserManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('All');
  
//   // Status update state
//   const [updatingStatusId, setUpdatingStatusId] = useState(null);
//   const [statusUpdateError, setStatusUpdateError] = useState(null);
//   const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(false);
  
//   // Resend Credentials state
//   const [resendingId, setResendingId] = useState(null);
//   const [resendError, setResendError] = useState(null);
//   const [resendSuccess, setResendSuccess] = useState(false);
  
//   // Add User Modal state
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [addFormData, setAddFormData] = useState({
//     Name: '',
//     Email: '',
//     Password: ''
//   });
//   const [addFormErrors, setAddFormErrors] = useState({});
//   const [addSubmitting, setAddSubmitting] = useState(false);
//   const [addSubmitSuccess, setAddSubmitSuccess] = useState(false);

//   // Edit User Modal state
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editFormData, setEditFormData] = useState({
//     id: '',
//     Name: '',
//     Email: '',
//     Password: '',
//     confirmPassword: ''
//   });
//   const [editFormErrors, setEditFormErrors] = useState({});
//   const [editSubmitting, setEditSubmitting] = useState(false);
//   const [editSubmitSuccess, setEditSubmitSuccess] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);
//   const [showPasswordFields, setShowPasswordFields] = useState(false);

//   // Delete state
//   const [deletingId, setDeletingId] = useState(null);
//   const [deleteError, setDeleteError] = useState(null);
//   const [deleteSuccess, setDeleteSuccess] = useState(false);

//   // Fetch users from API
//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await axiosInstance.get('/users');
      
//       if (response.data.success) {
//         const formattedUsers = response.data.data.map(user => ({
//           id: user.id,
//           name: user.Name,
//           email: user.Email,
//           status: user.status || 'Active',
//           joinDate: user.created_at ? new Date(user.created_at).toLocaleDateString('en-CA') : new Date().toLocaleDateString('en-CA')
//         }));
        
//         setUsers(formattedUsers);
//       } else {
//         throw new Error(response.data.message || 'Failed to fetch users');
//       }
//     } catch (err) {
//       console.error('Error fetching users:', err);
//       setError(err.response?.data?.message || err.message || 'Failed to load users. Please try again.');
//       setUsers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Toggle user status (Activate/Deactivate)
//   const toggleUserStatus = async (id) => {
//     try {
//       const user = users.find(u => u.id === id);
//       if (!user) {
//         alert('User not found');
//         return;
//       }
      
//       const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
//       const confirmMessage = user.status === 'Active' 
//         ? `Are you sure you want to deactivate user "${user.name}"?\n\nDeactivated users cannot log in to the application.`
//         : `Are you sure you want to activate user "${user.name}"?\n\nActivated users will be able to log in to the application.`;
      
//       if (!window.confirm(confirmMessage)) {
//         return;
//       }
      
//       setUpdatingStatusId(id);
//       setStatusUpdateError(null);
//       setStatusUpdateSuccess(false);
      
//       const response = await axiosInstance.put(`/users/${id}/status`, { 
//         status: newStatus 
//       });
      
//       if (response.data.success) {
//         setStatusUpdateSuccess(true);
        
//         // Update local state
//         setUsers(users.map(user => 
//           user.id === id 
//             ? { ...user, status: newStatus }
//             : user
//         ));
        
//         // Show success message
//         setTimeout(() => {
//           setStatusUpdateSuccess(false);
//         }, 3000);
//       } else {
//         throw new Error(response.data.message || 'Failed to update user status');
//       }
//     } catch (err) {
//       console.error('Error updating user status:', err);
//       setStatusUpdateError(err.response?.data?.message || err.message || 'Failed to update user status. Please try again.');
      
//       // Show error for 5 seconds
//       setTimeout(() => {
//         setStatusUpdateError(null);
//       }, 5000);
//     } finally {
//       setUpdatingStatusId(null);
//     }
//   };

//   // Resend user credentials
//   const resendCredentials = async (id) => {
//     try {
//       const user = users.find(u => u.id === id);
//       if (!user) {
//         alert('User not found');
//         return;
//       }
      
//       const confirmMessage = `Are you sure you want to resend credentials to user "${user.name}" (${user.email})?\n\nAn email with login credentials will be sent to the user.`;
      
//       if (!window.confirm(confirmMessage)) {
//         return;
//       }
      
//       setResendingId(id);
//       setResendError(null);
//       setResendSuccess(false);
      
//       const response = await axiosInstance.post(`/users/${id}/resend-credentials`);
      
//       if (response.data.success) {
//         setResendSuccess(true);
        
//         // Show success message
//         setTimeout(() => {
//           setResendSuccess(false);
//         }, 3000);
//       } else {
//         throw new Error(response.data.message || 'Failed to resend credentials');
//       }
//     } catch (err) {
//       console.error('Error resending credentials:', err);
//       setResendError(err.response?.data?.message || err.message || 'Failed to resend credentials. Please try again.');
      
//       // Show error for 5 seconds
//       setTimeout(() => {
//         setResendError(null);
//       }, 5000);
//     } finally {
//       setResendingId(null);
//     }
//   };

//   // Handle Add modal open
//   const openAddUserModal = () => {
//     setShowAddModal(true);
//     setAddSubmitSuccess(false);
//     setAddFormData({ Name: '', Email: '', Password: '' });
//     setAddFormErrors({});
//     // Prevent body scroll when modal is open
//     document.body.style.overflow = 'hidden';
//   };

//   // Handle Add modal close
//   const closeAddModal = () => {
//     setShowAddModal(false);
//     setAddFormData({ Name: '', Email: '', Password: '' });
//     setAddFormErrors({});
//     setAddSubmitSuccess(false);
//     // Re-enable body scroll
//     document.body.style.overflow = 'unset';
//   };

//   // Handle Edit modal open
//   const openEditUserModal = (user) => {
//     setEditingUser(user);
//     setShowEditModal(true);
//     setEditSubmitSuccess(false);
//     setEditFormData({
//       id: user.id,
//       Name: user.name,
//       Email: user.email,
//       Password: '',
//       confirmPassword: ''
//     });
//     setEditFormErrors({});
//     setShowPasswordFields(false);
//     // Prevent body scroll when modal is open
//     document.body.style.overflow = 'hidden';
//   };

//   // Handle Edit modal close
//   const closeEditModal = () => {
//     setShowEditModal(false);
//     setEditFormData({ id: '', Name: '', Email: '', Password: '', confirmPassword: '' });
//     setEditFormErrors({});
//     setEditSubmitSuccess(false);
//     setEditingUser(null);
//     setShowPasswordFields(false);
//     // Re-enable body scroll
//     document.body.style.overflow = 'unset';
//   };

//   // Handle form input changes for Add
//   const handleAddInputChange = (e) => {
//     const { name, value } = e.target;
//     setAddFormData({
//       ...addFormData,
//       [name]: value
//     });
//     // Clear error for this field when user starts typing
//     if (addFormErrors[name]) {
//       setAddFormErrors({
//         ...addFormErrors,
//         [name]: ''
//       });
//     }
//   };

//   // Handle form input changes for Edit
//   const handleEditInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditFormData({
//       ...editFormData,
//       [name]: value
//     });
//     // Clear error for this field when user starts typing
//     if (editFormErrors[name]) {
//       setEditFormErrors({
//         ...editFormErrors,
//         [name]: ''
//       });
//     }
//   };

//   // Toggle password fields visibility
//   const togglePasswordFields = () => {
//     setShowPasswordFields(!showPasswordFields);
//     if (!showPasswordFields) {
//       // Clear password fields when showing
//       setEditFormData({
//         ...editFormData,
//         Password: '',
//         confirmPassword: ''
//       });
//       // Clear password errors
//       setEditFormErrors({
//         ...editFormErrors,
//         Password: '',
//         confirmPassword: ''
//       });
//     }
//   };

//   // Validate Add form
//   const validateAddForm = () => {
//     const errors = {};
    
//     if (!addFormData.Name.trim()) {
//       errors.Name = 'Name is required';
//     }
    
//     if (!addFormData.Email.trim()) {
//       errors.Email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addFormData.Email)) {
//       errors.Email = 'Please enter a valid email address';
//     }
    
//     if (!addFormData.Password) {
//       errors.Password = 'Password is required';
//     } else if (addFormData.Password.length < 6) {
//       errors.Password = 'Password must be at least 6 characters';
//     }
    
//     return errors;
//   };

//   // Validate Edit form
//   const validateEditForm = () => {
//     const errors = {};
    
//     if (!editFormData.Name.trim()) {
//       errors.Name = 'Name is required';
//     }
    
//     if (!editFormData.Email.trim()) {
//       errors.Email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFormData.Email)) {
//       errors.Email = 'Please enter a valid email address';
//     }
    
//     // Validate password fields if they are shown and filled
//     if (showPasswordFields) {
//       if (editFormData.Password) {
//         if (editFormData.Password.length < 6) {
//           errors.Password = 'Password must be at least 6 characters';
//         }
        
//         if (!editFormData.confirmPassword) {
//           errors.confirmPassword = 'Please confirm your password';
//         } else if (editFormData.Password !== editFormData.confirmPassword) {
//           errors.confirmPassword = 'Passwords do not match';
//         }
//       } else {
//         errors.Password = 'Password is required when updating';
//       }
//     }
    
//     return errors;
//   };

//   // Handle Add form submission
//   const handleAddSubmit = async (e) => {
//     e.preventDefault();
    
//     const errors = validateAddForm();
//     if (Object.keys(errors).length > 0) {
//       setAddFormErrors(errors);
//       return;
//     }
    
//     try {
//       setAddSubmitting(true);
//       setAddFormErrors({});
      
//       const response = await axiosInstance.post('/users/register', addFormData);
      
//       if (response.data.success) {
//         setAddSubmitSuccess(true);
        
//         // Refresh users list after successful creation
//         setTimeout(() => {
//           fetchUsers();
//           closeAddModal();
//         }, 2000);
//       } else {
//         throw new Error(response.data.message || 'Failed to create user');
//       }
//     } catch (err) {
//       console.error('Error creating user:', err);
      
//       // Handle specific errors
//       if (err.response?.data?.message === 'Email already exists' || err.response?.data?.message?.includes('already exists')) {
//         setAddFormErrors({
//           Email: 'This email is already registered'
//         });
//       } else {
//         setAddFormErrors({
//           general: err.response?.data?.message || err.message || 'Failed to create user. Please try again.'
//         });
//       }
//     } finally {
//       setAddSubmitting(false);
//     }
//   };

//   // Handle Edit form submission
//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
    
//     const errors = validateEditForm();
//     if (Object.keys(errors).length > 0) {
//       setEditFormErrors(errors);
//       return;
//     }
    
//     try {
//       setEditSubmitting(true);
//       setEditFormErrors({});
      
//       // Prepare data for API
//       const updateData = {
//         Name: editFormData.Name,
//         Email: editFormData.Email
//       };
      
//       // Include password only if updating
//       if (showPasswordFields && editFormData.Password) {
//         updateData.Password = editFormData.Password;
//       }
      
//       const response = await axiosInstance.put(`/users/${editFormData.id}`, updateData);
      
//       if (response.data.success) {
//         setEditSubmitSuccess(true);
        
//         // Update local state
//         setUsers(users.map(user => 
//           user.id === editFormData.id 
//             ? { 
//                 ...user, 
//                 name: editFormData.Name, 
//                 email: editFormData.Email 
//               } 
//             : user
//         ));
        
//         // Close modal after success
//         setTimeout(() => {
//           closeEditModal();
//         }, 1500);
//       } else {
//         throw new Error(response.data.message || 'Failed to update user');
//       }
//     } catch (err) {
//       console.error('Error updating user:', err);
      
//       // Handle specific errors
//       if (err.response?.data?.message === 'Email already exists' || err.response?.data?.message?.includes('already exists')) {
//         setEditFormErrors({
//           Email: 'This email is already registered'
//         });
//       } else if (err.response?.data?.message?.includes('Password must be at least')) {
//         setEditFormErrors({
//           Password: err.response.data.message
//         });
//       } else {
//         setEditFormErrors({
//           general: err.response?.data?.message || err.message || 'Failed to update user. Please try again.'
//         });
//       }
//     } finally {
//       setEditSubmitting(false);
//     }
//   };

//   // Delete user with enhanced error handling
//   const deleteUser = async (id) => {
//     const userToDelete = users.find(u => u.id === id);
    
//     if (!userToDelete) {
//       alert('User not found');
//       return;
//     }
    
//     if (!window.confirm(`Are you sure you want to delete user "${userToDelete.name}" (${userToDelete.email})? This action cannot be undone.`)) {
//       return;
//     }
    
//     try {
//       setDeletingId(id);
//       setDeleteError(null);
//       setDeleteSuccess(false);
      
//       // Make DELETE request to the API endpoint
//       const response = await axiosInstance.delete(`/users/${id}`);
      
//       if (response.data.success) {
//         setDeleteSuccess(true);
        
//         // Update local state by removing the deleted user
//         setUsers(users.filter(user => user.id !== id));
        
//         // Show success message
//         setTimeout(() => {
//           setDeleteSuccess(false);
//         }, 3000);
//       } else {
//         throw new Error(response.data.message || 'Failed to delete user');
//       }
//     } catch (err) {
//       console.error('Error deleting user:', err);
//       setDeleteError(err.response?.data?.message || err.message || 'Failed to delete user. Please try again.');
      
//       // Show error for 5 seconds
//       setTimeout(() => {
//         setDeleteError(null);
//       }, 5000);
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   // Filter users
//   const filteredUsers = users.filter(user => {
//     const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = filterStatus === 'All' || user.status === filterStatus;
//     return matchesSearch && matchesStatus;
//   });

//   const statusColors = {
//     Active: 'bg-green-100 text-green-800 border border-green-200',
//     Inactive: 'bg-gray-100 text-gray-800 border border-gray-200',
//   };

//   return (
//     <div className="space-y-6 no-select p-4 md:p-6">
//       {/* Header */}
//       <div className="md:flex md:items-center md:justify-between">
//         <div className="flex-1 min-w-0">
//           <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
//           <p className="mt-1 text-sm text-gray-500">
//             Manage all users in your platform. View, edit, and delete user accounts.
//           </p>
//         </div>
//         <div className="mt-4 md:mt-0">
//           <button 
//             onClick={openAddUserModal}
//             className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
//           >
//             <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//             </svg>
//             Add New User
//           </button>
//         </div>
//       </div>

//       {/* Status Update Success/Error Messages */}
//       {statusUpdateSuccess && (
//         <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//           <div className="flex items-center">
//             <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//             </svg>
//             <span className="text-green-700 font-medium">User status updated successfully!</span>
//           </div>
//         </div>
//       )}

//       {statusUpdateError && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//           <div className="flex items-center">
//             <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//             </svg>
//             <span className="text-red-700">{statusUpdateError}</span>
//           </div>
//           <button 
//             onClick={() => setStatusUpdateError(null)}
//             className="mt-2 px-3 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
//           >
//             Dismiss
//           </button>
//         </div>
//       )}

//       {/* Resend Credentials Success/Error Messages */}
//       {resendSuccess && (
//         <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//           <div className="flex items-center">
//             <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//             </svg>
//             <span className="text-green-700 font-medium">Credentials sent successfully!</span>
//           </div>
//         </div>
//       )}

//       {resendError && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//           <div className="flex items-center">
//             <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//             </svg>
//             <span className="text-red-700">{resendError}</span>
//           </div>
//           <button 
//             onClick={() => setResendError(null)}
//             className="mt-2 px-3 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
//           >
//             Dismiss
//           </button>
//         </div>
//       )}

//       {/* Delete Success/Error Messages */}
//       {deleteSuccess && (
//         <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//           <div className="flex items-center">
//             <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//             </svg>
//             <span className="text-green-700 font-medium">User deleted successfully!</span>
//           </div>
//         </div>
//       )}

//       {deleteError && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//           <div className="flex items-center">
//             <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//             </svg>
//             <span className="text-red-700">{deleteError}</span>
//           </div>
//           <button 
//             onClick={() => setDeleteError(null)}
//             className="mt-2 px-3 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
//           >
//             Dismiss
//           </button>
//         </div>
//       )}

//       {/* Loading State */}
//       {loading && (
//         <div className="bg-white shadow rounded-lg p-8 text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading users from database...</p>
//         </div>
//       )}

//       {/* Error State */}
//       {error && !loading && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//           <div className="flex items-center">
//             <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//             </svg>
//             <span className="text-red-700">{error}</span>
//           </div>
//           <button 
//             onClick={fetchUsers}
//             className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
//           >
//             Retry
//           </button>
//         </div>
//       )}

//       {!loading && !error && (
//         <>
//           {/* Filters */}
//           <div className="bg-white shadow rounded-lg border border-gray-200">
//             <div className="px-4 py-5 sm:p-6">
//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                 {/* Search */}
//                 <div>
//                   <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
//                     Search Users
//                   </label>
//                   <div className="relative rounded-md shadow-sm">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                       </svg>
//                     </div>
//                     <input
//                       type="text"
//                       id="search"
//                       className="focus:ring-red-500 focus:border-red-500 block w-full pl-10 pr-12 py-2.5 sm:text-sm border-gray-300 rounded-lg transition-colors duration-200"
//                       placeholder="Search by name or email"
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                   </div>
//                 </div>

//                 {/* Status Filter */}
//                 <div>
//                   <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
//                     Filter by Status
//                   </label>
//                   <select
//                     id="status"
//                     className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-lg transition-colors duration-200"
//                     value={filterStatus}
//                     onChange={(e) => setFilterStatus(e.target.value)}
//                   >
//                     <option value="All">All Statuses</option>
//                     <option value="Active">Active</option>
//                     <option value="Inactive">Inactive</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Users Table */}
//           <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
//             <div className="px-4 py-5 sm:p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-lg font-medium text-gray-900">All Users ({filteredUsers.length})</h3>
//                 <div className="flex items-center space-x-3">
//                   <span className="text-sm text-gray-500">
//                     Showing {filteredUsers.length} of {users.length} users
//                   </span>
//                   <button 
//                     onClick={fetchUsers}
//                     className="inline-flex items-center px-3.5 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors duration-200"
//                   >
//                     <svg className="h-4 w-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                     </svg>
//                     Refresh
//                   </button>
//                 </div>
//               </div>
              
//               {filteredUsers.length === 0 ? (
//                 <div className="text-center py-12">
//                   <svg className="mx-auto h-14 w-14 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   <h3 className="mt-4 text-lg font-medium text-gray-900">No users found</h3>
//                   <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
//                     {searchTerm || filterStatus !== 'All' 
//                       ? "Try adjusting your search or filter" 
//                       : "No users in the system yet. Click 'Add New User' to add your first user."}
//                   </p>
//                   {(searchTerm || filterStatus !== 'All') && (
//                     <button
//                       onClick={() => {
//                         setSearchTerm('');
//                         setFilterStatus('All');
//                       }}
//                       className="mt-4 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors duration-200"
//                     >
//                       Clear Filters
//                     </button>
//                   )}
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto rounded-lg border border-gray-200">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           User
//                         </th>
//                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Status
//                         </th>
//                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Actions
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {filteredUsers.map((user) => (
//                         <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex items-center">
//                               <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3 border border-red-200">
//                                 <svg className="h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                                   <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
//                                 </svg>
//                               </div>
//                               <div>
//                                 <div className="text-sm font-medium text-gray-900">{user.name}</div>
//                                 <div className="text-sm text-gray-500">{user.email}</div>
//                                 <div className="flex items-center mt-1">
//                                   <span className="text-xs text-gray-500">
//                                     Joined: {user.joinDate}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[user.status] || 'bg-gray-100 text-gray-800'}`}>
//                               {user.status}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                             <div className="flex flex-wrap gap-2">
//                               <button
//                                 onClick={() => toggleUserStatus(user.id)}
//                                 disabled={updatingStatusId === user.id}
//                                 className={`px-3 py-1.5 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors duration-200 ${
//                                   user.status === 'Active' 
//                                     ? 'bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-300 border border-red-200' 
//                                     : 'bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-300 border border-green-200'
//                                 } ${updatingStatusId === user.id ? 'opacity-50 cursor-not-allowed' : ''}`}
//                               >
//                                 {updatingStatusId === user.id ? (
//                                   <span className="flex items-center">
//                                     <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                     </svg>
//                                     Updating...
//                                   </span>
//                                 ) : (
//                                   user.status === 'Active' ? 'Deactivate' : 'Activate'
//                                 )}
//                               </button>
//                               <button 
//                                 onClick={() => openEditUserModal(user)}
//                                 className="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1 border border-blue-200 transition-colors duration-200"
//                               >
//                                 Edit
//                               </button>
//                               <button
//                                 onClick={() => resendCredentials(user.id)}
//                                 disabled={resendingId === user.id}
//                                 className={`px-3 py-1.5 text-xs bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-1 border border-purple-200 transition-colors duration-200 ${
//                                   resendingId === user.id ? 'opacity-50 cursor-not-allowed' : ''
//                                 }`}
//                               >
//                                 {resendingId === user.id ? (
//                                   <span className="flex items-center">
//                                     <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-purple-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                     </svg>
//                                     Sending...
//                                   </span>
//                                 ) : (
//                                   'Resend Credentials'
//                                 )}
//                               </button>
//                               <button
//                                 onClick={() => deleteUser(user.id)}
//                                 disabled={deletingId === user.id}
//                                 className={`px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-1 border border-red-200 transition-colors duration-200 ${
//                                   deletingId === user.id ? 'opacity-50 cursor-not-allowed' : ''
//                                 }`}
//                               >
//                                 {deletingId === user.id ? (
//                                   <span className="flex items-center">
//                                     <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                     </svg>
//                                     Deleting...
//                                   </span>
//                                 ) : (
//                                   'Delete'
//                                 )}
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         </>
//       )}

//       {/* Add User Modal - RESPONSIVE */}
//       {showAddModal && (
//         <div className="fixed inset-0 z-50">
//           {/* Background overlay with your specified class */}
//           <div 
//             className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto"
//             onClick={closeAddModal}
//           >
//             {/* Modal panel - Responsive width and height */}
//             <div 
//               className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto my-auto transform transition-all max-h-[90vh] overflow-y-auto"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="p-4 sm:p-6">
//                 {/* Modal header */}
//                 <div className="mb-4">
//                   <h3 className="text-lg font-semibold text-gray-900">
//                     Add New User
//                   </h3>
//                   <p className="text-sm text-gray-500 mt-1">
//                     Fill in the details to create a new user account.
//                   </p>
//                 </div>
                
//                 {addSubmitSuccess ? (
//                   <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//                     <div className="flex items-center">
//                       <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                       </svg>
//                       <span className="text-green-700 font-medium">User created successfully!</span>
//                     </div>
//                     <p className="mt-2 text-sm text-green-600">
//                       The user will appear in the list shortly.
//                     </p>
//                     <button
//                       onClick={closeAddModal}
//                       className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
//                     >
//                       Close
//                     </button>
//                   </div>
//                 ) : (
//                   <form onSubmit={handleAddSubmit} className="space-y-4">
//                     {/* General error */}
//                     {addFormErrors.general && (
//                       <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//                         <div className="flex items-center">
//                           <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                           </svg>
//                           <p className="text-sm text-red-600">{addFormErrors.general}</p>
//                         </div>
//                       </div>
//                     )}

//                     {/* Name field */}
//                     <div>
//                       <label htmlFor="Name" className="block text-sm font-medium text-gray-700 mb-1">
//                         Full Name *
//                       </label>
//                       <input
//                         type="text"
//                         id="Name"
//                         name="Name"
//                         value={addFormData.Name}
//                         onChange={handleAddInputChange}
//                         className={`block w-full px-3 py-2.5 text-sm border rounded-lg transition-colors duration-200 ${
//                           addFormErrors.Name 
//                             ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
//                             : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
//                         }`}
//                         placeholder="Enter full name"
//                         autoComplete="off"
//                       />
//                       {addFormErrors.Name && (
//                         <p className="mt-1 text-sm text-red-600">{addFormErrors.Name}</p>
//                       )}
//                     </div>

//                     {/* Email field */}
//                     <div>
//                       <label htmlFor="Email" className="block text-sm font-medium text-gray-700 mb-1">
//                         Email Address *
//                       </label>
//                       <input
//                         type="email"
//                         id="Email"
//                         name="Email"
//                         value={addFormData.Email}
//                         onChange={handleAddInputChange}
//                         className={`block w-full px-3 py-2.5 text-sm border rounded-lg transition-colors duration-200 ${
//                           addFormErrors.Email 
//                             ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
//                             : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
//                         }`}
//                         placeholder="Enter email address"
//                         autoComplete="off"
//                       />
//                       {addFormErrors.Email && (
//                         <p className="mt-1 text-sm text-red-600">{addFormErrors.Email}</p>
//                       )}
//                     </div>

//                     {/* Password field */}
//                     <div>
//                       <label htmlFor="Password" className="block text-sm font-medium text-gray-700 mb-1">
//                         Password *
//                       </label>
//                       <input
//                         type="password"
//                         id="Password"
//                         name="Password"
//                         value={addFormData.Password}
//                         onChange={handleAddInputChange}
//                         className={`block w-full px-3 py-2.5 text-sm border rounded-lg transition-colors duration-200 ${
//                           addFormErrors.Password 
//                             ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
//                             : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
//                         }`}
//                         placeholder="Enter password (min. 6 characters)"
//                         autoComplete="new-password"
//                       />
//                       {addFormErrors.Password && (
//                         <p className="mt-1 text-sm text-red-600">{addFormErrors.Password}</p>
//                       )}
//                       <p className="mt-2 text-xs text-gray-500 italic">
//                         Note: For security reasons, passwords are currently stored in plain text. Consider updating to hashed passwords in production.
//                       </p>
//                     </div>

//                     {/* Form actions - Responsive button layout */}
//                     <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
//                       <button
//                         type="button"
//                         onClick={closeAddModal}
//                         className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors duration-200"
//                         disabled={addSubmitting}
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="submit"
//                         disabled={addSubmitting}
//                         className="w-full sm:w-auto px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
//                       >
//                         {addSubmitting ? (
//                           <span className="flex items-center justify-center">
//                             <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                             </svg>
//                             Creating...
//                           </span>
//                         ) : (
//                           'Create User'
//                         )}
//                       </button>
//                     </div>
//                   </form>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit User Modal - RESPONSIVE */}
//       {showEditModal && (
//         <div className="fixed inset-0 z-50">
//           {/* Background overlay with your specified class */}
//           <div 
//             className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto"
//             onClick={closeEditModal}
//           >
//             {/* Modal panel - Responsive with max height and overflow */}
//             <div 
//               className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto my-auto transform transition-all max-h-[90vh] overflow-y-auto"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="p-4 sm:p-6">
//                 {/* Modal header */}
//                 <div className="mb-4">
//                   <h3 className="text-lg font-semibold text-gray-900">
//                     Edit User
//                   </h3>
//                   <p className="text-sm text-gray-500 mt-1">
//                     Update the user details for {editingUser?.name}.
//                   </p>
//                 </div>
                
//                 {editSubmitSuccess ? (
//                   <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//                     <div className="flex items-center">
//                       <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                       </svg>
//                       <span className="text-green-700 font-medium">User updated successfully!</span>
//                     </div>
//                     <p className="mt-2 text-sm text-green-600">
//                       The user details have been updated.
//                     </p>
//                     <button
//                       onClick={closeEditModal}
//                       className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
//                     >
//                       Close
//                     </button>
//                   </div>
//                 ) : (
//                   <form onSubmit={handleEditSubmit} className="space-y-4">
//                     {/* General error */}
//                     {editFormErrors.general && (
//                       <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//                         <div className="flex items-center">
//                           <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                           </svg>
//                           <p className="text-sm text-red-600">{editFormErrors.general}</p>
//                         </div>
//                       </div>
//                     )}

//                     {/* User ID (hidden) */}
//                     <input type="hidden" name="id" value={editFormData.id} />

//                     {/* Name field */}
//                     <div>
//                       <label htmlFor="editName" className="block text-sm font-medium text-gray-700 mb-1">
//                         Full Name *
//                       </label>
//                       <input
//                         type="text"
//                         id="editName"
//                         name="Name"
//                         value={editFormData.Name}
//                         onChange={handleEditInputChange}
//                         className={`block w-full px-3 py-2.5 text-sm border rounded-lg transition-colors duration-200 ${
//                           editFormErrors.Name 
//                             ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
//                             : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
//                         }`}
//                         placeholder="Enter full name"
//                         autoComplete="off"
//                       />
//                       {editFormErrors.Name && (
//                         <p className="mt-1 text-sm text-red-600">{editFormErrors.Name}</p>
//                       )}
//                     </div>

//                     {/* Email field */}
//                     <div>
//                       <label htmlFor="editEmail" className="block text-sm font-medium text-gray-700 mb-1">
//                         Email Address *
//                       </label>
//                       <input
//                         type="email"
//                         id="editEmail"
//                         name="Email"
//                         value={editFormData.Email}
//                         onChange={handleEditInputChange}
//                         className={`block w-full px-3 py-2.5 text-sm border rounded-lg transition-colors duration-200 ${
//                           editFormErrors.Email 
//                             ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
//                             : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
//                         }`}
//                         placeholder="Enter email address"
//                         autoComplete="off"
//                       />
//                       {editFormErrors.Email && (
//                         <p className="mt-1 text-sm text-red-600">{editFormErrors.Email}</p>
//                       )}
//                     </div>

//                     {/* Password Update Section */}
//                     <div className="border border-gray-200 rounded-lg p-4">
//                       <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 space-y-2 sm:space-y-0">
//                         <div>
//                           <h4 className="text-sm font-medium text-gray-700">Password Update</h4>
//                           <p className="text-xs text-gray-500">Optional - Leave blank to keep current password</p>
//                         </div>
//                         <button
//                           type="button"
//                           onClick={togglePasswordFields}
//                           className={`px-3 py-1.5 text-xs rounded-lg transition-colors duration-200 w-full sm:w-auto ${
//                             showPasswordFields
//                               ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
//                               : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200'
//                           }`}
//                         >
//                           {showPasswordFields ? 'Cancel Password Update' : 'Update Password'}
//                         </button>
//                       </div>

//                       {showPasswordFields && (
//                         <div className="space-y-3 pt-2 border-t border-gray-100">
//                           <div>
//                             <label htmlFor="editPassword" className="block text-sm font-medium text-gray-700 mb-1">
//                               New Password *
//                             </label>
//                             <input
//                               type="password"
//                               id="editPassword"
//                               name="Password"
//                               value={editFormData.Password}
//                               onChange={handleEditInputChange}
//                               className={`block w-full px-3 py-2.5 text-sm border rounded-lg transition-colors duration-200 ${
//                                 editFormErrors.Password 
//                                   ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
//                                   : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
//                               }`}
//                               placeholder="Enter new password (min. 6 characters)"
//                               autoComplete="new-password"
//                             />
//                             {editFormErrors.Password && (
//                               <p className="mt-1 text-sm text-red-600">{editFormErrors.Password}</p>
//                             )}
//                           </div>

//                           <div>
//                             <label htmlFor="editConfirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
//                               Confirm New Password *
//                             </label>
//                             <input
//                               type="password"
//                               id="editConfirmPassword"
//                               name="confirmPassword"
//                               value={editFormData.confirmPassword}
//                               onChange={handleEditInputChange}
//                               className={`block w-full px-3 py-2.5 text-sm border rounded-lg transition-colors duration-200 ${
//                                 editFormErrors.confirmPassword 
//                                   ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
//                                   : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
//                               }`}
//                               placeholder="Confirm new password"
//                               autoComplete="new-password"
//                             />
//                             {editFormErrors.confirmPassword && (
//                               <p className="mt-1 text-sm text-red-600">{editFormErrors.confirmPassword}</p>
//                             )}
//                           </div>
                          
//                           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
//                             <div className="flex items-start">
//                               <svg className="h-5 w-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                                 <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                               </svg>
//                               <div>
//                                 <p className="text-xs font-medium text-yellow-800">Security Notice</p>
//                                 <p className="text-xs text-yellow-700 mt-1">
//                                   Passwords are currently stored in plain text. If you update the password, 
//                                   the user will receive an email with their new credentials.
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     {/* Current status display */}
//                     {editingUser && (
//                       <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
//                         <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
//                           <div>
//                             <span className="text-sm font-medium text-gray-700">Current Status:</span>
//                             <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[editingUser.status] || 'bg-gray-100 text-gray-800'}`}>
//                               {editingUser.status}
//                             </span>
//                           </div>
//                           <p className="text-xs text-gray-500 mt-2">
//                             Member since: {editingUser.joinDate}
//                           </p>
//                         </div>
//                       </div>
//                     )}

//                     {/* Form actions - Responsive button layout */}
//                     <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
//                       <button
//                         type="button"
//                         onClick={closeEditModal}
//                         className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors duration-200"
//                         disabled={editSubmitting}
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="submit"
//                         disabled={editSubmitting}
//                         className="w-full sm:w-auto px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
//                       >
//                         {editSubmitting ? (
//                           <span className="flex items-center justify-center">
//                             <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                             </svg>
//                             Updating...
//                           </span>
//                         ) : (
//                           'Update User'
//                         )}
//                       </button>
//                     </div>
//                   </form>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserManagement;


import React, { useState, useEffect } from 'react';
import axiosInstance from './api/axiosInstance';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Status update state
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [statusUpdateError, setStatusUpdateError] = useState(null);
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(false);
  
  // Resend Credentials state
  const [resendingId, setResendingId] = useState(null);
  const [resendError, setResendError] = useState(null);
  const [resendSuccess, setResendSuccess] = useState(false);
  
  // Add User Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addFormData, setAddFormData] = useState({
    Name: '',
    Email: '',
    Password: ''
  });
  const [addFormErrors, setAddFormErrors] = useState({});
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addSubmitSuccess, setAddSubmitSuccess] = useState(false);

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/users');
      
      if (response.data.success) {
        const formattedUsers = response.data.data.map(user => ({
          id: user.id,
          name: user.Name,
          email: user.Email,
          status: user.status || 'Active',
          joinDate: user.created_at ? new Date(user.created_at).toLocaleDateString('en-CA') : new Date().toLocaleDateString('en-CA')
        }));
        
        setUsers(formattedUsers);
      } else {
        throw new Error(response.data.message || 'Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load users. Please try again.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Toggle user status (Activate/Deactivate)
  const toggleUserStatus = async (id) => {
    try {
      const user = users.find(u => u.id === id);
      if (!user) {
        alert('User not found');
        return;
      }
      
      const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
      const confirmMessage = user.status === 'Active' 
        ? `Are you sure you want to deactivate user "${user.name}"?\n\nDeactivated users cannot log in to the application.`
        : `Are you sure you want to activate user "${user.name}"?\n\nActivated users will be able to log in to the application.`;
      
      if (!window.confirm(confirmMessage)) {
        return;
      }
      
      setUpdatingStatusId(id);
      setStatusUpdateError(null);
      setStatusUpdateSuccess(false);
      
      const response = await axiosInstance.put(`/users/${id}/status`, { 
        status: newStatus 
      });
      
      if (response.data.success) {
        setStatusUpdateSuccess(true);
        
        // Update local state
        setUsers(users.map(user => 
          user.id === id 
            ? { ...user, status: newStatus }
            : user
        ));
        
        // Show success message
        setTimeout(() => {
          setStatusUpdateSuccess(false);
        }, 3000);
      } else {
        throw new Error(response.data.message || 'Failed to update user status');
      }
    } catch (err) {
      console.error('Error updating user status:', err);
      setStatusUpdateError(err.response?.data?.message || err.message || 'Failed to update user status. Please try again.');
      
      // Show error for 5 seconds
      setTimeout(() => {
        setStatusUpdateError(null);
      }, 5000);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // Resend user credentials
  const resendCredentials = async (id) => {
    try {
      const user = users.find(u => u.id === id);
      if (!user) {
        alert('User not found');
        return;
      }
      
      const confirmMessage = `Are you sure you want to resend credentials to user "${user.name}" (${user.email})?\n\nAn email with login credentials will be sent to the user.`;
      
      if (!window.confirm(confirmMessage)) {
        return;
      }
      
      setResendingId(id);
      setResendError(null);
      setResendSuccess(false);
      
      const response = await axiosInstance.post(`/users/${id}/resend-credentials`);
      
      if (response.data.success) {
        setResendSuccess(true);
        
        // Show success message
        setTimeout(() => {
          setResendSuccess(false);
        }, 3000);
      } else {
        throw new Error(response.data.message || 'Failed to resend credentials');
      }
    } catch (err) {
      console.error('Error resending credentials:', err);
      setResendError(err.response?.data?.message || err.message || 'Failed to resend credentials. Please try again.');
      
      // Show error for 5 seconds
      setTimeout(() => {
        setResendError(null);
      }, 5000);
    } finally {
      setResendingId(null);
    }
  };

  // Handle Add modal open
  const openAddUserModal = () => {
    setShowAddModal(true);
    setAddSubmitSuccess(false);
    setAddFormData({ Name: '', Email: '', Password: '' });
    setAddFormErrors({});
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  // Handle Add modal close
  const closeAddModal = () => {
    setShowAddModal(false);
    setAddFormData({ Name: '', Email: '', Password: '' });
    setAddFormErrors({});
    setAddSubmitSuccess(false);
    // Re-enable body scroll
    document.body.style.overflow = 'unset';
  };

  // Handle form input changes for Add
  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setAddFormData({
      ...addFormData,
      [name]: value
    });
    // Clear error for this field when user starts typing
    if (addFormErrors[name]) {
      setAddFormErrors({
        ...addFormErrors,
        [name]: ''
      });
    }
  };

  // Validate Add form
  const validateAddForm = () => {
    const errors = {};
    
    if (!addFormData.Name.trim()) {
      errors.Name = 'Name is required';
    }
    
    if (!addFormData.Email.trim()) {
      errors.Email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addFormData.Email)) {
      errors.Email = 'Please enter a valid email address';
    }
    
    if (!addFormData.Password) {
      errors.Password = 'Password is required';
    } else if (addFormData.Password.length < 6) {
      errors.Password = 'Password must be at least 6 characters';
    }
    
    return errors;
  };

  // Handle Add form submission
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateAddForm();
    if (Object.keys(errors).length > 0) {
      setAddFormErrors(errors);
      return;
    }
    
    try {
      setAddSubmitting(true);
      setAddFormErrors({});
      
      const response = await axiosInstance.post('/users/register', addFormData);
      
      if (response.data.success) {
        setAddSubmitSuccess(true);
        
        // Refresh users list after successful creation
        setTimeout(() => {
          fetchUsers();
          closeAddModal();
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Failed to create user');
      }
    } catch (err) {
      console.error('Error creating user:', err);
      
      // Handle specific errors
      if (err.response?.data?.message === 'Email already exists' || err.response?.data?.message?.includes('already exists')) {
        setAddFormErrors({
          Email: 'This email is already registered'
        });
      } else {
        setAddFormErrors({
          general: err.response?.data?.message || err.message || 'Failed to create user. Please try again.'
        });
      }
    } finally {
      setAddSubmitting(false);
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    Active: 'bg-green-100 text-green-800 border border-green-200',
    Inactive: 'bg-gray-100 text-gray-800 border border-gray-200',
  };

  return (
    <div className="space-y-6 no-select p-4 md:p-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage all users in your platform. View and manage user accounts.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button 
            onClick={openAddUserModal}
            className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New User
          </button>
        </div>
      </div>

      {/* Status Update Success/Error Messages */}
      {statusUpdateSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-700 font-medium">User status updated successfully!</span>
          </div>
        </div>
      )}

      {statusUpdateError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-700">{statusUpdateError}</span>
          </div>
          <button 
            onClick={() => setStatusUpdateError(null)}
            className="mt-2 px-3 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Resend Credentials Success/Error Messages */}
      {resendSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-700 font-medium">Credentials sent successfully!</span>
          </div>
        </div>
      )}

      {resendError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-700">{resendError}</span>
          </div>
          <button 
            onClick={() => setResendError(null)}
            className="mt-2 px-3 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users from database...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-700">{error}</span>
          </div>
          <button 
            onClick={fetchUsers}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Filters */}
          <div className="bg-white shadow rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Search */}
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                    Search Users
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="search"
                      className="focus:ring-red-500 focus:border-red-500 block w-full pl-10 pr-12 py-2.5 sm:text-sm border-gray-300 rounded-lg transition-colors duration-200"
                      placeholder="Search by name or email"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Status
                  </label>
                  <select
                    id="status"
                    className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-lg transition-colors duration-200"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">All Users ({filteredUsers.length})</h3>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">
                    Showing {filteredUsers.length} of {users.length} users
                  </span>
                  <button 
                    onClick={fetchUsers}
                    className="inline-flex items-center px-3.5 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors duration-200"
                  >
                    <svg className="h-4 w-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
                </div>
              </div>
              
              {filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-14 w-14 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No users found</h3>
                  <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                    {searchTerm || filterStatus !== 'All' 
                      ? "Try adjusting your search or filter" 
                      : "No users in the system yet. Click 'Add New User' to add your first user."}
                  </p>
                  {(searchTerm || filterStatus !== 'All') && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setFilterStatus('All');
                      }}
                      className="mt-4 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors duration-200"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3 border border-red-200">
                                <svg className="h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                                <div className="flex items-center mt-1">
                                  <span className="text-xs text-gray-500">
                                    Joined: {user.joinDate}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[user.status] || 'bg-gray-100 text-gray-800'}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => toggleUserStatus(user.id)}
                                disabled={updatingStatusId === user.id}
                                className={`px-3 py-1.5 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors duration-200 ${
                                  user.status === 'Active' 
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-300 border border-red-200' 
                                    : 'bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-300 border border-green-200'
                                } ${updatingStatusId === user.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                {updatingStatusId === user.id ? (
                                  <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                  </span>
                                ) : (
                                  user.status === 'Active' ? 'Deactivate' : 'Activate'
                                )}
                              </button>
                              <button
                                onClick={() => resendCredentials(user.id)}
                                disabled={resendingId === user.id}
                                className={`px-3 py-1.5 text-xs bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-1 border border-purple-200 transition-colors duration-200 ${
                                  resendingId === user.id ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                              >
                                {resendingId === user.id ? (
                                  <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-purple-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                  </span>
                                ) : (
                                  'Resend Credentials'
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Add User Modal - RESPONSIVE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50">
          {/* Background overlay with your specified class */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={closeAddModal}
          >
            {/* Modal panel - Responsive width and height */}
            <div 
              className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto my-auto transform transition-all max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-6">
                {/* Modal header */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Add New User
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Fill in the details to create a new user account.
                  </p>
                </div>
                
                {addSubmitSuccess ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-green-700 font-medium">User created successfully!</span>
                    </div>
                    <p className="mt-2 text-sm text-green-600">
                      The user will appear in the list shortly.
                    </p>
                    <button
                      onClick={closeAddModal}
                      className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleAddSubmit} className="space-y-4">
                    {/* General error */}
                    {addFormErrors.general && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          <p className="text-sm text-red-600">{addFormErrors.general}</p>
                        </div>
                      </div>
                    )}

                    {/* Name field */}
                    <div>
                      <label htmlFor="Name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="Name"
                        name="Name"
                        value={addFormData.Name}
                        onChange={handleAddInputChange}
                        className={`block w-full px-3 py-2.5 text-sm border rounded-lg transition-colors duration-200 ${
                          addFormErrors.Name 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
                        }`}
                        placeholder="Enter full name"
                        autoComplete="off"
                      />
                      {addFormErrors.Name && (
                        <p className="mt-1 text-sm text-red-600">{addFormErrors.Name}</p>
                      )}
                    </div>

                    {/* Email field */}
                    <div>
                      <label htmlFor="Email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="Email"
                        name="Email"
                        value={addFormData.Email}
                        onChange={handleAddInputChange}
                        className={`block w-full px-3 py-2.5 text-sm border rounded-lg transition-colors duration-200 ${
                          addFormErrors.Email 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
                        }`}
                        placeholder="Enter email address"
                        autoComplete="off"
                      />
                      {addFormErrors.Email && (
                        <p className="mt-1 text-sm text-red-600">{addFormErrors.Email}</p>
                      )}
                    </div>

                    {/* Password field */}
                    <div>
                      <label htmlFor="Password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password *
                      </label>
                      <input
                        type="password"
                        id="Password"
                        name="Password"
                        value={addFormData.Password}
                        onChange={handleAddInputChange}
                        className={`block w-full px-3 py-2.5 text-sm border rounded-lg transition-colors duration-200 ${
                          addFormErrors.Password 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
                        }`}
                        placeholder="Enter password (min. 6 characters)"
                        autoComplete="new-password"
                      />
                      {addFormErrors.Password && (
                        <p className="mt-1 text-sm text-red-600">{addFormErrors.Password}</p>
                      )}
                      {/* <p className="mt-2 text-xs text-gray-500 italic">
                        Note: For security reasons, passwords are currently stored in plain text. Consider updating to hashed passwords in production.
                      </p> */}
                    </div>

                    {/* Form actions - Responsive button layout */}
                    <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={closeAddModal}
                        className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors duration-200"
                        disabled={addSubmitting}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={addSubmitting}
                        className="w-full sm:w-auto px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        {addSubmitting ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating...
                          </span>
                        ) : (
                          'Create User'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  FileText, 
  Calendar, 
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  BarChart3,
  Folder
} from 'lucide-react';
import authAPI from "../../api/auth";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    setUser(currentUser);
    
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
        if (window.innerWidth < 1280) {
          setCollapsed(true);
        } else {
          setCollapsed(false);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/projects', label: 'Projects', icon: Briefcase },
    { path: '/admin/documents', label: 'Documents', icon: Folder },
    { path: '/admin/billing', label: 'Billing', icon: CreditCard },
    { path: '/admin/calendar', label: 'Calendar', icon: Calendar },
    { path: '/admin/reports', label: 'Reports', icon: BarChart3 },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleCollapse = () => setCollapsed(!collapsed);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    authAPI.logout();
    navigate('/admin/login');
  };

  const handleNavClick = () => {
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Mobile Header */}
      {isMobile && (
        <header className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={toggleSidebar}>
                {sidebarOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">K</span>
                </div>
                <div>
                  <h1 className="font-bold text-gray-800">Koso Admin</h1>
                  <p className="text-xs text-gray-500">Dashboard</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {user && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-medium">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white z-40
        shadow-xl
        ${isMobile
          ? `w-64 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
          : collapsed ? 'w-20' : 'w-64'
        }
        ${!isMobile ? 'transition-all duration-300' : ''}
      `}>
        {/* Logo Section */}
        <div className={`p-6 border-b border-gray-700 ${collapsed ? 'px-4' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              
              {!collapsed && (
                <div>
                  <h1 className="font-bold text-lg">Koso Admin</h1>
                  <p className="text-gray-400 text-xs">Management Panel</p>
                </div>
              )}
            </div>
            
            {!isMobile && !collapsed && (
              <button
                onClick={toggleCollapse}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* User Profile */}
        {user && !collapsed && (
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.company}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <li key={item.path}>
                  <button
                    onClick={() => {
                      navigate(item.path);
                      handleNavClick();
                    }}
                    className={`
                      w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200
                      ${active
                        ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-white border-l-4 border-blue-400'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white border-l-4 border-transparent'
                      }
                      ${collapsed ? 'justify-center' : ''}
                    `}
                    title={collapsed ? item.label : ''}
                  >
                    <Icon className={`${collapsed ? 'mr-0' : 'mr-3'} w-5 h-5`} />
                    {!collapsed && (
                      <>
                        <span className="font-medium">{item.label}</span>
                        {active && (
                          <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        )}
                      </>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className={`p-4 border-t border-gray-700 ${collapsed ? 'px-3' : ''}`}>
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center justify-center gap-2 py-3 rounded-lg
              bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800
              text-white font-medium transition-all duration-200
              ${collapsed ? 'px-3' : 'px-4'}
            `}
            title={collapsed ? 'Logout' : ''}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Desktop Collapse Button */}
        {!isMobile && collapsed && (
          <button
            onClick={toggleCollapse}
            className="absolute -right-3 top-6 bg-gray-800 text-gray-400 hover:text-white rounded-full p-1 border border-gray-700 shadow-lg"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </aside>

      {/* Main Content Spacer */}
      <div className={`
        ${isMobile ? 'ml-0' : collapsed ? 'ml-20' : 'ml-64'}
        transition-all duration-300
        ${isMobile ? 'pt-16' : ''}
      `}></div>
    </>
  );
};

export default Sidebar;
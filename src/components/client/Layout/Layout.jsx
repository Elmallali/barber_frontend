import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../store/slices/authSlice';
import { fetchNotifications, fetchClientProfile } from '../../../service/clientService';
import {
  BellIcon,
  UserIcon,
  CalendarIcon,
  HomeIcon,
  MenuIcon,
  XIcon
} from 'lucide-react';

// Enhanced NotificationBadge component with count display
const NotificationBadge = ({ count }) => {
  // If count is more than 9, show 9+
  const displayCount = count > 9 ? '9+' : count;
  
  return (
    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-xs font-bold rounded-full">
      {displayCount}
    </span>
  );
};

// ProfileDropdown component with logout functionality
const ProfileDropdown = ({ user, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  if (!isOpen) return null;
  
  const handleLogout = () => {
    dispatch(logout());
    onClose();
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/client/dashboard');
    onClose();
  };
  
  return (
    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="py-2">
        <div className="px-4 py-2 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email || 'user@example.com'}</p>
        </div>
        <button
          onClick={handleProfile}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
        >
          <UserIcon size={16} />
          Profile
        </button>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Disconnect
        </button>
      </div>
    </div>
  );
};
const NotificationDropdown = ({ notifications, isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Notifications</h3>
      </div>
      <div className="max-h-64 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
              !notification.read ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{notification.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              </div>
              <span className="text-xs text-gray-500">{notification.time}</span>
            </div>
            {!notification.read && (
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const Layout = ({ children, user }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch notifications and profile data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch notifications
        const notificationsData = await fetchNotifications();
        setNotifications(notificationsData || []);
        
        // Check if there are any unread notifications
        const hasUnread = notificationsData?.some(notification => !notification.read) || false;
        setHasNewNotifications(hasUnread);
        
        // Fetch profile data
        const profile = await fetchClientProfile();
        if (profile && profile.user) {
          setProfileData(profile);
          
          // Store basic user info in localStorage as fallback
          if (profile.user.name) localStorage.setItem('user_name', profile.user.name);
          if (profile.user.email) localStorage.setItem('user_email', profile.user.email);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Set up polling for notifications every 30 seconds
    const intervalId = setInterval(async () => {
      try {
        const notificationsData = await fetchNotifications();
        setNotifications(notificationsData || []);
        const hasUnread = notificationsData?.some(notification => !notification.read) || false;
        setHasNewNotifications(hasUnread);
      } catch (error) {
        console.error('Error polling notifications:', error);
      }
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Use profile data from API, or fallback to localStorage data, or default values
  const currentUser = profileData?.user || {
    name: localStorage.getItem('user_name') || user?.name || 'User',
    email: localStorage.getItem('user_email') || user?.email || '',
    avatar: user?.avatar || null
  };

  const navItems = [
    {
      name: 'Home',
      path: '/client',
      icon: <HomeIcon size={20} />
    },
    {
      name: 'Book',
      path: '/client/booking',
      icon: <CalendarIcon size={20} />
    },
    {
      name: 'Dashboard',
      path: '/client/dashboard',
      icon: <UserIcon size={20} />
    }
  ];

  return (
    <div className="flex flex-col h-full min-h-screen">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-700 hover:text-gray-900"
              >
                {mobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
              </button>
            </div>

            {/* LOGO */}
            <Link to="/client" className="text-xl font-bold text-blue-600 whitespace-nowrap">
              Barber<span className="text-gray-900">Time</span>
            </Link>

            {/* NAVBAR MIDDLE - Hidden on mobile */}
            <nav className="hidden md:flex flex-1 justify-center">
              <div className="flex gap-6">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>

            {/* NOTIFICATION + AVATAR */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => {
                    setNotificationDropdownOpen(!notificationDropdownOpen);
                    setProfileDropdownOpen(false);
                  }}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <BellIcon size={20} />
                  {hasNewNotifications && <NotificationBadge count={notifications.filter(n => !n.read).length} />}
                </button>
                <NotificationDropdown
                  notifications={notifications}
                  isOpen={notificationDropdownOpen}
                  onClose={() => setNotificationDropdownOpen(false)}
                />
              </div>
              
              <div className="relative">
                <button 
                  className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-1 transition-colors"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : '?'}
                    </div>
                  )}
                  <span className="hidden md:inline text-sm font-medium text-gray-700">
                    {currentUser.name}
                  </span>
                </button>
                <ProfileDropdown
                  user={currentUser}
                  isOpen={profileDropdownOpen}
                  onClose={() => setProfileDropdownOpen(false)}
                />
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-2">
              <div className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children && children}
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} BarberTime. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
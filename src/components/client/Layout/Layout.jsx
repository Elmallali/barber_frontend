import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  BellIcon,
  UserIcon,
  CalendarIcon,
  HomeIcon,
  MenuIcon,
  XIcon
} from 'lucide-react';

// Simple NotificationBadge component (inline since external import may not exist)
const NotificationBadge = () => (
  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
);

// Simple ProfileDropdown component
const ProfileDropdown = ({ user, isOpen, onClose }) => {
  if (!isOpen) return null;
  
  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out...');
    onClose();
  };

  const handleProfile = () => {
    // Add your profile navigation logic here
    console.log('Navigate to profile...');
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [hasNewNotifications] = useState(true);

  // Default user if none provided
  const defaultUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
  };
  const currentUser = user || defaultUser;

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

  const notifications = [
    {
      id: 1,
      type: 'ready',
      title: 'Almost Your Turn!',
      message: 'Please be ready in about 5 minutes',
      time: 'Just now',
      read: false
    },
    {
      id: 2,
      type: 'delay',
      title: 'Slight Delay',
      message: 'Your appointment is delayed by 10 minutes',
      time: '5 min ago',
      read: false
    },
    {
      id: 3,
      type: 'confirmation',
      title: 'Booking Confirmed',
      message: 'Your appointment is set for 2:30 PM',
      time: '1 hour ago',
      read: true
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
                  className="relative p-2 text-gray-500 hover:text-gray-700 transition"
                  onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                >
                  <BellIcon size={20} />
                  {hasNewNotifications && <NotificationBadge />}
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
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
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
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BellIcon,
  UserIcon,
  CalendarIcon,
  HomeIcon,
  MenuIcon,
  XIcon
} from 'lucide-react';
import { NotificationBadge } from '../UI/NotificationBadge';
import { NotificationDropdown } from '../UI/NotificationDropdown';

export const Layout = ({ children, user }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [hasNewNotifications] = useState(true);

  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: <HomeIcon size={20} />
    },
    {
      name: 'Book',
      path: '/booking',
      icon: <CalendarIcon size={20} />
    },
    {
      name: 'Dashboard',
      path: '/dashboard',
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
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-blue-600">BarberTime</span>
              </Link>
            </div>

            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === item.path
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  } transition-colors duration-200`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center">
              <div className="relative">
                <button
                  className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none transition-colors duration-200"
                  onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                >
                  <BellIcon size={20} />
                  {hasNewNotifications && <NotificationBadge />}
                </button>
                <NotificationDropdown
                  isOpen={notificationDropdownOpen}
                  onClose={() => setNotificationDropdownOpen(false)}
                  notifications={notifications}
                />
              </div>

              <div className="ml-3 relative">
                <div className="flex items-center">
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src={user.avatar}
                    alt={user.name}
                  />
                  <span className="hidden md:block ml-2 text-sm font-medium">
                    {user.name}
                  </span>
                </div>
              </div>

              <div className="ml-3 sm:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {mobileMenuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1 bg-white">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 ${
                    location.pathname === item.path
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} BarberTime. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

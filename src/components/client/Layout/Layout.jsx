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
      {/* LOGO */}
      <Link to="/client" className="text-xl font-bold text-blue-600 whitespace-nowrap">
        Barber<span className="text-gray-900">Time</span>
      </Link>

      {/* NAVBAR MIDDLE */}
      <nav className="flex-1 flex justify-center">
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
        <button
          className="p-2 text-gray-500 hover:text-gray-700 transition"
          onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
        >
          <BellIcon size={20} />
          {hasNewNotifications && <NotificationBadge />}
        </button>
        <img
          src={user.avatar}
          alt={user.name}
          className="h-8 w-8 rounded-full object-cover"
        />
        <span className="hidden md:inline text-sm font-medium text-gray-700">
          {user.name}
        </span>
      </div>
    </div>
  </div>
</header>


      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
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

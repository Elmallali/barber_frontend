import React, { useState } from 'react';
import {
  HomeIcon,
  UsersIcon,
  ClockIcon,
  UserIcon,
  SettingsIcon,
  SearchIcon
} from 'lucide-react';
import { NotificationBell } from './NotificationBell';

export function TopNavigation({ activePage, onNavigate, onOpenViewAll }) {
  const [showSearch, setShowSearch] = useState(false);

  const navItems = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: <HomeIcon size={20} />
    },
    {
      id: 'queue',
      label: 'Queue',
      icon: <UsersIcon size={20} />
    },
    {
      id: 'history',
      label: 'History',
      icon: <ClockIcon size={20} />
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <UserIcon size={20} />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <SettingsIcon size={20} />
    }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e5e7eb] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-[#111827] mr-8">
              BarberTime
            </h1>
            <nav className="hidden md:flex space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activePage === item.id
                      ? 'bg-[#2563eb] text-white'
                      : 'text-[#6b7280] hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {item.icon}
                    {item.label}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {showSearch && (
              <div className="relative">
                <SearchIcon
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search clients..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                />
              </div>
            )}

            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <SearchIcon size={20} />
            </button>

            <button
              onClick={onOpenViewAll}
              className="text-sm font-medium text-[#2563eb] hover:text-[#1d4ed8] transition-colors duration-200"
            >
              View All Clients
            </button>

            <NotificationBell />

            <div className="h-8 w-8 rounded-full overflow-hidden">
              <img
                src="https://randomuser.me/api/portraits/men/85.jpg"
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

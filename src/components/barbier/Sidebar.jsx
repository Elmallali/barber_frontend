import React from 'react';
import {
  HomeIcon,
  UsersIcon,
  ClockIcon,
  UserIcon,
  SettingsIcon
} from 'lucide-react';

export function Sidebar({ activePage, onNavigate }) {
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
    <aside className="w-64 border-r border-[#e5e7eb] bg-white h-screen flex flex-col py-6 shadow-sm">
      <div className="px-6 mb-8">
        <h1 className="text-xl font-semibold text-[#111827]">BarberTime</h1>
      </div>
      <nav className="flex-1">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`flex items-center w-full px-3 py-2 rounded-lg transition-all duration-200 ${
                  activePage === item.id
                    ? 'bg-[#2563eb] text-white'
                    : 'text-[#6b7280] hover:bg-gray-50'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

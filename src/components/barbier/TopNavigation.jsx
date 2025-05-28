// src/components/barbier/TopNavigation.jsx
import React, { useState } from "react";
import {
  HomeIcon,
  UsersIcon,
  ClockIcon,
  UserIcon,
  SettingsIcon,
  SearchIcon,
  LogOutIcon
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { NotificationBell } from "./NotificationBell";

export function TopNavigation({ onOpenViewAll }) {
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    {
      id: "dashboard",
      label: "Home",
      icon: <HomeIcon size={20} />,
      to: "/barbier/dashboard",
    },
    {
      id: "queue",
      label: "Queue",
      icon: <UsersIcon size={20} />,
      to: "/barbier/queue",
    },
    {
      id: "history",
      label: "History",
      icon: <ClockIcon size={20} />,
      to: "/barbier/history",
    },
    {
      id: "profile",
      label: "Profile",
      icon: <UserIcon size={20} />,
      to: "/barbier/profile",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <SettingsIcon size={20} />,
      to: "/barbier/settings",
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e5e7eb] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1
              className="text-xl font-semibold text-[#111827] mr-8 cursor-pointer"
              onClick={() => navigate("/barbier/dashboard")}
            >
              Barber<span className="text-gray-900">Time</span>
            </h1>
            <nav className="hidden md:flex space-x-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#2563eb] text-white"
                        : "text-[#6b7280] hover:bg-gray-50"
                    }`
                  }
                >
                  <span className="flex items-center gap-2">
                    {item.icon}
                    {item.label}
                  </span>
                </NavLink>
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

            <NotificationBell count={3} />

            <button
              onClick={onOpenViewAll}
              className="ml-2 px-3 py-1.5 bg-[#2563eb] text-white text-sm font-medium rounded-lg hover:bg-[#1d4ed8] transition-colors duration-200"
            >
              View All
            </button>
            
            <button
              onClick={handleLogout}
              className="ml-2 px-3 py-1.5 flex items-center gap-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <LogOutIcon size={16} />
              <span className="hidden md:inline">Logout</span>
            </button>

            <div className="h-8 w-8 rounded-full overflow-hidden cursor-pointer">
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

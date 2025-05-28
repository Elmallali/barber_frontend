// src/components/barbier/TopNavigation.jsx
import React, { useState, useEffect } from "react";
import {
  HomeIcon,
  UsersIcon,
  ClockIcon,
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  BellIcon
} from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { NotificationBell } from "./NotificationBell";
import authService from "../../service/authService";

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
    navigate('/barbier/profile');
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
          <LogOutIcon size={16} />
          Disconnect
        </button>
      </div>
    </div>
  );
};

export function TopNavigation({ onOpenViewAll }) {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: localStorage.getItem('user_name') || 'User',
    email: localStorage.getItem('user_email') || '',
    avatar: null
  });
  const [loading, setLoading] = useState(true);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userData = await authService.getCurrentUser();
        
        // Set avatar URL based on available data
        let avatarUrl = null;
        if (userData.avatar_url) {
          // Use the full URL provided by the backend
          avatarUrl = userData.avatar_url;
        } else if (userData.avatar) {
          // Fallback to constructing URL if only path is provided
          // Check if the avatar is a full URL or just a path
          if (userData.avatar.startsWith('http')) {
            avatarUrl = userData.avatar;
          } else {
            // Construct the full URL for the avatar
            avatarUrl = `http://localhost:8000/storage/${userData.avatar}`;
          }
        } else {
          // Use default avatar if none is provided
          avatarUrl = 'https://randomuser.me/api/portraits/men/85.jpg';
        }
        
        // Set user data
        setCurrentUser({
          name: userData.name || localStorage.getItem('user_name') || 'User',
          email: userData.email || localStorage.getItem('user_email') || '',
          avatar: avatarUrl
        });
        
        // Store basic user info in localStorage as fallback
        if (userData.name) localStorage.setItem('user_name', userData.name);
        if (userData.email) localStorage.setItem('user_email', userData.email);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const navItems = [
    {
      id: "dashboard",
      name: "Home",
      icon: <HomeIcon size={20} />,
      path: "/barbier/dashboard",
    },
    {
      id: "queue",
      name: "Queue",
      icon: <UsersIcon size={20} />,
      path: "/barbier/queue",
    },
    {
      id: "history",
      name: "History",
      icon: <ClockIcon size={20} />,
      path: "/barbier/history",
    },
    {
      id: "profile",
      name: "Profile",
      icon: <UserIcon size={20} />,
      path: "/barbier/profile",
    },
    {
      id: "settings",
      name: "Settings",
      icon: <SettingsIcon size={20} />,
      path: "/barbier/settings",
    },
  ];

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <NavLink to="/barbier/dashboard" className="text-xl font-bold text-blue-600 whitespace-nowrap">
            Barber<span className="text-gray-900">Time</span>
          </NavLink>

          {/* NAVBAR MIDDLE - Hidden on mobile */}
          <nav className="hidden md:flex flex-1 justify-center">
            <div className="flex gap-6">
              {navItems.map((item) => {
                // Check if this item is active based on current path
                const isItemActive = 
                  item.id === "dashboard" 
                    ? ["/barbier", "/barbier/", "/barbier/dashboard"].includes(location.pathname)
                    : location.pathname.startsWith(item.path);
                
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      isItemActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </NavLink>
                );
              })}
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
                <NotificationBadge count={1} />
              </button>
            </div>

            <button
              onClick={onOpenViewAll}
              className="ml-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              View All
            </button>
            
            <div className="relative">
              <button 
                className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-1 transition-colors"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-8 w-8 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold border-2 border-white shadow-sm">
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
      </div>
    </header>
  );
}

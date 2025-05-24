import React, { useState, useEffect } from 'react';
import { BellIcon, CheckIcon, ClockIcon, LoaderIcon, CheckCircleIcon } from 'lucide-react';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../../service/clientService';
import { motion } from 'framer-motion';

export const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const [error, setError] = useState(null);
  const [markingError, setMarkingError] = useState(null);
  
  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNotifications();
      
      if (!data && !Array.isArray(data)) {
        throw new Error('Failed to load notifications');
      }
      
      setNotifications(data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setError('Failed to load notifications. Please try again later.');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadNotifications();
  }, []);
  
  const handleMarkAsRead = async (notificationId) => {
    try {
      setMarkingError(null);
      await markNotificationAsRead(notificationId);
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      setMarkingError('Failed to mark notification as read. Please try again.');
    }
  };
  
  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAll(true);
      setMarkingError(null);
      await markAllNotificationsAsRead();
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    } finally {
      setMarkingAll(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'confirmation':
        return <CheckIcon size={20} className="text-green-500" />;
      case 'delay':
        return <ClockIcon size={20} className="text-amber-500" />;
      case 'ready':
        return <BellIcon size={20} className="text-blue-500" />;
      default:
        return <BellIcon size={20} className="text-gray-500" />;
    }
  };

  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-medium">Notifications</h2>
          <p className="text-gray-600 text-sm mt-1">
            Stay updated with your appointments
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={loadNotifications}
            disabled={loading}
            className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
            title="Refresh notifications"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${loading ? 'animate-spin' : ''}`}>
              <path d="M21 12a9 9 0 0 1-9 9c-4.97 0-9-4.03-9-9s4.03-9 9-9h3" />
              <path d="M21 3v6h-6" />
            </svg>
          </button>
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllAsRead}
              disabled={markingAll}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              {markingAll ? (
                <LoaderIcon size={16} className="animate-spin mr-1" />
              ) : (
                <CheckCircleIcon size={16} className="mr-1" />
              )}
              Mark all as read
            </button>
          )}
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {error && (
          <div className="p-4 bg-red-50 border-b border-red-100 text-red-600 text-sm flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 mt-0.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </div>
        )}
        
        {markingError && (
          <div className="p-4 bg-amber-50 border-b border-amber-100 text-amber-700 text-sm flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 mt-0.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            {markingError}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <LoaderIcon className="animate-spin mr-2" />
            <span>Loading notifications...</span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No notifications yet</div>
        ) : (
          notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    {getNotificationIcon(notification.type)}
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`text-sm font-medium ${
                        !notification.read ? 'text-blue-800' : 'text-gray-800'
                      }`}
                    >
                      {notification.title}
                    </h3>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                  {!notification.read && (
                    <button 
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <CheckIcon size={12} className="mr-1" />
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

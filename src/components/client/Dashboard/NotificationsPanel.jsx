import React from 'react';
import { BellIcon, CheckIcon, ClockIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export const NotificationsPanel = () => {
  const notifications = [
    {
      id: 1,
      type: 'confirmation',
      title: 'Appointment Confirmed',
      message: 'Your appointment at Classic Cuts has been confirmed for today at 2:30 PM.',
      time: '10 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'delay',
      title: 'Slight Delay',
      message: 'There is a 10-minute delay at Classic Cuts. Your new estimated time is 2:40 PM.',
      time: '5 minutes ago',
      read: false
    },
    {
      id: 3,
      type: 'ready',
      title: 'Almost Your Turn',
      message: 'You are next in line! Please be ready in about 5 minutes.',
      time: 'Just now',
      read: false
    },
    {
      id: 4,
      type: 'confirmation',
      title: 'Previous Appointment',
      message: 'Your appointment at Modern Shave has been completed. Thank you for your visit!',
      time: '2 days ago',
      read: true
    }
  ];

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

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-medium">Notifications</h2>
        <p className="text-gray-600 text-sm mt-1">
          Stay updated with your appointments
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {notifications.length === 0 ? (
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
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

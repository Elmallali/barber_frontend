import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BellIcon, CheckIcon, ClockIcon, XIcon } from 'lucide-react';

export const NotificationDropdown = ({ isOpen, onClose, notifications }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'confirmation':
        return <CheckIcon size={16} className="text-green-500" />;
      case 'delay':
        return <ClockIcon size={16} className="text-amber-500" />;
      case 'ready':
        return <BellIcon size={16} className="text-blue-500" />;
      default:
        return <BellIcon size={16} className="text-gray-500" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg z-40 overflow-hidden border border-gray-100"
          >
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Notifications</h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <XIcon size={16} />
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No new notifications
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`p-4 hover:bg-gray-50 transition-colors relative ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            {getIcon(notification.type)}
                          </div>
                        </div>
                        <div className="ml-3 flex-1">
                          <p
                            className={`text-sm font-medium ${
                              !notification.read ? 'text-blue-800' : 'text-gray-900'
                            }`}
                          >
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-0.5">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full absolute top-4 right-4" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => {}}
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors w-full text-center font-medium"
              >
                View All Notifications
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

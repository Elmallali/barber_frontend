import React, { useState } from 'react';
import { BellIcon } from 'lucide-react';

export function NotificationBell() {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      message: 'John Smith has arrived for his appointment',
      time: 'Just now',
    },
    {
      id: 2,
      message: 'Mike Johnson is on his way',
      time: '5 minutes ago',
    },
    {
      id: 3,
      message: 'David Williams cancelled his appointment',
      time: '1 hour ago',
    },
  ];

  return (
    <div className="relative">
      <button
        className="relative p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <BellIcon size={20} className="text-[#6b7280]" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-[#e5e7eb] z-10">
          <div className="p-3 border-b border-gray-100">
            <h3 className="font-medium text-gray-800">Notifications</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
              >
                <p className="text-sm text-gray-700">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
              </div>
            ))}
          </div>

          <div className="p-2 text-center border-t border-gray-100">
            <button className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

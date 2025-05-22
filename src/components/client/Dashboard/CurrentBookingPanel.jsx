import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClockIcon, MapPinIcon, XIcon } from 'lucide-react';
import { QueueVisualizer } from '../Booking/QueueVisualizer';

export const CurrentBookingPanel = () => {
  const location = useLocation();
  const { salon, barber, city, neighborhood } = location.state || {};

  const booking = {
    salon: salon?.name || 'Unknown Salon',
    barber: barber?.name || 'Unknown Barber',
    city: city || 'Unknown City',
    neighborhood: neighborhood || 'Unknown Area',
    queuePosition: 2,
    totalInQueue: 5,
    estimatedWaitTime: salon?.waitTime || '~10 min',
  };

  const handleCancel = () => {
    alert('Booking cancelled');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-medium">Current Booking</h2>
          <div className="mt-2 sm:mt-0 flex items-center bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-sm">
            <ClockIcon size={16} className="mr-2" />
            {booking.estimatedWaitTime}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row">
          {/* LEFT - Booking Info */}
          <div className="w-full md:w-1/2 mb-6 md:mb-0 md:pr-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-medium mb-4">Booking Details</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Salon</div>
                  <div className="font-medium">{booking.salon}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Barber</div>
                  <div className="font-medium">{booking.barber}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Location</div>
                  <div className="font-medium flex items-center">
                    <MapPinIcon size={16} className="mr-1 text-gray-400" />
                    {booking.city}, {booking.neighborhood}
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCancel}
                className="mt-6 w-full bg-red-50 hover:bg-red-100 text-red-600 py-2 px-4 rounded-lg flex items-center justify-center transition-colors duration-200"
              >
                <XIcon size={16} className="mr-2" />
                Cancel Booking
              </motion.button>
            </div>
          </div>

          {/* RIGHT - Queue Visualizer */}
          <div className="w-full md:w-1/2">
            <div className="bg-gray-50 rounded-xl p-6 h-full">
              <h3 className="text-lg font-medium mb-4">Queue Status</h3>
              <div className="mb-6">
                <QueueVisualizer position={booking.queuePosition} total={booking.totalInQueue} />
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Your position</span>
                  <span className="font-medium">
                    {booking.queuePosition} of {booking.totalInQueue}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{
                      width: `${(booking.totalInQueue - booking.queuePosition + 1) / booking.totalInQueue * 100}%`
                    }}
                  ></div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Estimated time until your turn: {booking.queuePosition * 5} minutes
                </p>
              </div>
              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-700 mb-2">Ready Soon!</h4>
                <p className="text-sm text-blue-600">
                  We'll notify you when it's almost your turn. Stay close to the salon!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

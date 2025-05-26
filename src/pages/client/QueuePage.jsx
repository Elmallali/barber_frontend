import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClockIcon, XIcon, MapPinIcon } from 'lucide-react';
import { QueueVisualizer } from '../../components/client/Booking/QueueVisualizer';

export const QueuePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { salon, barber, city, neighborhood } = location.state || {};

  const queuePosition = 3;
  const totalInQueue = 7;

  const handleCancel = () => {
    // Navigate back to booking page
    navigate('/client/booking');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-green-600">Your Active Booking</h2>
            <div className="mt-2 sm:mt-0 flex items-center bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-sm">
              <ClockIcon size={16} className="mr-2" />
              Estimated wait: {salon?.waitTime || "~15 min"}
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
                    <div className="font-medium">{salon?.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Barber</div>
                    <div className="font-medium">{barber?.name} ({barber?.experience})</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Location</div>
                    <div className="font-medium flex items-center">
                      <MapPinIcon size={16} className="mr-1 text-gray-400" />
                      {city}, {neighborhood}
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
                  <QueueVisualizer position={queuePosition} total={totalInQueue} />
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Your position</span>
                    <span className="font-medium">
                      {queuePosition} of {totalInQueue}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width: `${((totalInQueue - queuePosition + 1) / totalInQueue) * 100}%`
                      }}
                    ></div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Estimated time until your turn: {queuePosition * 5} minutes
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
      </motion.div>
    </div>
  );
};

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClockIcon, CheckIcon, XIcon, MapPinIcon, ScissorsIcon } from 'lucide-react';
import { QueueVisualizer } from '../../components/client/Booking/QueueVisualizer';

export const ConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { salon, barber, city, neighborhood } = location.state || {};

  const queuePosition = 3;
  const totalInQueue = 7;

  const handleConfirm = () => {
    navigate('/client/dashboard', {
      state: {
        salon,
        barber,
        city,
        neighborhood
      }
    });
  };

  const handleCancel = () => {
    navigate('booking');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold mb-2">Confirm Your Appointment</h1>
          <p className="text-gray-600">You're about to book an appointment at:</p>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-xl font-medium">{salon?.name}</h2>
              <p className="text-gray-600 flex items-center mt-1">
                <MapPinIcon size={16} className="mr-1 text-gray-400" />
                {city}, {neighborhood}
              </p>
              <p className="text-gray-600 flex items-center mt-1">
                <ScissorsIcon size={16} className="mr-1 text-gray-400" />
                Barber: {barber?.name} ({barber?.experience})
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
              <ClockIcon size={18} className="mr-2" />
              <span>Estimated wait: {salon?.waitTime}</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">Current Queue Status</h3>
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
                  style={{ width: `${(queuePosition / totalInQueue) * 100}%` }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Estimated time until your turn: {queuePosition * 5} minutes
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleConfirm}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium flex items-center justify-center transition-colors duration-200"
            >
              <CheckIcon size={18} className="mr-2" />
              Confirm Booking
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium flex items-center justify-center transition-colors duration-200"
            >
              <XIcon size={18} className="mr-2" />
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

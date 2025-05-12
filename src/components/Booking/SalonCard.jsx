import React from 'react';
import { StarIcon, ClockIcon, ArrowRightIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export const SalonCard = ({ salon, isSelected, onSelect }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white rounded-xl shadow-sm overflow-hidden border-2 transition-all duration-200 ${
        isSelected ? 'border-blue-500' : 'border-transparent'
      }`}
    >
      <div className="p-5">
        <div className="flex items-center mb-4">
          <img
            src={salon.logo}
            alt={salon.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="ml-3">
            <h3 className="font-medium">{salon.name}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <MapDistanceIndicator distance={salon.distance} />
            </div>
          </div>
        </div>
        <p className="text-gray-600 mb-4 text-sm">{salon.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <StarIcon size={16} className="text-yellow-500 mr-1" fill="currentColor" />
            <span className="text-sm font-medium">{salon.rating}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <ClockIcon size={16} className="mr-1" />
            <span>{salon.waitTime}</span>
          </div>
        </div>
        <button
          onClick={onSelect}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-colors duration-200"
        >
          Select
          <ArrowRightIcon size={16} className="ml-2" />
        </button>
      </div>
    </motion.div>
  );
};

const MapDistanceIndicator = ({ distance }) => {
  return (
    <div className="flex items-center">
      <span className="mr-1">{distance}</span>
    </div>
  );
};

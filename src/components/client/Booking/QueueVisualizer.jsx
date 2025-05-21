import React from 'react';
import { motion } from 'framer-motion';

export const QueueVisualizer = ({ position, total }) => {
  const queue = Array.from({ length: total }, (_, i) => ({
    id: i + 1,
    isUser: i + 1 === position
  }));

  return (
    <div className="flex justify-center items-end h-24 bg-white rounded-xl p-4 overflow-hidden">
      {queue.map((person, index) => (
        <motion.div
          key={person.id}
          className="mx-2 flex flex-col items-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{
            y: person.isUser ? [0, -5, 0] : 0,
            opacity: 1
          }}
          transition={{
            y: {
              repeat: person.isUser ? Infinity : 0,
              duration: 1.5,
              repeatType: 'reverse'
            },
            opacity: {
              duration: 0.5,
              delay: index * 0.1
            }
          }}
        >
          <StickFigure isUser={person.isUser} isActive={index === 0} />
          <div className={`mt-1 text-xs ${person.isUser ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
            {person.isUser ? 'You' : index === 0 ? 'Current' : ''}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const StickFigure = ({ isUser, isActive }) => {
  const color = isUser ? '#3B82F6' : isActive ? '#10B981' : '#D1D5DB';

  return (
    <svg width="20" height="40" viewBox="0 0 20 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="5" r="4" fill={color} />
      <line x1="10" y1="9" x2="10" y2="25" stroke={color} strokeWidth="2" />
      <line x1="10" y1="15" x2="3" y2="20" stroke={color} strokeWidth="2" />
      <line x1="10" y1="15" x2="17" y2="20" stroke={color} strokeWidth="2" />
      <line x1="10" y1="25" x2="5" y2="35" stroke={color} strokeWidth="2" />
      <line x1="10" y1="25" x2="15" y2="35" stroke={color} strokeWidth="2" />
    </svg>
  );
};
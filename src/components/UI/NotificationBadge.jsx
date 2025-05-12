import React from 'react';
import { motion } from 'framer-motion';

export const NotificationBadge = () => {
  return (
    <motion.span
      className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 15,
        repeat: Infinity,
        repeatType: 'reverse',
        repeatDelay: 2
      }}
    />
  );
};

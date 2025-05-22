import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QueuePreview } from './QueuePreview'; // تأكد من المسار

export const QueueJourneyToggle = () => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div
      className="w-full md:w-1/2 h-full flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div
        className="w-full h-full max-w-md rounded-2xl shadow-md overflow-hidden relative cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        <AnimatePresence mode="wait">
          {!showDetails ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full bg-cover bg-center flex flex-col items-center justify-center text-center p-6"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1612817152239-cc9a4be12254?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')"
              }}
            >
              <div className="bg-white/80 backdrop-blur-md rounded-xl p-4">
                <h2 className="text-xl font-bold text-blue-700">How Our Queue Works</h2>
                <p className="text-gray-600 text-sm mt-2">Click to see full journey</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 h-full flex items-center justify-center p-6"
            >
              <QueuePreview />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';

export const Tabs = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="border-b border-gray-200">
      <div className="flex overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative py-4 px-4 text-sm font-medium mr-8 whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            } transition-colors duration-200`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                initial={false}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

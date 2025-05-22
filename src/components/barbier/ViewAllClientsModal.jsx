import React, { useState } from 'react';
import { XIcon } from 'lucide-react';

export function ViewAllClientsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('WAITING');
  const tabs = ['WAITING', 'DONE', 'NO_SHOW', 'SKIPPED'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-200">
      <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-xl transition-transform duration-300 transform translate-x-0">
        <div className="h-full flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">All Clients</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <XIcon size={20} />
            </button>
          </div>

          <div className="border-b border-gray-200">
            <div className="flex space-x-1 p-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    activeTab === tab
                      ? 'bg-[#2563eb] text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-auto p-6">
            {/* Client cards would go here */}
            <div className="space-y-4">
              {/* Placeholder for client cards */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <p className="text-gray-600">No clients in this category</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

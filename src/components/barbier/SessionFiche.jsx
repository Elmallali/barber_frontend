import React from 'react';

export const SessionFiche = ({ client, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Session Summary</h2>
        <p className="text-gray-700 mb-2"><strong>Client:</strong> {client.name}</p>
        <p className="text-gray-700 mb-4"><strong>Duration:</strong> {client.duration}</p>
        <div className="text-right">
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  ToggleLeft,
  ToggleRight,
  Clock,
  Users,
  Star
} from 'lucide-react';

export function Settings() {
  const [queueOpen, setQueueOpen] = useState(true);
  const [maxClients, setMaxClients] = useState(15);
  const [minTrustScore, setMinTrustScore] = useState(3);
  const [acceptFavorites, setAcceptFavorites] = useState(false);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Settings</h1>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="space-y-8">
          {/* Queue Settings Section */}
          <div>
            <h2 className="text-lg font-medium text-gray-800 mb-4">Queue Settings</h2>
            <div className="space-y-6">
              {/* Toggle Queue */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-700">Queue Status</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Open or close your queue for new clients
                  </p>
                </div>
                <button onClick={() => setQueueOpen(!queueOpen)} className="text-2xl">
                  {queueOpen ? (
                    <ToggleRight size={36} className="text-green-500" />
                  ) : (
                    <ToggleLeft size={36} className="text-gray-400" />
                  )}
                </button>
              </div>

              {/* Working Hours */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Working Hours Start
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="time"
                      id="startTime"
                      defaultValue="09:00"
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Working Hours End
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="time"
                      id="endTime"
                      defaultValue="18:00"
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                  </div>
                </div>
              </div>

              {/* Max Clients */}
              <div>
                <label htmlFor="maxClients" className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Clients Per Day
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="maxClients"
                    min="1"
                    max="30"
                    value={maxClients}
                    onChange={(e) => setMaxClients(parseInt(e.target.value))}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Client Filters Section */}
          <div>
            <h2 className="text-lg font-medium text-gray-800 mb-4">Client Filters</h2>
            <div className="space-y-6">
              {/* Accept Favorites */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-700">Accept Only Favorites</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Only allow your favorite clients to book appointments
                  </p>
                </div>
                <button onClick={() => setAcceptFavorites(!acceptFavorites)} className="text-2xl">
                  {acceptFavorites ? (
                    <ToggleRight size={36} className="text-green-500" />
                  ) : (
                    <ToggleLeft size={36} className="text-gray-400" />
                  )}
                </button>
              </div>

              {/* Minimum Trust Score */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="trustScore" className="block text-sm font-medium text-gray-700">
                    Minimum Trust Score
                  </label>
                  <span className="text-sm font-medium text-gray-700">{minTrustScore}/5</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Star size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="range"
                    id="trustScore"
                    min="1"
                    max="5"
                    step="1"
                    value={minTrustScore}
                    onChange={(e) => setMinTrustScore(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-800 mt-2"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="button"
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

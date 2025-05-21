import React, { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';

export const SessionTimer = ({ startTime, client, sessionPaused, onPauseToggle, onReset }) => {
  const [elapsedTime, setElapsedTime] = useState('00:00');
  const [showPopup, setShowPopup] = useState(false);
  const totalPausedMs = useRef(0);
  const pausedAt = useRef(null);

  // Effect to track when pausing happens
  useEffect(() => {
    if (sessionPaused) {
      // When paused, store the current timestamp
      pausedAt.current = new Date();
    } else if (pausedAt.current) {
      // When resumed, add the paused duration to total paused time
      const pauseDuration = new Date() - pausedAt.current;
      totalPausedMs.current += pauseDuration;
      pausedAt.current = null;
    }
  }, [sessionPaused]);

  // Effect for the timer
  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      if (sessionPaused) return;

      const now = new Date();
      const totalElapsed = now - new Date(startTime) - totalPausedMs.current;
      const minutes = Math.floor(totalElapsed / 60000);
      const seconds = Math.floor((totalElapsed % 60000) / 1000);
      setElapsedTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, sessionPaused]);

  // Handler for reset button - completely restart the timer
  const handleReset = () => {
    totalPausedMs.current = 0;
    pausedAt.current = null;
    setElapsedTime('00:00');
    
    // Call the parent's onReset function to reset the start time
    if (onReset) {
      onReset();
    } else {
      // If no onReset function is provided, we need to handle the reset internally
      // This assumes the parent component will reset the startTime prop after onReset is called
      // If not, you might need to modify your parent component logic
      console.warn('SessionTimer: No onReset function provided. Timer might not fully reset.');
    }
  };

  return (
    <>
      {/* Button to open popup */}
      <button
        onClick={() => setShowPopup(true)}
        className="flex items-center gap-1 text-sm font-medium px-3 py-1.5 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition"
      >
        <Clock size={16} className="text-blue-500" />
        {elapsedTime}
      </button>

      {/* Pop-up timer details */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Session Timer</h2>

            <p className="text-gray-700 mb-1"><strong>Client:</strong> {client?.name}</p>
            <p className="text-gray-700 mb-1"><strong>Service:</strong> {client?.service}</p>
            <p className="text-gray-700 mb-3"><strong>Started At:</strong> {new Date(startTime).toLocaleTimeString()}</p>

            <p className="text-2xl font-bold text-center text-blue-700">{elapsedTime}</p>
            <p className="text-center text-sm text-gray-500 mt-1">{sessionPaused ? '⏸ Paused' : '▶ Running'}</p>

            <div className="mt-5 flex flex-col gap-3">
              <button
                onClick={onPauseToggle}
                className={`w-full py-2 rounded ${
                  sessionPaused ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-500 hover:bg-yellow-600'
                } text-white transition`}
              >
                {sessionPaused ? 'Resume' : 'Pause'}
              </button>

              <button
                onClick={handleReset}
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
              >
                Reset Timer
              </button>

              <button
                onClick={() => setShowPopup(false)}
                className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
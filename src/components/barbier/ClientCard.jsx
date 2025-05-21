import React from 'react';

export const ClientCard = ({
  client,
  type,
  onStart,
  onEndSession,
  onCancel,
  onMarkArrived,
  onResend,
  timer,
  sessionPaused,
  onPauseToggle,
  onReset
}) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
      {/* Info */}
      <div className="flex items-center space-x-4">
        <img src={client.avatar} alt={client.name} className="w-12 h-12 rounded-full object-cover" />
        <div>
          <p className="font-semibold text-gray-800">{client.name}</p>
          <p className="text-sm text-gray-500">
            {type === 'in-session' && `Started at ${client.startTime}`}
            {type === 'on-site' && `Waiting since ${client.waitingSince}`}
            {type === 'on-way' && `ETA ${client.arrivalTime}`}
            {type === 'invited' && `Invited at ${client.invitedAt}`}
          </p>
          <div className="flex space-x-2 mt-1">
            {client.trusted && (
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                ⭐ Trusted
              </span>
            )}
            {client.regular && (
              <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full font-medium">
                🧍 Regular
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        {type === 'in-session' && (
          <>
            {timer}

            <button
              onClick={onPauseToggle}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                sessionPaused
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
              }`}
            >
              {sessionPaused ? 'Resume' : 'Pause'}
            </button>

            <button
              onClick={onReset}
              className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-medium"
            >
              Reset
            </button>

            <button
              onClick={onEndSession}
              className="px-4 py-1.5 text-red-700 bg-red-100 hover:bg-red-200 rounded-lg text-sm font-medium"
            >
              End Session
            </button>
          </>
        )}

        {type === 'on-site' && (
          <button
            onClick={onStart}
            className="px-4 py-1.5 text-green-700 bg-green-100 hover:bg-green-200 rounded-lg text-sm font-medium"
          >
            Start
          </button>
        )}

        {type === 'on-way' && (
          <button
            onClick={onMarkArrived}
            className="px-4 py-1.5 text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg text-sm font-medium"
          >
            Arrived
          </button>
        )}

        {type === 'invited' && (
          <button
            onClick={onResend}
            className="px-4 py-1.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
          >
            Resend
          </button>
        )}

        <button onClick={onCancel} className="text-gray-500 hover:text-red-500 text-xl px-2">×</button>
      </div>
    </div>
  );
};

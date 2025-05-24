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
  // New props for loading states
  actionLoading = {}, // Object with loading states for different actions
  actionErrors = {} // Object with error states for different actions
}) => {
  // Helper function to determine if an action button should be disabled
  const isActionDisabled = (actionType) => {
    return actionLoading.markArrived || 
           actionLoading.startSession || 
           actionLoading.endSession || 
           actionLoading.cancelClient;
  };
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
              onClick={onEndSession}
              disabled={isActionDisabled('endSession') || actionLoading.endSession}
              className={`px-4 py-1.5 text-red-700 bg-red-100 hover:bg-red-200 rounded-lg text-sm font-medium flex items-center ${(isActionDisabled('endSession') || actionLoading.endSession) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {actionLoading.endSession ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : 'End Session'}
            </button>
          </>
        )}

        {type === 'on-site' && (
          <button
            onClick={onStart}
            disabled={isActionDisabled('startSession') || actionLoading.startSession}
            className={`px-4 py-1.5 text-green-700 bg-green-100 hover:bg-green-200 rounded-lg text-sm font-medium flex items-center ${(isActionDisabled('startSession') || actionLoading.startSession) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {actionLoading.startSession ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Starting...
              </>
            ) : 'Start'}
          </button>
        )}

        {type === 'on-way' && (
          <button
            onClick={onMarkArrived}
            disabled={isActionDisabled('markArrived') || actionLoading.markArrived}
            className={`px-4 py-1.5 text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg text-sm font-medium flex items-center ${(isActionDisabled('markArrived') || actionLoading.markArrived) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {actionLoading.markArrived ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : 'Arrived'}
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

        <button 
          onClick={onCancel} 
          disabled={isActionDisabled('cancelClient') || actionLoading.cancelClient}
          className={`text-gray-500 hover:text-red-500 text-xl px-2 ${(isActionDisabled('cancelClient') || actionLoading.cancelClient) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {actionLoading.cancelClient ? (
            <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : '×'}
        </button>
      </div>
    </div>
  );
};

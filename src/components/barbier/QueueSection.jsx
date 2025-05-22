import React, { useState } from 'react';
import { ClientCard } from './ClientCard';
import { SessionTimer } from './SessionTimer';
import { SessionFiche } from './SessionFiche';

export const QueueSection = ({
  title,
  type,
  clients,
  onClientAction,
  isSessionActive,
  sessionStartTime,
  sessionPaused,
  handleSessionControl
}) => {
  const [showFiche, setShowFiche] = useState(false);
  const [ficheData, setFicheData] = useState(null);

  const handleEndSession = (client) => {
    const now = new Date();
    const durationMs = now - new Date(client.sessionStartTime);
    const durationMin = Math.floor(durationMs / 60000);
    setFicheData({
      name: client.name,
      duration: durationMin,
    });
    setShowFiche(true);
    onClientAction(type, client.id, 'end');
  };

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>

      {clients.length === 0 ? (
        <p className="text-sm text-gray-500">No clients in this section</p>
      ) : (
        <div className="space-y-4">
          {clients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              type={type}
              onStart={() => onClientAction(type, client.id, 'start')}
              onCancel={() => onClientAction(type, client.id, 'cancel')}
              onMarkArrived={() => onClientAction(type, client.id, 'mark-arrived')}
              onResend={() => alert('Resend invitation')}
              onEndSession={() => handleEndSession(client)}
              timer={
                type === 'in-session' ? (
                  <SessionTimer
                    startTime={client.sessionStartTime}
                    client={client}
                    sessionPaused={sessionPaused}
                    onPauseToggle={() => handleSessionControl(sessionPaused ? 'resume' : 'pause')}
                    onReset={() => handleSessionControl('reset')}
                  />
                ) : null
              }
              sessionPaused={sessionPaused}
              onPauseToggle={() => handleSessionControl(sessionPaused ? 'resume' : 'pause')}
              onReset={() => handleSessionControl('reset')}
            />
          ))}
        </div>
      )}

      {showFiche && ficheData && (
        <SessionFiche
          client={ficheData}
          onClose={() => setShowFiche(false)}
        />
      )}
    </div>
  );
};

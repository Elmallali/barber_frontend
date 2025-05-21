import React from 'react';
import { QueueGrid } from '../../components/barbier/QueueGrid';

export function Queue({
  queueSections,
  onClientAction,
  isSessionActive,
  sessionStartTime,
  sessionPaused,
  handleSessionControl
}) {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Here's your queue overview
        </h1>
      </div>

      <QueueGrid
        sections={queueSections}
        onClientAction={onClientAction}
        isSessionActive={isSessionActive}
        sessionStartTime={sessionStartTime}
        sessionPaused={sessionPaused}
        onSessionControl={handleSessionControl}
      />
    </>
  );
}

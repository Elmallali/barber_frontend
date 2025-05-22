import React from 'react';
import { QueueSection } from './QueueSection';

export const QueueGrid = ({
  sections,
  onClientAction,
  isSessionActive,
  sessionStartTime,
  sessionPaused,
  onSessionControl
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {sections.map((section) => (
        <QueueSection
          key={section.type}
          title={section.title}
          type={section.type}
          clients={section.clients}
          onClientAction={onClientAction}
          isSessionActive={isSessionActive}
          sessionStartTime={sessionStartTime}
          sessionPaused={sessionPaused}
          handleSessionControl={onSessionControl}
        />
      ))}
    </div>
  );
};

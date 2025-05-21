import React, { useState } from 'react';
import { TopNavigation } from '../components/barbier/TopNavigation';
import { ViewAllClientsModal } from '../components/barbier/ViewAllClientsModal';
import { History } from '../pages/barbier/History';
import { Profile } from '../pages/barbier/Profile';
import { Settings } from '../pages/barbier/Settings';
import { Dashboard } from '../pages/barbier/Dashboard';
import { Queue } from '../pages/barbier/Queue';

// Fake Data
const initialClients = {
  'in-session': [],
  'on-site': [
    {
      id: 1,
      name: 'James Wilson',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      service: 'Haircut & Beard Trim',
      waitingSince: '10:30 AM',
      trusted: true,
      regular: true,
      notes: 'Prefers scissors over clippers',
    },
    {
      id: 2,
      name: 'Michael Brown',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      service: 'Haircut',
      waitingSince: '10:45 AM',
      trusted: true,
      regular: false,
      notes: 'First time client',
    },
  ],
  'on-way': [
    {
      id: 3,
      name: 'Robert Davis',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      service: 'Beard Trim',
      arrivalTime: '11:15 AM',
      trusted: false,
      regular: true,
      notes: 'Running 5 minutes late',
    },
  ],
  invited: [
    {
      id: 4,
      name: 'William Taylor',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
      service: 'Haircut & Styling',
      invitedAt: '10:00 AM',
      trusted: false,
      regular: false,
      notes: 'New client referral',
    },
    {
      id: 5,
      name: 'Daniel Moore',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
      service: 'Haircut & Beard Trim',
      invitedAt: '10:15 AM',
      trusted: true,
      regular: true,
      notes: 'Monthly appointment',
    },
  ],
};

export function BarbierRoutes() {
  const [activePage, setActivePage] = useState('dashboard');
  const [showViewAll, setShowViewAll] = useState(false);
  const [clients, setClients] = useState(initialClients);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionPaused, setSessionPaused] = useState(false);
  const [lastEndedClient, setLastEndedClient] = useState(null);

  const handleSessionControl = (action) => {
    switch (action) {
      case 'pause':
        setSessionPaused(true);
        break;
      case 'resume':
        setSessionPaused(false);
        break;
      case 'reset':
        setSessionStartTime(new Date());
        setSessionPaused(false);
        break;
      default:
        break;
    }
  };

  const handleClientAction = (type, clientId, action) => {
    switch (action) {
      case 'start': {
        if (isSessionActive) return;
        const clientToMove = clients[type].find((c) => c.id === clientId);
        if (!clientToMove) return;
        const now = new Date();
        setClients((prev) => ({
          ...prev,
          [type]: prev[type].filter((c) => c.id !== clientId),
          'in-session': [
            ...prev['in-session'],
            {
              ...clientToMove,
              startTime: now.toLocaleTimeString(),
              sessionStartTime: now,
            },
          ],
        }));
        setSessionStartTime(now);
        setIsSessionActive(true);
        setSessionPaused(false);
        break;
      }

      case 'end': {
        const sessionClient = clients['in-session'].find((c) => c.id === clientId);
        if (sessionClient) {
          const endTime = new Date();
          const durationMs = endTime - new Date(sessionClient.sessionStartTime);
          const minutes = Math.floor(durationMs / 60000);
          const seconds = Math.floor((durationMs % 60000) / 1000);
          const formattedDuration = `${minutes}m ${seconds}s`;

          setLastEndedClient({
            name: sessionClient.name,
            duration: formattedDuration,
          });

          setClients((prev) => ({
            ...prev,
            'in-session': [],
          }));
          setSessionStartTime(null);
          setIsSessionActive(false);
          setSessionPaused(false);
        }
        break;
      }

      case 'cancel': {
        if (type === 'in-session') {
          setSessionStartTime(null);
          setIsSessionActive(false);
          setSessionPaused(false);
        }
        setClients((prev) => ({
          ...prev,
          [type]: prev[type].filter((c) => c.id !== clientId),
        }));
        break;
      }

      case 'mark-arrived': {
        const clientToMove = clients['on-way'].find((c) => c.id === clientId);
        if (!clientToMove) return;
        setClients((prev) => ({
          ...prev,
          'on-way': prev['on-way'].filter((c) => c.id !== clientId),
          'on-site': [
            ...prev['on-site'],
            {
              ...clientToMove,
              waitingSince: new Date().toLocaleTimeString(),
            },
          ],
        }));
        break;
      }

      default:
        break;
    }
  };

  const queueSections = [
    { type: 'in-session', title: 'In Session', clients: clients['in-session'] },
    { type: 'on-site', title: 'On Site Waiting', clients: clients['on-site'] },
    { type: 'on-way', title: 'On The Way', clients: clients['on-way'] },
    { type: 'invited', title: 'Invited', clients: clients['invited'] },
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb] font-['Inter',sans-serif]">
      <TopNavigation
        activePage={activePage}
        onNavigate={setActivePage}
        onOpenViewAll={() => setShowViewAll(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activePage === 'dashboard' && <Dashboard onGoToQueue={() => setActivePage('queue')} />}

        {activePage === 'queue' && (
          <Queue
            queueSections={queueSections}
            onClientAction={handleClientAction}
            isSessionActive={isSessionActive}
            sessionStartTime={sessionStartTime}
            sessionPaused={sessionPaused}
            handleSessionControl={handleSessionControl}
          />
        )}

        {activePage === 'history' && <History />}
        {activePage === 'profile' && <Profile />}
        {activePage === 'settings' && <Settings />}
      </main>

      <ViewAllClientsModal isOpen={showViewAll} onClose={() => setShowViewAll(false)} />
    </div>
  );
}

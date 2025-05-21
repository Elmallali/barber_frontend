import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs } from '../../components/client/UI/Tabs';
import { NotificationsPanel } from '../../components/client/Dashboard/NotificationsPanel';
import { StatisticsPanel } from '../../components/client/Dashboard/StatisticsPanel';
import { ProfilePanel } from '../../components/client/Dashboard/ProfilePanel';
import { CurrentBookingPanel } from '../../components/client/Dashboard/CurrentBookingPanel';

export const DashboardPage = ({ user }) => {
  const [activeTab, setActiveTab] = useState('booking');

  const tabs = [
    { id: 'booking', label: 'Current Booking' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'statistics', label: 'My Statistics' },
    { id: 'profile', label: 'Profile' }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-6">My Dashboard</h1>
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        <div className="mt-6">
          {activeTab === 'booking' && <CurrentBookingPanel />}
          {activeTab === 'notifications' && <NotificationsPanel />}
          {activeTab === 'statistics' && <StatisticsPanel user={user} />}
          {activeTab === 'profile' && <ProfilePanel user={user} />}
        </div>
      </motion.div>
    </div>
  );
};

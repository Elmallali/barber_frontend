import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  ScissorsIcon,
  UserIcon,
  ClockIcon,
  StarIcon
} from 'lucide-react';

export const StatisticsPanel = ({ user }) => {
  const monthlyData = [
    { name: 'Jan', visits: 1 },
    { name: 'Feb', visits: 2 },
    { name: 'Mar', visits: 1 },
    { name: 'Apr', visits: 3 },
    { name: 'May', visits: 2 },
    { name: 'Jun', visits: 4 }
  ];

  const statsCards = [
    {
      title: 'Total Shaves',
      value: user.totalShaves,
      icon: <ScissorsIcon size={24} className="text-blue-500" />
    },
    {
      title: 'Most Visited',
      value: user.mostVisitedSalon,
      icon: <StarIcon size={24} className="text-amber-500" />
    },
    {
      title: 'Avg. Duration',
      value: `${user.avgSessionDuration} min`,
      icon: <ClockIcon size={24} className="text-green-500" />
    },
    {
      title: 'Favorite Barber',
      value: user.favoriteBarber,
      icon: <UserIcon size={24} className="text-purple-500" />
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-medium">My Statistics</h2>
        <p className="text-gray-600 text-sm mt-1">Track your barbershop visits</p>
      </div>

      <div className="p-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-gray-50 rounded-xl p-4"
            >
              <div className="flex items-center mb-2">
                {stat.icon}
                <h3 className="ml-2 text-sm font-medium text-gray-600">{stat.title}</h3>
              </div>
              <div className="text-lg font-semibold truncate">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Line Chart */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Visits Over Time</h3>
          <div className="h-64 bg-gray-50 rounded-xl p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="visits"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{
                    stroke: '#3b82f6',
                    strokeWidth: 2,
                    fill: 'white',
                    r: 4
                  }}
                  activeDot={{
                    stroke: '#3b82f6',
                    strokeWidth: 2,
                    fill: '#3b82f6',
                    r: 6
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div>
          <h3 className="text-lg font-medium mb-4">Monthly Distribution</h3>
          <div className="h-64 bg-gray-50 rounded-xl p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="visits" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

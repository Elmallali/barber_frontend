import React from 'react';
import {
  UsersIcon,
  ClockIcon,
  CalendarIcon,
  TrendingUpIcon,
  DollarSignIcon,
} from 'lucide-react';

export function Dashboard({ onGoToQueue }) {
  const stats = [
    {
      title: "Today's Queue",
      value: 3,
      description: 'clients waiting',
      icon: <UsersIcon className="w-6 h-6" />,
      color: 'text-blue-600',
    },
    {
      title: 'Average Wait Time',
      value: '25',
      description: 'minutes',
      icon: <ClockIcon className="w-6 h-6" />,
      color: 'text-green-600',
    },
    {
      title: 'Clients Served',
      value: 15,
      description: 'today',
      icon: <CalendarIcon className="w-6 h-6" />,
      color: 'text-purple-600',
    },
    {
      title: 'Weekly Growth',
      value: '12%',
      description: 'vs last week',
      icon: <TrendingUpIcon className="w-6 h-6" />,
      color: 'text-orange-600',
    },
    {
      title: "Today's Earnings",
      value: '450 MAD',
      description: 'so far',
      icon: <DollarSignIcon className="w-6 h-6" />,
      color: 'text-emerald-600',
    },
  ];

  const todaySchedule = [
    { id: 1, name: 'John Smith', service: 'Haircut & Beard Trim', waitingSince: '10 mins ago' },
    { id: 2, name: 'Robert Johnson', service: 'Haircut', waitingSince: '15 mins ago' },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#111827]">Welcome back, John!</h1>
        <p className="text-[#6B7280]">Here's what's happening with your barbershop today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className={stat.color}>{stat.icon}</span>
            </div>
            <h3 className="text-[#6B7280] text-sm font-medium">{stat.title}</h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-2xl font-semibold text-[#111827]">{stat.value}</p>
              <p className="ml-2 text-sm text-[#6B7280]">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm">
          <h2 className="text-lg font-medium text-[#111827] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onGoToQueue}
            className="p-4 text-center border border-[#E5E7EB] rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <UsersIcon className="w-6 h-6 mx-auto mb-2 text-[#2563EB]" />
            <span className="text-sm font-medium text-[#111827]">View Queue</span>
          </button>
            <button className="p-4 text-center border border-[#E5E7EB] rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <CalendarIcon className="w-6 h-6 mx-auto mb-2 text-[#2563EB]" />
              <span className="text-sm font-medium text-[#111827]">Schedule Client</span>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm">
          <h2 className="text-lg font-medium text-[#111827] mb-4">Today's Schedule</h2>
          {todaySchedule.length > 0 ? (
            <div className="space-y-4">
              {todaySchedule.map((client) => (
                <div key={client.id} className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg">
                  <div>
                    <p className="font-medium text-[#111827]">{client.name}</p>
                    <p className="text-sm text-[#6B7280]">{client.service}</p>
                  </div>
                  <span className="text-sm text-[#6B7280]">{client.waitingSince}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#6B7280] text-center py-4">No clients scheduled yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

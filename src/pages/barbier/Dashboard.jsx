import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UsersIcon,
  ClockIcon,
  CalendarIcon,
  TrendingUpIcon,
  DollarSignIcon,
  UserIcon,
  SettingsIcon,
  HistoryIcon
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDashboardData,
  selectClientsWaiting,
  selectAverageWaitTime,
  selectClientsServedToday,
  selectWeeklyGrowth,
  selectTodaysEarnings,
  selectCurrency,
  selectTodaysSchedule,
  selectDashboardLoading,
  selectDashboardError
} from '../../store/slices/dashboardSlice';
import { selectUser } from '../../store/slices/authSlice';

export function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  
  // Select dashboard data from the store
  const clientsWaiting = useSelector(selectClientsWaiting);
  const averageWaitTime = useSelector(selectAverageWaitTime);
  const clientsServedToday = useSelector(selectClientsServedToday);
  const weeklyGrowth = useSelector(selectWeeklyGrowth);
  const todaysEarnings = useSelector(selectTodaysEarnings);
  const currency = useSelector(selectCurrency);
  const todaysSchedule = useSelector(selectTodaysSchedule);
  const loading = useSelector(selectDashboardLoading);
  const error = useSelector(selectDashboardError);
  
  // Fetch dashboard data when component mounts
  useEffect(() => {
    if (user && user.barberId && user.salonId) {
      dispatch(fetchDashboardData({
        barberId: user.barberId,
        salonId: user.salonId
      }));
    }
  }, [dispatch, user]);
  
  // Create stats array with real data and proper formatting
  const stats = [
    {
      title: "Today's Queue",
      value: clientsWaiting,
      description: 'clients waiting',
      icon: <UsersIcon className="w-6 h-6" />,
      color: 'text-blue-600',
    },
    {
      title: 'Average Wait Time',
      value: typeof averageWaitTime === 'number' ? averageWaitTime.toFixed(0) : '0',
      description: 'minutes',
      icon: <ClockIcon className="w-6 h-6" />,
      color: 'text-green-600',
    },
    {
      title: 'Clients Served',
      value: clientsServedToday,
      description: 'today',
      icon: <CalendarIcon className="w-6 h-6" />,
      color: 'text-purple-600',
    },
    {
      title: 'Weekly Growth',
      value: typeof weeklyGrowth === 'number' ? `${weeklyGrowth.toFixed(0)}%` : '0%',
      description: 'vs last week',
      icon: <TrendingUpIcon className="w-6 h-6" />,
      color: 'text-orange-600',
    },
    {
      title: "Today's Earnings",
      value: `${typeof todaysEarnings === 'number' ? todaysEarnings.toFixed(0) : '0'} ${currency}`,
      description: 'so far',
      icon: <DollarSignIcon className="w-6 h-6" />,
      color: 'text-emerald-600',
    },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#111827]">Welcome back, {user?.name || 'Barber'}!</h1>
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
              onClick={() => navigate('/barbier/queue')}
              className="p-4 text-center border border-[#E5E7EB] rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <UsersIcon className="w-6 h-6 mx-auto mb-2 text-[#2563EB]" />
              <span className="text-sm font-medium text-[#111827]">View Queue</span>
            </button>
            <button 
              onClick={() => navigate('/barbier/history')}
              className="p-4 text-center border border-[#E5E7EB] rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <HistoryIcon className="w-6 h-6 mx-auto mb-2 text-[#2563EB]" />
              <span className="text-sm font-medium text-[#111827]">History</span>
            </button>
            <button 
              onClick={() => navigate('/barbier/profile')}
              className="p-4 text-center border border-[#E5E7EB] rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <UserIcon className="w-6 h-6 mx-auto mb-2 text-[#2563EB]" />
              <span className="text-sm font-medium text-[#111827]">Profile</span>
            </button>
            <button 
              onClick={() => navigate('/barbier/settings')}
              className="p-4 text-center border border-[#E5E7EB] rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <SettingsIcon className="w-6 h-6 mx-auto mb-2 text-[#2563EB]" />
              <span className="text-sm font-medium text-[#111827]">Settings</span>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm">
          <h2 className="text-lg font-medium text-[#111827] mb-4">Today's Schedule</h2>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : todaysSchedule && todaysSchedule.length > 0 ? (
            <div className="space-y-4">
              {todaysSchedule.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg">
                  <div>
                    <p className="font-medium text-[#111827]">{appointment.client_name}</p>
                    <p className="text-sm text-[#6B7280]">{appointment.service_type}</p>
                  </div>
                  <span className="text-sm text-[#6B7280]">
                    {appointment.time_ago ? 
                      (typeof appointment.time_ago === 'number' ? 
                        appointment.time_ago.toFixed(0) + ' mins ago' : 
                        appointment.time_ago + ' mins ago') : 
                      appointment.scheduled_time}
                  </span>
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

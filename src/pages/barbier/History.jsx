import React, { useState, Fragment } from 'react';
import {
  ChevronDownIcon,
  SearchIcon,
  CalendarIcon,
  FilterIcon
} from 'lucide-react';

export function History() {
  const [expandedRow, setExpandedRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // all | today | yesterday
  const [statusFilter, setStatusFilter] = useState('all'); // all | Completed | No-show

  const historyData = [
    {
      id: 1,
      client: {
        name: 'James Wilson',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      service: 'Haircut & Beard Trim',
      date: 'Today, 10:15 AM',
      duration: '45 min',
      status: 'Completed',
      notes:
        'Client requested shorter sides than usual. Discussed beard maintenance routine.'
    },
    {
      id: 2,
      client: {
        name: 'Michael Brown',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
      },
      service: 'Haircut',
      date: 'Today, 9:00 AM',
      duration: '30 min',
      status: 'Completed',
      notes: 'Regular cut, no special requests.'
    },
    {
      id: 3,
      client: {
        name: 'Robert Davis',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
      },
      service: 'Beard Trim',
      date: 'Yesterday, 4:30 PM',
      duration: '20 min',
      status: 'Completed',
      notes: 'Shaped beard according to reference photo.'
    },
    {
      id: 4,
      client: {
        name: 'William Moore',
        avatar: 'https://randomuser.me/api/portraits/men/75.jpg'
      },
      service: 'Haircut',
      date: 'Yesterday, 3:15 PM',
      duration: '35 min',
      status: 'No-show',
      notes: "Client didn't show up for appointment."
    }
  ];

  // Filtering logic
  const filteredByName = historyData.filter(session =>
    session.client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredByDate = filteredByName.filter(session => {
    if (dateFilter === 'all') return true;
    if (dateFilter === 'today') return session.date.includes('Today');
    if (dateFilter === 'yesterday') return session.date.includes('Yesterday');
    return true;
  });

  const finalData = filteredByDate.filter(session => {
    if (statusFilter === 'all') return true;
    return session.status === statusFilter;
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Session History
      </h1>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <SearchIcon
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by client name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setDateFilter(
                  dateFilter === 'all'
                    ? 'today'
                    : dateFilter === 'today'
                    ? 'yesterday'
                    : 'all'
                )
              }
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <CalendarIcon size={16} />
              <span>
                {dateFilter === 'all'
                  ? 'All Dates'
                  : dateFilter === 'today'
                  ? 'Today'
                  : 'Yesterday'}
              </span>
            </button>
            <button
              onClick={() =>
                setStatusFilter(
                  statusFilter === 'all'
                    ? 'Completed'
                    : statusFilter === 'Completed'
                    ? 'No-show'
                    : 'all'
                )
              }
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <FilterIcon size={16} />
              <span>
                {statusFilter === 'all'
                  ? 'All'
                  : statusFilter === 'Completed'
                  ? 'Completed'
                  : 'No-show'}
              </span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {finalData.map((session) => (
                <Fragment key={session.id}>
                  <tr className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={session.client.avatar}
                          alt={session.client.name}
                          className="w-8 h-8 rounded-full mr-3 object-cover"
                        />
                        <span className="font-medium text-gray-800">
                          {session.client.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {session.service}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{session.date}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {session.duration}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          session.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {session.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() =>
                          setExpandedRow(
                            expandedRow === session.id ? null : session.id
                          )
                        }
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        <ChevronDownIcon
                          size={18}
                          className={`transform transition-transform duration-200 ${
                            expandedRow === session.id ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </td>
                  </tr>
                  {expandedRow === session.id && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 bg-gray-50">
                        <div className="text-sm text-gray-700">
                          <p className="font-medium mb-1">Session Notes:</p>
                          <p>{session.notes}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

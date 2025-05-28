import React, { useState, Fragment, useEffect } from 'react';
import {
  ChevronDownIcon,
  SearchIcon,
  CalendarIcon,
  ClockIcon,
  ScissorsIcon,
  UserIcon
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClientsByStatus, selectClients, selectClientsLoading, selectClientsError } from '../../store/slices/clientsSlice';
import { selectUser } from '../../store/slices/authSlice';
import api from '../../service/api';

export function History() {
  const dispatch = useDispatch();
  const clients = useSelector(selectClients);
  const loading = useSelector(selectClientsLoading);
  const error = useSelector(selectClientsError);
  const user = useSelector(selectUser);
  
  const [expandedRow, setExpandedRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // all | today | yesterday
  const [completedSessions, setCompletedSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch completed sessions directly from API for more detailed data
  useEffect(() => {
    const fetchCompletedSessions = async () => {
      try {
        setIsLoading(true);
        const barberId = user?.barberId || null;
        const salonId = user?.salonId || 1;
        
        // Use the queue/entries endpoint with status=DONE to get completed sessions
        const { data } = await api.get('/api/queue/entries', {
          params: {
            salon_id: salonId,
            barber_id: barberId,
            status: 'DONE'
          }
        });
        
        console.log('API Response:', data);
        
        if (data && Array.isArray(data)) {
          const formattedSessions = data.map(entry => {
            // For DONE status with missing finished_at, calculate duration from started_at to now
            let duration;
            if (entry.started_at) {
              if (entry.finished_at) {
                duration = calculateDurationFromTimestamps(entry.started_at, entry.finished_at);
              } else {
                // If status is DONE but no finished_at, calculate from started_at to now
                const start = new Date(entry.started_at);
                const end = new Date();
                if (!isNaN(start.getTime())) {
                  const durationMin = Math.round((end - start) / 60000);
                  duration = `${durationMin} min`;
                } else {
                  duration = 'N/A';
                }
              }
            } else {
              duration = 'N/A';
            }
            
            return {
              id: entry.id,
              client_name: entry.name || 'Unknown Client',
              client_avatar: entry.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.name || 'Unknown')}&background=random`,
              client_email: entry.email || '',
              client_phone: entry.phone || '',
              service_name: entry.service_type || entry.service || 'Haircut',
              started_at: entry.started_at,
              finished_at: entry.finished_at,
              created_at: entry.created_at,
              notes: entry.notes || '',
              barber_name: entry.barber_name || user?.name || 'Current Barber',
              duration: duration
            };
          });
          
          setCompletedSessions(formattedSessions);
        } else {
          console.error('Invalid data format received:', data);
          setCompletedSessions([]);
        }
      } catch (error) {
        console.error('Error fetching completed sessions:', error);
        
        // Fallback to Redux store data if direct API call fails
        const barberId = user?.barberId || null;
        const salonId = user?.salonId || 1;
        
        dispatch(fetchClientsByStatus({ 
          salonId: salonId, 
          status: 'DONE',
          barberId: barberId
        }));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCompletedSessions();
  }, [dispatch, user]);

  // Direct calculation function for duration
  const calculateDurationFromTimestamps = (startTime, endTime) => {
    if (!startTime || !endTime) {
      // For DONE status with no finished_at, use current time as end time
      if (startTime) {
        const start = new Date(startTime);
        const end = new Date();
        if (!isNaN(start.getTime())) {
          const durationMin = Math.round((end - start) / 60000);
          return `${durationMin} min`;
        }
      }
      return 'N/A';
    }
    
    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return 'N/A';
      }
      
      const durationMs = end - start;
      const durationMin = Math.round(durationMs / 60000);
      
      if (durationMin < 0) return 'N/A';
      
      return `${durationMin} min`;
    } catch (error) {
      return 'N/A';
    }
  };

  // Process client data from Redux store as fallback
  useEffect(() => {
    if (isLoading && clients && clients.length > 0) {
      const sessions = clients.map(client => ({
        id: client.id,
        client_name: client.name || 'Unknown Client',
        client_avatar: client.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(client.name || 'Unknown')}&background=random`,
        client_email: client.email || '',
        client_phone: client.phone || '',
        service_name: client.service_type || client.service || 'Haircut',
        started_at: client.started_at,
        finished_at: client.finished_at,
        created_at: client.created_at,
        notes: client.notes || '',
        barber_name: client.barber_name || user?.name || 'Current Barber',
        duration: calculateDurationFromTimestamps(client.started_at, client.finished_at)
      }));
      setCompletedSessions(sessions);
      setIsLoading(false);
    }
  }, [clients, isLoading, user]);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if date is today
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Check if date is yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise return full date
    return date.toLocaleString([], { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filtering logic
  const filteredByName = completedSessions.filter(session =>
    (session.client_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const finalData = filteredByName.filter(session => {
    const formattedDate = formatDate(session.started_at || session.created_at);
    
    if (dateFilter === 'all') return true;
    if (dateFilter === 'today') return formattedDate.includes('Today');
    if (dateFilter === 'yesterday') return formattedDate.includes('Yesterday');
    return true;
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
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : finalData.length === 0 ? (
          <div className="text-gray-500 text-center p-4 py-10">No completed sessions found</div>
        ) : (
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
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {finalData.map((session) => (
                  <Fragment key={session.id}>
                    <tr className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {session.client_avatar ? (
                            <img
                              src={session.client_avatar}
                              alt={session.client_name}
                              className="w-8 h-8 rounded-full mr-3 object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full mr-3 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                              {session.client_name ? session.client_name.charAt(0).toUpperCase() : '?'}
                            </div>
                          )}
                          <span className="font-medium text-gray-800">
                            {session.client_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        <div className="flex items-center">
                          <ScissorsIcon size={16} className="mr-2 text-gray-400" />
                          {session.service_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        <div className="flex items-center">
                          <ClockIcon size={16} className="mr-2 text-gray-400" />
                          {formatDate(session.started_at || session.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {session.duration}
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
                        <td colSpan={5} className="px-6 py-4 bg-gray-50">
                          <div className="text-sm text-gray-700 space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="font-medium mb-1 flex items-center">
                                  <UserIcon size={16} className="mr-2" />
                                  Client Details:
                                </p>
                                <p>Email: {session.client_email || 'Not provided'}</p>
                                <p>Phone: {session.client_phone || 'Not provided'}</p>
                              </div>
                              <div>
                                <p className="font-medium mb-1">Session Details:</p>
                                <p>Barber: {session.barber_name || 'Not specified'}</p>
                                {session.started_at && (
                                  <p>Started: {formatDate(session.started_at)}</p>
                                )}
                                {session.finished_at && (
                                  <p>Completed: {formatDate(session.finished_at)}</p>
                                )}
                              </div>
                            </div>
                            <div className="mt-2">
                              <p className="font-medium mb-1">Notes:</p>
                              <p>{session.notes || 'No notes for this session.'}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

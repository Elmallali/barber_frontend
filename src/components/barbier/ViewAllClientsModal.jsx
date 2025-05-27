import React, { useEffect } from 'react';
import { XIcon, Loader2, CheckCircle, XCircle, SkipForward, Clock } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClientsByStatus, setActiveTab, selectClients, selectClientsLoading, selectClientsError, selectActiveTab } from '../../store/slices/clientsSlice';
import { selectUser } from '../../store/slices/authSlice';

export function ViewAllClientsModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const entries = useSelector(selectClients);
  const loading = useSelector(selectClientsLoading);
  const error = useSelector(selectClientsError);
  const activeTab = useSelector(selectActiveTab);
  const user = useSelector(selectUser);
  const barberId = user?.barberId || null; // Get barber ID directly from user object
  const salonId = user?.salonId || 1; // Get salon ID from auth, fallback to 1
  
  const tabs = [
    { value: 'WAITING', label: 'Waiting', icon: <Clock size={16} className="text-blue-500" /> },
    { value: 'DONE', label: 'Completed', icon: <CheckCircle size={16} className="text-green-500" /> },
    { value: 'NO_SHOW', label: 'No Show', icon: <XCircle size={16} className="text-red-500" /> },
    { value: 'SKIPPED', label: 'Skipped', icon: <SkipForward size={16} className="text-yellow-500" /> }
  ];
  
  useEffect(() => {
    console.log('SalonId:', salonId);
    console.log('BarberId:', barberId);
    console.log('Modal open:', isOpen);
    if (isOpen && salonId) {
      dispatch(fetchClientsByStatus({ 
        salonId: salonId, 
        status: activeTab,
        barberId: barberId // Pass barberId to filter by specific barber
      }));
    }
  }, [isOpen, activeTab, salonId, barberId, dispatch]);
  
  const handleTabChange = (tab) => {
    dispatch(setActiveTab(tab));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-200">
      <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-xl transition-transform duration-300 transform translate-x-0">
        <div className="h-full flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">All Clients</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <XIcon size={20} />
            </button>
          </div>

          <div className="border-b border-gray-200">
            <div className="flex space-x-1 p-2 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => handleTabChange(tab.value)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                    activeTab === tab.value
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>


          
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : error ? (
              <div className="text-red-500 text-center p-4">{error}</div>
            ) : entries.length === 0 ? (
              <div className="text-gray-500 text-center p-4">No clients found</div>
            ) : (
              <div className="space-y-3">
                {entries.map((client) => (
                  <div
                    key={client.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{client.name}</h3>
                        <p className="text-sm text-gray-500">{client.email}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {client.status === 'WAITING' && <Clock size={18} className="text-blue-500" />}
                        {client.status === 'DONE' && <CheckCircle size={18} className="text-green-500" />}
                        {client.status === 'NO_SHOW' && <XCircle size={18} className="text-red-500" />}
                        {client.status === 'SKIPPED' && <SkipForward size={18} className="text-yellow-500" />}
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(client.status)}`}>
                          {formatStatus(client.status)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      <p>Added: {new Date(client.created_at).toLocaleString()}</p>
                      {client.started_at && (
                        <p>Started: {new Date(client.started_at).toLocaleString()}</p>
                      )}
                      {client.completed_at && (
                        <p>Completed: {new Date(client.completed_at).toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get the color class based on status
function getStatusColor(status) {
  switch (status) {
    case 'WAITING':
      return 'bg-blue-100 text-blue-800';
    case 'DONE':
      return 'bg-green-100 text-green-800';
    case 'NO_SHOW':
      return 'bg-red-100 text-red-800';
    case 'SKIPPED':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Helper function to format status for display
function formatStatus(status) {
  return status.replace('_', ' ');
}

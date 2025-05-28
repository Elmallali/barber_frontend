import api from './api';

// Get salons by location (city and neighborhood)
export const getSalonsByLocation = async (city, neighborhood = null) => {
  // Create query parameters
  const params = new URLSearchParams();
  if (city) params.append('city', city);
  if (neighborhood) params.append('neighborhood', neighborhood);
  
  return await api.get(`/api/salons?${params.toString()}`);
};

// Get barbers for a salon
export const getBarbersForSalon = async (salonId) => {
  try {
    // Just use real API data
    const response = await api.get(`/api/salons/${salonId}/barbers`);
    return response;
  } catch (error) {
    console.error(`Error fetching barbers for salon ${salonId}:`, error);
    throw error; // Let the calling code handle errors
  }
};

// Create a booking using the QueueEntryController.createBooking endpoint
export const createBooking = async (salonId, barberId, clientId) => {
  // Fixed endpoint to match backend route
  return await api.post('/api/bookings', { 
    salon_id: salonId, 
    barber_id: barberId, 
    client_id: clientId 
  });
};

// Get active booking for a client
export const getActiveBooking = async (clientId) => {
  // Fixed endpoint to match backend route
  return await api.get(`/api/clients/${clientId}/bookings/active`);
};

// Cancel booking using the QueueEntryController.cancel endpoint
export const cancelBooking = async (entryId) => {
  // Fixed endpoint to match backend route
  return await api.post('/api/queue/entry/cancel', { entry_id: entryId });
};

// Get available cities and neighborhoods with salons
export const getAvailableLocations = async () => {
  return await api.get('/api/salons/locations');
};

// Get queue information for a specific barber and salon
export const getQueueInfo = async (salonId, barberId) => {
  return await api.get(`/api/salons/${salonId}/barbers/${barberId}/queue-info`);
};

// Update notification threshold for a booking
export const updateNotificationThreshold = async (entryId, threshold) => {
  return await api.post('/api/queue/update-notification-threshold', {
    entry_id: entryId,
    notification_threshold: threshold
  });
};

// Confirm booking (I'm on my way)
export const confirmBooking = async (entryId) => {
  return await api.post(`/api/queue/entry/${entryId}/confirm`);
};

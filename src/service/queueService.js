import api from "./api"; 

export const fetchQueueData = async (salonId) => {
  const { data } = await api.get(`/api/salons/${salonId}/queue`);
  return data;
};

// Fetch active queue data for a specific salon
export const fetchActiveQueue = async (salonId) => {
  const { data } = await api.get(`/api/queue/salon/${salonId}`);
  return data;
};

// Mark a client as arrived (on-site)
export const markClientArrived = async (entryId) => {
  const { data } = await api.post(`/api/queue/entry/on-site`, { entry_id: entryId });
  return data;
};

// Start a service session for a client
export const startClientSession = async (entryId, barberId) => {
  const { data } = await api.post(`/api/queue/entry/start`, { 
    entry_id: entryId,
    barber_id: barberId
  });
  return data;
};

// End a service session for a client
export const finishClientSession = async (entryId, servicePrice) => {
  const { data } = await api.post(`/api/queue/entry/finish`, { 
    entry_id: entryId,
    service_price: servicePrice
  });
  return data;
};

// Cancel a client's queue entry
export const cancelClientEntry = async (entryId) => {
  const { data } = await api.post(`/api/queue/entry/cancel`, { entry_id: entryId });
  return data;
};

// Get all queue entries with their status
export const getAllQueueEntries = async (salonId, status = null) => {
  const { data } = await api.get(`/api/queue/entries`, {
    params: {
      salon_id: salonId,
      status: status
    }
  });
  return data;
};

export const queueService = {
  getAllQueueEntries
};

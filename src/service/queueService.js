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

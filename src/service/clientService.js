import api from "./api";

// Fetch the client's last visit information
export const fetchLastVisit = async () => {
  try {
    const { data } = await api.get("/client/last-visit");
    return data;
  } catch (error) {
    console.error("Error fetching last visit:", error);
    return {
      last_visit: null,
      days_ago: null,
      salon_name: null
    };
  }
};

// Fetch client statistics
export const fetchClientStats = async () => {
  try {
    const { data } = await api.get("/client/stats");
    return data;
  } catch (error) {
    console.error("Error fetching client stats:", error);
    return null;
  }
};

const clientService = {
  fetchLastVisit,
  fetchClientStats
};

export default clientService;

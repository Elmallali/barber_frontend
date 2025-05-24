import api from "./api";

// Fetch the client's last visit information
export const fetchLastVisit = async () => {
  try {
    const { data } = await api.get("/api/client/last-visit");
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

// Fetch basic client statistics
export const fetchClientStats = async () => {
  try {
    const { data } = await api.get("/api/client/stats");
    return data;
  } catch (error) {
    console.error("Error fetching client stats:", error);
    return null;
  }
};

// Fetch detailed client statistics including chart data
export const fetchDetailedStats = async () => {
  try {
    const { data } = await api.get("/api/client/detailed-stats");
    return data;
  } catch (error) {
    console.error("Error fetching detailed statistics:", error);
    return null;
  }
};

// Fetch complete client profile data
export const fetchClientProfile = async () => {
  try {
    const { data } = await api.get("/api/client/profile");
    return data;
  } catch (error) {
    console.error("Error fetching client profile:", error);
    return null;
  }
};

// Fetch client notifications
export const fetchNotifications = async () => {
  try {
    const { data } = await api.get("/api/notifications");
    return data.notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    const { data } = await api.post(`/notifications/mark-read/${notificationId}`);
    return data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return null;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  try {
    const { data } = await api.post("/notifications/mark-all-read");
    return data;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return null;
  }
};

const clientService = {
  fetchLastVisit,
  fetchClientStats,
  fetchDetailedStats,
  fetchClientProfile,
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
};

export default clientService;

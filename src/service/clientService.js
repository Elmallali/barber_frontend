import api from "./api";

// Define all client service functions

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
    // Ensure the token is set in headers
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    // Add a timestamp parameter to prevent caching
    const timestamp = new Date().getTime();
    const { data } = await api.get(`/api/client/detailed-stats?t=${timestamp}`);
    console.log("Detailed stats response:", data);
    
    // Validate the data structure
    if (!data) {
      throw new Error('Empty response received');
    }
    
    // Ensure charts property exists
    if (!data.charts) {
      data.charts = {};
    }
    
    // Ensure required chart data exists
    if (!data.charts.monthly_data || !Array.isArray(data.charts.monthly_data) || data.charts.monthly_data.length === 0) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = new Date().getMonth();
      
      // Generate last 6 months of data
      data.charts.monthly_data = [];
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        data.charts.monthly_data.push({
          name: months[monthIndex],
          visits: 0,
          duration: 0
        });
      }
    }
    
    // Ensure service distribution exists
    if (!data.charts.service_distribution || !Array.isArray(data.charts.service_distribution) || data.charts.service_distribution.length === 0) {
      data.charts.service_distribution = [
        { name: 'Haircut', value: 0 },
        { name: 'Beard Trim', value: 0 },
        { name: 'Shave', value: 0 }
      ];
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching detailed statistics:", error.response || error);
    
    // Return fallback data if API fails
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    // Generate last 6 months of data
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      monthlyData.push({
        name: months[monthIndex],
        visits: 0,
        duration: 0
      });
    }
    
    return {
      total_visits: 0,
      favorite_barbers: 0,
      upcoming_appointments: 0,
      most_visited_salon: 'None yet',
      favorite_barber: 'None yet',
      avg_duration: '0 min',
      charts: {
        monthly_data: monthlyData,
        yearly_data: monthlyData,
        visits_by_month: monthlyData.map(item => ({ month: item.name, count: item.visits })),
        service_distribution: [
          { name: 'Haircut', value: 0 },
          { name: 'Beard Trim', value: 0 },
          { name: 'Shave', value: 0 }
        ]
      }
    };
  }
};

// Fetch complete client profile data
export const fetchClientProfile = async () => {
  try {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    // Ensure the Authorization header is set
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    const { data } = await api.get("/api/client/profile");
    console.log("Profile data response:", data);
    
    // Store user data in localStorage for persistence
    if (data && data.user) {
      if (data.user.name) localStorage.setItem('user_name', data.user.name);
      if (data.user.email) localStorage.setItem('user_email', data.user.email);
      if (data.user.id) localStorage.setItem('user_id', data.user.id.toString());
      // Store birth date and gender for persistence
      if (data.user.birth_date) localStorage.setItem('user_birth_date', data.user.birth_date);
      if (data.user.gender) localStorage.setItem('user_gender', data.user.gender);
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching client profile:", error.response || error);
    
    // Get the user data from localStorage
    const userEmail = localStorage.getItem('user_email');
    const userName = localStorage.getItem('user_name');
    const userId = localStorage.getItem('user_id');
    const userBirthDate = localStorage.getItem('user_birth_date');
    const userGender = localStorage.getItem('user_gender');
    
    // Create a fallback user object with data from localStorage
    return {
      user: {
        id: userId || 1,
        name: userName || 'User',
        email: userEmail || '',
        phone: '',
        birth_date: userBirthDate || '',
        gender: userGender || '',
        member_since: new Date().toLocaleDateString()
      },
      stats: {
        total_visits: 0,
        favorite_barbers: 0,
        upcoming_appointments: 0
      }
    };
  }
};

// Update user profile data
export const updateUserProfile = async (profileData) => {
  try {
    // Ensure the token is set in headers
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    // Use the correct API endpoint
    const { data } = await api.post("/api/client/profile/update", profileData);
    console.log("Profile update response:", data);
    
    // Store basic user info in localStorage as fallback
    if (profileData.name) localStorage.setItem('user_name', profileData.name);
    if (profileData.email) localStorage.setItem('user_email', profileData.email);
    if (profileData.birth_date) localStorage.setItem('user_birth_date', profileData.birth_date);
    if (profileData.gender) localStorage.setItem('user_gender', profileData.gender);
    return data;
  } catch (error) {
    console.error("Error updating profile:", error.response || error);
    throw error;
  }
};

// Change user password
export const changePassword = async (passwordData) => {
  try {
    // Make sure we're using the field names expected by the backend
    // Laravel's 'confirmed' validation rule expects a field named {field}_confirmation
    const formattedData = {
      current_password: passwordData.current_password,
      new_password: passwordData.password || passwordData.new_password,
      new_password_confirmation: passwordData.password_confirmation || passwordData.confirm_password
    };
    
    console.log('Sending formatted password data:', formattedData);
    
    // Updated endpoint to match the backend route structure and using PUT method
    const { data } = await api.put("/api/user/password", formattedData);
    return data;
  } catch (error) {
    console.error("Error changing password:", error.response || error);
    throw error;
  }
};

// Fetch client notifications
export const fetchNotifications = async () => {
  try {
    // Ensure the token is set in headers
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    const { data } = await api.get("/api/notifications");
    return data.notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    
    // Return empty array if API fails
    return [];
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    // Ensure the token is set in headers
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    // Fix the API path to include /api prefix
    const { data } = await api.post(`/api/notifications/mark-read/${notificationId}`);
    return data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return null;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  try {
    // Ensure the token is set in headers
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    // Fix the API path to include /api prefix
    const { data } = await api.post("/api/notifications/mark-all-read");
    return data;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return null;
  }
};

// Get all clients for queue management
export const getAllClients = async (salonId, status = 'ALL') => {
  try {
    const response = await api.get('/api/queue/entries', {
      params: { salon_id: salonId, status: status === 'ALL' ? null : status }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
};

// Export all functions in a single clientService object
const clientService = {
  fetchLastVisit,
  fetchClientStats,
  fetchDetailedStats,
  fetchClientProfile,
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getAllClients
};

export default clientService;

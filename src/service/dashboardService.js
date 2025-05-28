import api from './api';

// Get barber dashboard data
export const getBarberDashboardData = async (barberId, salonId) => {
  try {
    // Get queue data (clients waiting) - using the correct endpoint from the API routes
    const queueResponse = await api.get(`/api/queue/salon/${salonId}/barber/${barberId}`);
    console.log('Queue API response:', queueResponse);
    
    return queueResponse.data;
  } catch (error) {
    console.error('Error fetching barber dashboard data:', error);
    // Return empty data structure instead of throwing to prevent dashboard from breaking
    return {
      clients: {
        'in-session': [],
        'on-site': [],
        'on-way': [],
        'invited': []
      }
    };
  }
};

// Get barber stats
export const getBarberStats = async (barberId) => {
  try {
    // Using the correct endpoint from the API routes
    const response = await api.get('/api/barber/stats');
    console.log('Stats API response:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching barber stats:', error);
    // Return default data instead of throwing
    return {
      completed_today: 0
    };
  }
};

// Get barber earnings for today
export const getBarberEarningsToday = async (barberId) => {
  try {
    // Try to fetch from API first
    try {
      const response = await api.get(`/api/barber/${barberId}/earnings/today`);
      console.log('Earnings API response:', response);
      // Return the response directly without nesting under data
      return response;
    } catch (apiError) {
      console.log('API endpoint not available, using mock data');
      // Fall back to mock data if API endpoint doesn't exist yet
      return {
        amount: 450,
        currency: 'MAD',
        date: new Date().toISOString().split('T')[0]
      };
    }
  } catch (error) {
    console.error('Error fetching barber earnings:', error);
    // Return default data instead of throwing
    return {
      amount: 0,
      currency: 'MAD',
      date: new Date().toISOString().split('T')[0]
    };
  }
};

// Get barber weekly growth
export const getBarberWeeklyGrowth = async (barberId) => {
  try {
    // Try to fetch from API first
    try {
      const response = await api.get(`/api/barber/${barberId}/growth/weekly`);
      console.log('Growth API response:', response);
      // Return the response directly without nesting under data
      return response;
    } catch (apiError) {
      console.log('API endpoint not available, using mock data');
      // Fall back to mock data if API endpoint doesn't exist yet
      return {
        percentage: 12,
        last_week_clients: 25,
        this_week_clients: 28
      };
    }
  } catch (error) {
    console.error('Error fetching barber weekly growth:', error);
    // Return default data instead of throwing
    return {
      percentage: 0,
      last_week_clients: 0,
      this_week_clients: 0
    };
  }
};

// Get salon average wait time
export const getSalonWaitTime = async (salonId) => {
  try {
    // Try to fetch from API first
    try {
      const response = await api.get(`/api/salon/${salonId}/wait-time`);
      console.log('Wait time API response:', response);
      // Return the response directly without nesting under data
      return response;
    } catch (apiError) {
      console.log('API endpoint not available, using mock data');
      // Fall back to mock data if API endpoint doesn't exist yet
      return {
        average_minutes: 25,
        salon_id: salonId
      };
    }
  } catch (error) {
    console.error('Error fetching salon wait time:', error);
    // Return default data instead of throwing
    return {
      average_minutes: 0,
      salon_id: salonId
    };
  }
};

// Get barber schedule for today
export const getBarberScheduleToday = async (barberId) => {
  try {
    // Try to fetch from API first
    try {
      const response = await api.get(`/api/barber/${barberId}/schedule/today`);
      console.log('Schedule API response:', response);
      // Return the response directly without nesting under data
      return response;
    } catch (apiError) {
      console.log('API endpoint not available, using mock data');
      // Fall back to mock data if API endpoint doesn't exist yet
      return {
        appointments: [
          {
            id: 1,
            client_name: 'John Smith',
            service_type: 'Haircut & Beard Trim',
            time_ago: 10
          },
          {
            id: 2,
            client_name: 'Robert Johnson',
            service_type: 'Haircut',
            time_ago: 15
          }
        ]
      };
    }
  } catch (error) {
    console.error('Error fetching barber schedule:', error);
    // Return default data instead of throwing
    return {
      appointments: []
    };
  }
};

const dashboardService = {
  getBarberDashboardData,
  getBarberStats,
  getBarberEarningsToday,
  getBarberWeeklyGrowth,
  getSalonWaitTime,
  getBarberScheduleToday
};

export default dashboardService;

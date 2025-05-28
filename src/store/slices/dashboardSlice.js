import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getBarberDashboardData,
  getBarberStats,
  getBarberEarningsToday,
  getBarberWeeklyGrowth,
  getSalonWaitTime,
  getBarberScheduleToday
} from '../../service/dashboardService';

// Fetch dashboard data for a barber
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async ({ barberId, salonId }, { rejectWithValue }) => {
    try {
      // Get queue data (clients waiting)
      const queueResponse = await getBarberDashboardData(barberId, salonId);
      
      // Get stats data (completed clients today)
      const statsResponse = await getBarberStats(barberId);
      
      // Get earnings data
      const earningsResponse = await getBarberEarningsToday(barberId);
      
      // Get weekly growth data
      const weeklyGrowthResponse = await getBarberWeeklyGrowth(barberId);
      
      // Get wait time data
      const waitTimeResponse = await getSalonWaitTime(salonId);
      
      // Get today's schedule
      const scheduleResponse = await getBarberScheduleToday(barberId);
      
      return {
        queueData: queueResponse,
        statsData: statsResponse,
        earningsData: earningsResponse.data,
        growthData: weeklyGrowthResponse.data,
        waitTimeData: waitTimeResponse.data,
        scheduleData: scheduleResponse.data
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard data');
    }
  }
);

// Calculate clients waiting based on queue data
const calculateClientsWaiting = (queueData) => {
  if (!queueData || !queueData.clients) return 0;
  
  // Count clients in each status category
  const onSiteCount = queueData.clients['on-site']?.length || 0;
  const onWayCount = queueData.clients['on-way']?.length || 0;
  const invitedCount = queueData.clients['invited']?.length || 0;
  
  console.log('Queue data:', {
    onSite: onSiteCount,
    onWay: onWayCount,
    invited: invitedCount,
    total: onSiteCount + onWayCount + invitedCount
  });
  
  return onSiteCount + onWayCount + invitedCount;
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    // Queue data
    clientsWaiting: 0,
    queueDetails: {
      onSite: [],
      onWay: [],
      invited: []
    },
    
    // Stats data
    clientsServedToday: 0,
    
    // Earnings data
    todaysEarnings: 0,
    currency: 'MAD',
    
    // Growth data
    weeklyGrowth: 0,
    lastWeekClients: 0,
    
    // Wait time data
    averageWaitTime: 0,
    
    // Schedule data
    todaysSchedule: [],
    
    // Loading states
    loading: false,
    error: null
  },
  reducers: {
    clearDashboardData: (state) => {
      state.clientsWaiting = 0;
      state.queueDetails = {
        onSite: [],
        onWay: [],
        invited: []
      };
      state.clientsServedToday = 0;
      state.todaysEarnings = 0;
      state.weeklyGrowth = 0;
      state.lastWeekClients = 0;
      state.averageWaitTime = 0;
      state.todaysSchedule = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        
        console.log('Dashboard data received:', action.payload);
        
        // Process queue data
        const queueData = action.payload.queueData;
        state.clientsWaiting = calculateClientsWaiting(queueData);
        if (queueData && queueData.clients) {
          state.queueDetails.onSite = queueData.clients['on-site'] || [];
          state.queueDetails.onWay = queueData.clients['on-way'] || [];
          state.queueDetails.invited = queueData.clients['invited'] || [];
        }
        
        // Process stats data
        const statsData = action.payload.statsData;
        state.clientsServedToday = statsData?.completed_today || 0;
        
        // Process earnings data - handle both nested and direct response formats
        const earningsData = action.payload.earningsData?.data || action.payload.earningsData || {};
        state.todaysEarnings = earningsData?.amount || 0;
        state.currency = earningsData?.currency || 'MAD';
        
        // Process growth data - handle both nested and direct response formats
        const growthData = action.payload.growthData?.data || action.payload.growthData || {};
        state.weeklyGrowth = growthData?.percentage || 0;
        state.lastWeekClients = growthData?.last_week_clients || 0;
        
        // Process wait time data - handle both nested and direct response formats
        const waitTimeData = action.payload.waitTimeData?.data || action.payload.waitTimeData || {};
        state.averageWaitTime = waitTimeData?.average_minutes || 0;
        
        // Process schedule data - handle both nested and direct response formats
        const scheduleData = action.payload.scheduleData?.data || action.payload.scheduleData || {};
        state.todaysSchedule = scheduleData?.appointments || [];
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearDashboardData } = dashboardSlice.actions;

// Selectors
export const selectClientsWaiting = (state) => state.dashboard.clientsWaiting;
export const selectQueueDetails = (state) => state.dashboard.queueDetails;
export const selectClientsServedToday = (state) => state.dashboard.clientsServedToday;
export const selectTodaysEarnings = (state) => state.dashboard.todaysEarnings;
export const selectCurrency = (state) => state.dashboard.currency;
export const selectWeeklyGrowth = (state) => state.dashboard.weeklyGrowth;
export const selectLastWeekClients = (state) => state.dashboard.lastWeekClients;
export const selectAverageWaitTime = (state) => state.dashboard.averageWaitTime;
export const selectTodaysSchedule = (state) => state.dashboard.todaysSchedule;
export const selectDashboardLoading = (state) => state.dashboard.loading;
export const selectDashboardError = (state) => state.dashboard.error;

export default dashboardSlice.reducer;

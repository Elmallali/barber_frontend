import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  fetchActiveQueue, 
  fetchBarberQueue,
  markClientArrived, 
  startClientSession, 
  finishClientSession, 
  cancelClientEntry,
  resetSessionTimer,
  toggleSessionPause
} from "../../service/queueService";

// Async thunk for resetting session timer
export const resetSessionAsync = createAsyncThunk(
  'queue/resetSession',
  async (entryId, { dispatch, rejectWithValue }) => {
    try {
      // First, update the UI optimistically
      dispatch(resetSession());
      
      // Then make the API call to persist the change
      const response = await resetSessionTimer(entryId);
      
      // After successful API call, fetch the updated queue data
      dispatch(fetchActiveQueueAsync(1)); // Replace 1 with dynamic salonId when available
      
      return response;
    } catch (error) {
      console.error('Error resetting session timer:', error);
      
      // Return detailed error info
      const errorMessage = error.response?.data?.message || error.message || 'Failed to reset session timer';
      return rejectWithValue({
        message: errorMessage,
        originalError: error,
        action: 'resetSession',
        entryId
      });
    }
  }
);

// Async thunk for toggling session pause state
export const togglePauseAsync = createAsyncThunk(
  'queue/togglePause',
  async ({ entryId, isPaused }, { dispatch, rejectWithValue }) => {
    try {
      // First, update the UI optimistically
      if (isPaused) {
        dispatch(pauseSession());
      } else {
        dispatch(resumeSession());
      }
      
      // Then make the API call to persist the change
      const response = await toggleSessionPause(entryId, isPaused);
      
      // After successful API call, fetch the updated queue data
      dispatch(fetchActiveQueueAsync(1)); // Replace 1 with dynamic salonId when available
      
      return { isPaused, response };
    } catch (error) {
      console.error('Error toggling session pause state:', error);
      
      // Roll back the optimistic update
      if (isPaused) {
        dispatch(resumeSession());
      } else {
        dispatch(pauseSession());
      }
      
      // Return detailed error info
      const errorMessage = error.response?.data?.message || error.message || 'Failed to toggle session pause state';
      return rejectWithValue({
        message: errorMessage,
        originalError: error,
        action: 'togglePause',
        entryId,
        isPaused
      });
    }
  }
);



// Async thunk for fetching active queue
export const fetchActiveQueueAsync = createAsyncThunk(
  'queue/fetchActiveQueue',
  async (salonId, { rejectWithValue }) => {
    try {
      const data = await fetchActiveQueue(salonId);
      console.log(data);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch active queue');
    }
  }
);

// Async thunk for fetching barber-specific queue
export const fetchBarberQueueAsync = createAsyncThunk(
  'queue/fetchBarberQueue',
  async ({ salonId, barberId }, { rejectWithValue }) => {
    try {
      const data = await fetchBarberQueue(salonId, barberId);
      console.log('Barber queue data:', data);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch barber queue');
    }
  }
);

// Async thunk for marking a client as arrived
export const markArrivedAsync = createAsyncThunk(
  'queue/markArrived',
  async ({ clientId, entryId }, { dispatch, rejectWithValue }) => {
    try {
      // First, update the UI optimistically
      dispatch(optimisticMarkArrived({ clientId }));
      
      // Then make the API call
      const response = await markClientArrived(entryId);
      
      // After successful API call, fetch the updated queue data
      dispatch(fetchActiveQueueAsync(1)); // Replace 1 with dynamic salonId when available
      return { clientId, response: response };
    } catch (error) {
      console.error('Error marking client as arrived:', error);
      
      // Roll back the optimistic update
      dispatch(rollbackOptimisticUpdate());
      
      // Return detailed error info
      const errorMessage = error.response?.data?.message || error.message || 'Failed to mark client as arrived';
      return rejectWithValue({
        message: errorMessage,
        originalError: error,
        action: 'markArrived',
        clientId,
        entryId
      });
    }
  }
);

// Async thunk for starting a session
export const startSessionAsync = createAsyncThunk(
  'queue/startSession',
  async ({ section, clientId, entryId, barberId }, { dispatch, rejectWithValue }) => {
    try {
      // First, update the UI optimistically
      dispatch(optimisticStartSession({ section, clientId }));
      
      // Then make the API call
      const response = await startClientSession(entryId, barberId);
      
      // After successful API call, fetch the updated queue data
      dispatch(fetchActiveQueueAsync(1));
      
      return { section, clientId, response: response };
    } catch (error) {
      console.error('Error starting session:', error);
      
      // Roll back the optimistic update
      dispatch(rollbackOptimisticUpdate());
      
      // Return detailed error info
      const errorMessage = error.response?.data?.message || error.message || 'Failed to start session';
      return rejectWithValue({
        message: errorMessage,
        originalError: error,
        action: 'startSession',
        section,
        clientId,
        entryId
      });
    }
  }
);

// Async thunk for ending a session
export const endSessionAsync = createAsyncThunk(
  'queue/endSession',
  async ({ clientId, entryId, servicePrice = 0 }, { dispatch, rejectWithValue }) => {
    try {
      // First, update the UI optimistically
      dispatch(optimisticEndSession({ clientId }));
      
      // Then make the API call
      const response = await finishClientSession(entryId, servicePrice);
      
      // After successful API call, fetch the updated queue data
      dispatch(fetchActiveQueueAsync(1)); // Replace 1 with dynamic salonId when available
      return { clientId, response: response };
    } catch (error) {
      console.error('Error ending session:', error);
      
      // Roll back the optimistic update
      dispatch(rollbackOptimisticUpdate());
      
      // Return detailed error info
      const errorMessage = error.response?.data?.message || error.message || 'Failed to end session';
      return rejectWithValue({
        message: errorMessage,
        originalError: error,
        action: 'endSession',
        clientId,
        entryId
      });
    }
  }
);

// Async thunk for canceling a client
export const cancelClientAsync = createAsyncThunk(
  'queue/cancelClient',
  async ({ section, clientId, entryId }, { dispatch, rejectWithValue }) => {
    try {
      // First, update the UI optimistically
      dispatch(optimisticCancelClient({ section, clientId }));
      
      // Then make the API call
      const response = await cancelClientEntry(entryId);
      
      // After successful API call, fetch the updated queue data
      dispatch(fetchActiveQueueAsync(1)); // Replace 1 with dynamic salonId when available
      return { section, clientId, response: response };
    } catch (error) {
      console.error('Error canceling client:', error);
      
      // Roll back the optimistic update
      dispatch(rollbackOptimisticUpdate());
      
      // Return detailed error info
      const errorMessage = error.response?.data?.message || error.message || 'Failed to cancel client';
      return rejectWithValue({
        message: errorMessage,
        originalError: error,
        action: 'cancelClient',
        section,
        clientId,
        entryId
      });
    }
  }
);

const initialState = {
  // Action loading and error states
  actionLoading: {
    markArrived: false,
    startSession: false,
    endSession: false,
    cancelClient: false,
    resetSession: false,
    togglePause: false
  },
  actionErrors: {
    markArrived: null,
    startSession: null,
    endSession: null,
    cancelClient: null,
    resetSession: null,
    togglePause: null
  },
  clients: {
    "in-session": [],
    "on-site": [
      {
        id: 1,
        name: "James Wilson",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        service: "Haircut & Beard Trim",
        waitingSince: "10:30 AM",
        trusted: true,
        regular: true,
        notes: "Prefers scissors over clippers",
      },
      {
        id: 2,
        name: "Michael Brown",
        avatar: "https://randomuser.me/api/portraits/men/22.jpg",
        service: "Haircut",
        waitingSince: "10:45 AM",
        trusted: true,
        regular: false,
        notes: "First time client",
      },
    ],
    "on-way": [
      {
        id: 3,
        name: "Robert Davis",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        service: "Beard Trim",
        arrivalTime: "11:15 AM",
        trusted: false,
        regular: true,
        notes: "Running 5 minutes late",
      },
    ],
    invited: [
      {
        id: 4,
        name: "William Taylor",
        avatar: "https://randomuser.me/api/portraits/men/55.jpg",
        service: "Haircut & Styling",
        invitedAt: "10:00 AM",
        trusted: false,
        regular: false,
        notes: "New client referral",
      },
      {
        id: 5,
        name: "Daniel Moore",
        avatar: "https://randomuser.me/api/portraits/men/42.jpg",
        service: "Haircut & Beard Trim",
        invitedAt: "10:15 AM",
        trusted: true,
        regular: true,
        notes: "Monthly appointment",
      },
    ],
  },
  sessionStartTime: null,
  isSessionActive: false,
  sessionPaused: false,
  lastEndedClient: null,
  
  '3d': null,
  // New state properties for active queue
  activeQueue: null,
  loading: false,
  error: null,
  // Action-specific loading states
  actionLoading: {
    markArrived: false,
    startSession: false,
    endSession: false,
    cancelClient: false
  },
  actionErrors: {
    markArrived: null,
    startSession: null,
    endSession: null,
    cancelClient: null
  },
};

const queueSlice = createSlice({
  name: "queue",
  initialState,
  reducers: {
    // Optimistic UI update actions
    optimisticMarkArrived(state, action) {
      const { clientId } = action.payload;
      // Store the client for potential rollback
      const client = state.clients["on-way"].find(c => c.id === clientId);
      if (!client) return;
      
      // Save for rollback if needed
      state._rollbackData = {
        action: 'markArrived',
        client: { ...client },
        sourceSection: 'on-way'
      };
      
      // Update the UI optimistically
      state.clients["on-way"] = state.clients["on-way"].filter(c => c.id !== clientId);
      state.clients["on-site"].push({
        ...client,
        waitingSince: new Date().toLocaleTimeString()
      });
    },
    
    optimisticStartSession(state, action) {
      const { section, clientId } = action.payload;
      // Store the client for potential rollback
      const client = state.clients[section].find(c => c.id === clientId);
      if (!client) return;
      
      // التحقق من عدم وجود عملاء آخرين في حالة in-session
      if (state.clients["in-session"].length > 0) {
        // إذا كان هناك عميل في الخدمة بالفعل، نضيف رسالة خطأ ونتوقف
        state.actionErrors.startSession = {
          message: 'لا يمكن بدء الخدمة: هناك عميل آخر في الخدمة بالفعل'
        };
        return;
      }
      
      // Save for rollback if needed
      state._rollbackData = {
        action: 'startSession',
        client: { ...client },
        sourceSection: section
      };
      
      // Update the UI optimistically
      state.clients[section] = state.clients[section].filter(c => c.id !== clientId);
      const now = new Date();
      state.clients["in-session"].push({
        ...client,
        sessionStartTime: now.toISOString(), // Store as ISO string instead of Date object
        startTime: now.toLocaleTimeString()
      });
      state.sessionStartTime = now.toISOString(); // Store as ISO string
      state.isSessionActive = true;
      state.sessionPaused = false;
    },
    
    optimisticEndSession(state, action) {
      const { clientId } = action.payload;
      // Store the client for potential rollback
      const client = state.clients["in-session"].find(c => c.id === clientId);
      if (!client) return;
      
      // Save for rollback if needed
      state._rollbackData = {
        action: 'endSession',
        client: { ...client },
        sourceSection: 'in-session'
      };
      
      // Update the UI optimistically
      const end = new Date();
      const diffMs = end - new Date(client.sessionStartTime);
      const minutes = Math.floor(diffMs / 60000);
      const seconds = Math.floor((diffMs % 60000) / 1000);
      
      state.lastEndedClient = {
        name: client.name,
        duration: `${minutes}m ${seconds}s`,
      };
      
      state.clients["in-session"] = state.clients["in-session"].filter(c => c.id !== clientId);
      state.sessionStartTime = null;
      state.isSessionActive = false;
      state.sessionPaused = false;
    },
    
    optimisticCancelClient(state, action) {
      const { section, clientId } = action.payload;
      // Store the client for potential rollback
      const client = state.clients[section].find(c => c.id === clientId);
      if (!client) return;
      
      // Save for rollback if needed
      state._rollbackData = {
        action: 'cancelClient',
        client: { ...client },
        sourceSection: section
      };
      
      // Update the UI optimistically
      if (section === "in-session") {
        state.sessionStartTime = null;
        state.isSessionActive = false;
        state.sessionPaused = false;
      }
      
      state.clients[section] = state.clients[section].filter(c => c.id !== clientId);
    },
    
    // Rollback action in case the API call fails
    rollbackOptimisticUpdate(state) {
      // If we have rollback data, restore the state
      if (!state._rollbackData) return;
      
      const { action, client, sourceSection } = state._rollbackData;
      
      if (action === 'markArrived') {
        // Remove from on-site if it was added there
        state.clients["on-site"] = state.clients["on-site"].filter(c => c.id !== client.id);
        // Add back to on-way
        state.clients["on-way"].push(client);
      } 
      else if (action === 'startSession') {
        // Remove from in-session if it was added there
        state.clients["in-session"] = state.clients["in-session"].filter(c => c.id !== client.id);
        // Add back to original section
        state.clients[sourceSection].push(client);
        // Reset session state if needed
        if (state.clients["in-session"].length === 0) {
          state.isSessionActive = false;
          state.sessionStartTime = null;
        }
      }
      else if (action === 'endSession') {
        // Add back to in-session
        state.clients["in-session"].push(client);
        state.isSessionActive = true;
        state.sessionStartTime = client.sessionStartTime; // Already an ISO string
        // Clear last ended if it was this client
        if (state.lastEndedClient && state.lastEndedClient.name === client.name) {
          state.lastEndedClient = null;
        }
      }
      else if (action === 'cancelClient') {
        // Add back to original section
        state.clients[sourceSection].push(client);
        // Restore session state if needed
        if (sourceSection === "in-session") {
          state.isSessionActive = true;
          state.sessionStartTime = client.sessionStartTime; // Already an ISO string
        }
      }
      
      // Clear rollback data
      state._rollbackData = null;
    },
    // Local startSession action is replaced by the async thunk
    // We'll keep it for backwards compatibility but it's deprecated
    startSession(state, action) {
      console.warn('Using deprecated local startSession action. Use startSessionAsync instead.');
      // No local state changes - all handled by the backend and fetchActiveQueueAsync
    },
    // Local endSession action is replaced by the async thunk
    // We'll keep it for backwards compatibility but it's deprecated
    endSession(state, action) {
      console.warn('Using deprecated local endSession action. Use endSessionAsync instead.');
      // No local state changes - all handled by the backend and fetchActiveQueueAsync
    },
    // Local cancelClient action is replaced by the async thunk
    // We'll keep it for backwards compatibility but it's deprecated
    cancelClient(state, action) {
      console.warn('Using deprecated local cancelClient action. Use cancelClientAsync instead.');
      // No local state changes - all handled by the backend and fetchActiveQueueAsync
    },
    // Local markArrived action is replaced by the async thunk
    // We'll keep it for backwards compatibility but it's deprecated
    markArrived(state, action) {
      console.warn('Using deprecated local markArrived action. Use markArrivedAsync instead.');
      // No local state changes - all handled by the backend and fetchActiveQueueAsync
    },
    pauseSession(state) {
      state.sessionPaused = true;
    },
    resumeSession(state) {
      state.sessionPaused = false;
    },
    resetSession(state) {
      const now = new Date();
      state.sessionStartTime = now.toISOString(); // Store as ISO string
      state.sessionPaused = false;
      
      // Update the sessionStartTime for all clients in the in-session section
      if (state.clients["in-session"].length > 0) {
        state.clients["in-session"] = state.clients["in-session"].map(client => ({
          ...client,
          sessionStartTime: now.toISOString(),
          startTime: now.toLocaleTimeString()
        }));
      }
    },
    clearLastEnded(state) {
      state.lastEndedClient = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle the pending state when fetching active queue
      .addCase(fetchActiveQueueAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle the fulfilled state when active queue is successfully fetched
      .addCase(fetchActiveQueueAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.activeQueue = action.payload;
        
        // Update the clients lists with data from the API
        if (action.payload && action.payload.clients) {
          state.clients = action.payload.clients;
        }
      })
      // Handle the rejected state when fetching active queue fails
      .addCase(fetchActiveQueueAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch active queue';
      })
      
      // Handle the barber queue fetch states
      .addCase(fetchBarberQueueAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBarberQueueAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.activeQueue = action.payload;
        
        // Update the clients lists with data from the API
        if (action.payload && action.payload.clients) {
          state.clients = action.payload.clients;
        }
      })
      .addCase(fetchBarberQueueAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch barber queue';
      })
      
      // Reset session async actions
      .addCase(resetSessionAsync.pending, (state) => {
        state.actionLoading.resetSession = true;
        state.actionErrors.resetSession = null;
      })
      .addCase(resetSessionAsync.fulfilled, (state, action) => {
        state.actionLoading.resetSession = false;
        // The optimistic update already occurred, no need to update state here
      })
      .addCase(resetSessionAsync.rejected, (state, action) => {
        state.actionLoading.resetSession = false;
        state.actionErrors.resetSession = action.payload || 'Failed to reset session timer';
      })
      
      // Toggle pause async actions
      .addCase(togglePauseAsync.pending, (state) => {
        state.actionLoading.togglePause = true;
        state.actionErrors.togglePause = null;
      })
      .addCase(togglePauseAsync.fulfilled, (state, action) => {
        state.actionLoading.togglePause = false;
        // The optimistic update already occurred via pauseSession/resumeSession
      })
      .addCase(togglePauseAsync.rejected, (state, action) => {
        state.actionLoading.togglePause = false;
        state.actionErrors.togglePause = action.payload || 'Failed to toggle pause state';
      })
      
      // markArrived action states
      .addCase(markArrivedAsync.pending, (state) => {
        state.actionLoading.markArrived = true;
        state.actionErrors.markArrived = null;
      })
      .addCase(markArrivedAsync.fulfilled, (state) => {
        state.actionLoading.markArrived = false;
      })
      .addCase(markArrivedAsync.rejected, (state, action) => {
        state.actionLoading.markArrived = false;
        state.actionErrors.markArrived = action.payload || 'Failed to mark client as arrived';
      })
      
      // startSession action states
      .addCase(startSessionAsync.pending, (state) => {
        state.actionLoading.startSession = true;
        state.actionErrors.startSession = null;
      })
      .addCase(startSessionAsync.fulfilled, (state) => {
        state.actionLoading.startSession = false;
      })
      .addCase(startSessionAsync.rejected, (state, action) => {
        state.actionLoading.startSession = false;
        state.actionErrors.startSession = action.payload || 'Failed to start session';
      })
      
      // endSession action states
      .addCase(endSessionAsync.pending, (state) => {
        state.actionLoading.endSession = true;
        state.actionErrors.endSession = null;
      })
      .addCase(endSessionAsync.fulfilled, (state) => {
        state.actionLoading.endSession = false;
      })
      .addCase(endSessionAsync.rejected, (state, action) => {
        state.actionLoading.endSession = false;
        state.actionErrors.endSession = action.payload || 'Failed to end session';
      })
      
      // cancelClient action states
      .addCase(cancelClientAsync.pending, (state) => {
        state.actionLoading.cancelClient = true;
        state.actionErrors.cancelClient = null;
      })
      .addCase(cancelClientAsync.fulfilled, (state) => {
        state.actionLoading.cancelClient = false;
      })
      .addCase(cancelClientAsync.rejected, (state, action) => {
        state.actionLoading.cancelClient = false;
        // Extract just the error message string to avoid rendering objects in the UI
        state.actionErrors.cancelClient = action.payload?.message || 
                                         (typeof action.payload === 'string' ? action.payload : 'Failed to cancel client');
      });
  },
});

export const {
  // Optimistic update actions
  optimisticMarkArrived,
  optimisticStartSession,
  optimisticEndSession,
  optimisticCancelClient,
  rollbackOptimisticUpdate,
  
  // Legacy actions
  startSession,
  endSession,
  cancelClient,
  markArrived,
  pauseSession,
  resumeSession,
  resetSession,
  clearLastEnded,
} = queueSlice.actions;

// We've already exported the async thunks at the top of the file
// fetchActiveQueueAsync, markArrivedAsync, startSessionAsync, endSessionAsync, cancelClientAsync, resetSessionAsync, togglePauseAsync

export default queueSlice.reducer;

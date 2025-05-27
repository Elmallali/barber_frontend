import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  fetchActiveQueue, 
  fetchBarberQueue,
  markClientArrived, 
  startClientSession, 
  finishClientSession, 
  cancelClientEntry 
} from "../../service/queueService";


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


export const markArrivedAsync = createAsyncThunk(
  'queue/markArrived',
  async ({ clientId, entryId }, { dispatch, rejectWithValue }) => {
    try {
      
      dispatch(optimisticMarkArrived({ clientId }));
      
      
      const response = await markClientArrived(entryId);
      
      
      dispatch(fetchActiveQueueAsync(1)); 
      return { clientId, response: response };
    } catch (error) {
      console.error('Error marking client as arrived:', error);
      
      
      dispatch(rollbackOptimisticUpdate());
      
      
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


export const startSessionAsync = createAsyncThunk(
  'queue/startSession',
  async ({ section, clientId, entryId, barberId }, { dispatch, rejectWithValue }) => {
    try {
      
      dispatch(optimisticStartSession({ section, clientId }));
      
      
      const response = await startClientSession(entryId, barberId);
      
      
      dispatch(fetchActiveQueueAsync(1));
      
      return { section, clientId, response: response };
    } catch (error) {
      console.error('Error starting session:', error);
      
      
      dispatch(rollbackOptimisticUpdate());
      
      
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


export const endSessionAsync = createAsyncThunk(
  'queue/endSession',
  async ({ clientId, entryId, servicePrice = 0 }, { dispatch, rejectWithValue }) => {
    try {
      
      dispatch(optimisticEndSession({ clientId }));
      
      
      const response = await finishClientSession(entryId, servicePrice);
      
      
      dispatch(fetchActiveQueueAsync(1)); 
      return { clientId, response: response };
    } catch (error) {
      console.error('Error ending session:', error);
      
      
      dispatch(rollbackOptimisticUpdate());
      
      
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


export const cancelClientAsync = createAsyncThunk(
  'queue/cancelClient',
  async ({ section, clientId, entryId }, { dispatch, rejectWithValue }) => {
    try {
      
      dispatch(optimisticCancelClient({ section, clientId }));
      
      
      const response = await cancelClientEntry(entryId);
      
      
      dispatch(fetchActiveQueueAsync(1)); 
      return { section, clientId, response: response };
    } catch (error) {
      console.error('Error canceling client:', error);
      
      
      dispatch(rollbackOptimisticUpdate());
      
      
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
  clients: {
    "in-session": [],
    "on-site": [
    
    ],
    "on-way": [
      
    ],
    invited: [
      
    ],
  },
  sessionStartTime: null,
  isSessionActive: false,
  sessionPaused: false,
  lastEndedClient: null,
  
  activeQueue: null,
  loading: false,
  error: null,
  
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
    
    optimisticMarkArrived(state, action) {
      const { clientId } = action.payload;
      
      const client = state.clients["on-way"].find(c => c.id === clientId);
      if (!client) return;
      
      
      state._rollbackData = {
        action: 'markArrived',
        client: { ...client },
        sourceSection: 'on-way'
      };
      
      
      state.clients["on-way"] = state.clients["on-way"].filter(c => c.id !== clientId);
      state.clients["on-site"].push({
        ...client,
        waitingSince: new Date().toLocaleTimeString()
      });
    },
    
    optimisticStartSession(state, action) {
      const { section, clientId } = action.payload;
      
      const client = state.clients[section].find(c => c.id === clientId);
      if (!client) return;
      
      
      if (state.clients["in-session"].length > 0) {
        
        state.actionErrors.startSession = {
          message: 'لا يمكن بدء الخدمة: هناك عميل آخر في الخدمة بالفعل'
        };
        return;
      }
      
      
      state._rollbackData = {
        action: 'startSession',
        client: { ...client },
        sourceSection: section
      };
      
      
      state.clients[section] = state.clients[section].filter(c => c.id !== clientId);
      const now = new Date();
      state.clients["in-session"].push({
        ...client,
        sessionStartTime: now.toISOString(), 
        startTime: now.toLocaleTimeString()
      });
      state.sessionStartTime = now.toISOString(); 
      state.isSessionActive = true;
      state.sessionPaused = false;
    },
    
    optimisticEndSession(state, action) {
      const { clientId } = action.payload;
      
      const client = state.clients["in-session"].find(c => c.id === clientId);
      if (!client) return;
      
      
      state._rollbackData = {
        action: 'endSession',
        client: { ...client },
        sourceSection: 'in-session'
      };
      
      
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
      
      const client = state.clients[section].find(c => c.id === clientId);
      if (!client) return;
      
      
      state._rollbackData = {
        action: 'cancelClient',
        client: { ...client },
        sourceSection: section
      };
      
      
      if (section === "in-session") {
        state.sessionStartTime = null;
        state.isSessionActive = false;
        state.sessionPaused = false;
      }
      
      state.clients[section] = state.clients[section].filter(c => c.id !== clientId);
    },
    
    
    rollbackOptimisticUpdate(state) {
      
      if (!state._rollbackData) return;
      
      const { action, client, sourceSection } = state._rollbackData;
      
      if (action === 'markArrived') {
        
        state.clients["on-site"] = state.clients["on-site"].filter(c => c.id !== client.id);
        
        state.clients["on-way"].push(client);
      } 
      else if (action === 'startSession') {
        
        state.clients["in-session"] = state.clients["in-session"].filter(c => c.id !== client.id);
        
        state.clients[sourceSection].push(client);
        
        if (state.clients["in-session"].length === 0) {
          state.isSessionActive = false;
          state.sessionStartTime = null;
        }
      }
      else if (action === 'endSession') {
        
        state.clients["in-session"].push(client);
        state.isSessionActive = true;
        state.sessionStartTime = client.sessionStartTime; 
        
        if (state.lastEndedClient && state.lastEndedClient.name === client.name) {
          state.lastEndedClient = null;
        }
      }
      else if (action === 'cancelClient') {
        
        state.clients[sourceSection].push(client);
        
        if (sourceSection === "in-session") {
          state.isSessionActive = true;
          state.sessionStartTime = client.sessionStartTime; 
        }
      }
      
      
      state._rollbackData = null;
    },
    
    
    startSession(state, action) {
      console.warn('Using deprecated local startSession action. Use startSessionAsync instead.');
      
    },
    
    
    endSession(state, action) {
      console.warn('Using deprecated local endSession action. Use endSessionAsync instead.');
      
    },
    
    
    cancelClient(state, action) {
      console.warn('Using deprecated local cancelClient action. Use cancelClientAsync instead.');
      
    },
    
    
    markArrived(state, action) {
      console.warn('Using deprecated local markArrived action. Use markArrivedAsync instead.');
      
    },
    pauseSession(state) {
      state.sessionPaused = true;
    },
    resumeSession(state) {
      state.sessionPaused = false;
    },
    resetSession(state) {
      const now = new Date();
      state.sessionStartTime = now.toISOString(); 
      state.sessionPaused = false;
      
      
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
      
      .addCase(fetchActiveQueueAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      
      .addCase(fetchActiveQueueAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.activeQueue = action.payload;
        
        
        if (action.payload && action.payload.clients) {
          state.clients = action.payload.clients;
        }
      })
      
      .addCase(fetchActiveQueueAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch active queue';
      })
      
      
      .addCase(fetchBarberQueueAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBarberQueueAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.activeQueue = action.payload;
        
        
        if (action.payload && action.payload.clients) {
          state.clients = action.payload.clients;
        }
      })
      .addCase(fetchBarberQueueAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch barber queue';
      })
      
      
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
      
      
      .addCase(cancelClientAsync.pending, (state) => {
        state.actionLoading.cancelClient = true;
        state.actionErrors.cancelClient = null;
      })
      .addCase(cancelClientAsync.fulfilled, (state) => {
        state.actionLoading.cancelClient = false;
      })
      .addCase(cancelClientAsync.rejected, (state, action) => {
        state.actionLoading.cancelClient = false;
        state.actionErrors.cancelClient = action.payload || 'Failed to cancel client';
      });
  },
});

export const {
  
  optimisticMarkArrived,
  optimisticStartSession,
  optimisticEndSession,
  optimisticCancelClient,
  rollbackOptimisticUpdate,
  startSession,
  endSession,
  cancelClient,
  markArrived,
  pauseSession,
  resumeSession,
  resetSession,
  clearLastEnded,
} = queueSlice.actions;

export default queueSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchActiveQueue } from "../../service/queueService";

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

const initialState = {
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
  // New state properties for active queue
  activeQueue: null,
  loading: false,
  error: null,
};

const queueSlice = createSlice({
  name: "queue",
  initialState,
  reducers: {
    startSession(state, action) {
      const { section, clientId } = action.payload;
      if (state.isSessionActive) return;
      const client = state.clients[section].find((c) => c.id === clientId);
      if (!client) return;
      const now = new Date();
      // remove from old section
      state.clients[section] = state.clients[section].filter(
        (c) => c.id !== clientId
      );
      // add to in-session
      state.clients["in-session"].push({
        ...client,
        sessionStartTime: now,
        startTime: now.toLocaleTimeString(),
      });
      state.sessionStartTime = now;
      state.isSessionActive = true;
      state.sessionPaused = false;
    },
    endSession(state, action) {
      const { clientId } = action.payload;
      const client = state.clients["in-session"].find((c) => c.id === clientId);
      if (!client) return;
      const end = new Date();
      const diffMs = end - new Date(client.sessionStartTime);
      const minutes = Math.floor(diffMs / 60000);
      const seconds = Math.floor((diffMs % 60000) / 1000);
      state.lastEndedClient = {
        name: client.name,
        duration: `${minutes}m ${seconds}s`,
      };
      // clear in-session
      state.clients["in-session"] = [];
      state.sessionStartTime = null;
      state.isSessionActive = false;
      state.sessionPaused = false;
    },
    cancelClient(state, action) {
      const { section, clientId } = action.payload;
      if (section === "in-session") {
        state.sessionStartTime = null;
        state.isSessionActive = false;
        state.sessionPaused = false;
      }
      state.clients[section] = state.clients[section].filter(
        (c) => c.id !== clientId
      );
    },
    markArrived(state, action) {
      const { clientId } = action.payload;
      const client = state.clients["on-way"].find((c) => c.id === clientId);
      if (!client) return;
      state.clients["on-way"] = state.clients["on-way"].filter(
        (c) => c.id !== clientId
      );
      state.clients["on-site"].push({
        ...client,
        waitingSince: new Date().toLocaleTimeString(),
      });
    },
    pauseSession(state) {
      state.sessionPaused = true;
    },
    resumeSession(state) {
      state.sessionPaused = false;
    },
    resetSession(state) {
      const now = new Date();
      state.sessionStartTime = now;
      state.sessionPaused = false;
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
      });
  },
});

export const {
  startSession,
  endSession,
  cancelClient,
  markArrived,
  pauseSession,
  resumeSession,
  resetSession,
  clearLastEnded,
} = queueSlice.actions;

// We've already exported fetchActiveQueueAsync at the top of the file

export default queueSlice.reducer;

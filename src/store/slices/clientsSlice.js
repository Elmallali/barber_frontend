import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../service/api";


export const fetchClientsByStatus = createAsyncThunk(
  'clients/fetchByStatus',
  async ({ salonId, status = null, barberId = null }, { rejectWithValue }) => {
    try {
      const params = { 
        salon_id: salonId,
        status: status
      };
      
      // Add barber_id to params if it exists
      if (barberId) {
        params.barber_id = barberId;
      }
      
      const { data } = await api.get('/api/queue/entries', { params });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch clients');
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  activeTab: 'WAITING'
};

const clientsSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
    clearClients(state) {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientsByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientsByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchClientsByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setActiveTab, clearClients } = clientsSlice.actions;


export const selectClients = (state) => state.clients.items;
export const selectClientsLoading = (state) => state.clients.loading;
export const selectClientsError = (state) => state.clients.error;
export const selectActiveTab = (state) => state.clients.activeTab;

export default clientsSlice.reducer;

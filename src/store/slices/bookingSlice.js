import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getSalonsByLocation, 
  getBarbersForSalon,
  createBooking,
  getActiveBooking,
  cancelBooking 
} from '../../service/bookingService';

// Async thunks
export const fetchSalonsByLocation = createAsyncThunk(
  'booking/fetchSalonsByLocation',
  async ({ city, neighborhood }, { rejectWithValue }) => {
    try {
      // Call the real API endpoint
      const response = await getSalonsByLocation(city, neighborhood);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch salons');
    }
  }
);

export const fetchBarbersForSalon = createAsyncThunk(
  'booking/fetchBarbersForSalon',
  async (salonId, { rejectWithValue }) => {
    try {
      // Call the real API endpoint
      const response = await getBarbersForSalon(salonId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch barbers');
    }
  }
);

export const createNewBooking = createAsyncThunk(
  'booking/createBooking',
  async ({ salonId, barberId, clientId }, { rejectWithValue }) => {
    try {
      // Call the real API endpoint to create a booking
      const response = await createBooking(salonId, barberId, clientId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create booking');
    }
  }
);

export const fetchActiveBooking = createAsyncThunk(
  'booking/fetchActiveBooking',
  async (clientId, { rejectWithValue }) => {
    try {
      // Call the real API endpoint to get active booking
      const response = await getActiveBooking(clientId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active booking');
    }
  }
);

export const cancelActiveBooking = createAsyncThunk(
  'booking/cancelActiveBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      // Call the real API endpoint to cancel booking
      const response = await cancelBooking(bookingId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel booking');
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    // Location selection
    selectedCity: null,
    selectedNeighborhood: null,
    
    // Salon and barber selection
    salons: [],
    selectedSalon: null,
    barbers: [],
    selectedBarber: null,
    
    // Active booking
    activeBooking: null,
    queuePosition: null,
    totalInQueue: null,
    
    // UI states
    loadingSalons: false,
    loadingBarbers: false,
    creatingBooking: false,
    loadingActiveBooking: false,
    cancellingBooking: false,
    
    // Errors
    error: null
  },
  reducers: {
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload;
    },
    setSelectedNeighborhood: (state, action) => {
      state.selectedNeighborhood = action.payload;
    },
    setSelectedSalon: (state, action) => {
      state.selectedSalon = action.payload;
    },
    setSelectedBarber: (state, action) => {
      state.selectedBarber = action.payload;
    },
    clearBookingData: (state) => {
      state.activeBooking = null;
      state.queuePosition = null;
      state.totalInQueue = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch salons
      .addCase(fetchSalonsByLocation.pending, (state) => {
        state.loadingSalons = true;
        state.error = null;
      })
      .addCase(fetchSalonsByLocation.fulfilled, (state, action) => {
        state.loadingSalons = false;
        state.salons = action.payload;
      })
      .addCase(fetchSalonsByLocation.rejected, (state, action) => {
        state.loadingSalons = false;
        state.error = action.payload;
      })
      
      // Fetch barbers
      .addCase(fetchBarbersForSalon.pending, (state) => {
        state.loadingBarbers = true;
        state.error = null;
      })
      .addCase(fetchBarbersForSalon.fulfilled, (state, action) => {
        state.loadingBarbers = false;
        state.barbers = action.payload;
      })
      .addCase(fetchBarbersForSalon.rejected, (state, action) => {
        state.loadingBarbers = false;
        state.error = action.payload;
      })
      
      // Create booking
      .addCase(createNewBooking.pending, (state) => {
        state.creatingBooking = true;
        state.error = null;
      })
      .addCase(createNewBooking.fulfilled, (state, action) => {
        state.creatingBooking = false;
        state.activeBooking = action.payload.entry;
        state.queuePosition = action.payload.position;
        state.totalInQueue = action.payload.totalInQueue;
      })
      .addCase(createNewBooking.rejected, (state, action) => {
        state.creatingBooking = false;
        state.error = action.payload;
      })
      
      // Fetch active booking
      .addCase(fetchActiveBooking.pending, (state) => {
        state.loadingActiveBooking = true;
        state.error = null;
      })
      .addCase(fetchActiveBooking.fulfilled, (state, action) => {
        state.loadingActiveBooking = false;
        state.activeBooking = action.payload.entry;
        state.queuePosition = action.payload.position;
        state.totalInQueue = action.payload.totalInQueue;
      })
      .addCase(fetchActiveBooking.rejected, (state, action) => {
        state.loadingActiveBooking = false;
        state.activeBooking = null;
        state.error = action.payload;
      })
      
      // Cancel booking
      .addCase(cancelActiveBooking.pending, (state) => {
        state.cancellingBooking = true;
        state.error = null;
      })
      .addCase(cancelActiveBooking.fulfilled, (state) => {
        state.cancellingBooking = false;
        state.activeBooking = null;
        state.queuePosition = null;
        state.totalInQueue = null;
      })
      .addCase(cancelActiveBooking.rejected, (state, action) => {
        state.cancellingBooking = false;
        state.error = action.payload;
      });
  }
});

export const { 
  setSelectedCity, 
  setSelectedNeighborhood, 
  setSelectedSalon, 
  setSelectedBarber,
  clearBookingData
} = bookingSlice.actions;

export default bookingSlice.reducer;

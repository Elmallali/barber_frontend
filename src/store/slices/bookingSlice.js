import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getSalonsByLocation, 
  getBarbersForSalon,
  createBooking,
  getActiveBooking,
  cancelBooking,
  getAvailableLocations,
  getQueueInfo
} from '../../service/bookingService';


export const fetchSalonsByLocation = createAsyncThunk(
  'booking/fetchSalonsByLocation',
  async ({ city, neighborhood }, { rejectWithValue }) => {
    try {
      
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
      
      const response = await cancelBooking(bookingId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel booking');
    }
  }
);

export const fetchQueueInfo = createAsyncThunk(
  'booking/fetchQueueInfo',
  async ({ salonId, barberId }, { rejectWithValue }) => {
    try {
      const response = await getQueueInfo(salonId, barberId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch queue information');
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    
    selectedCity: null,
    selectedNeighborhood: null,
    selectedSalon: null,
    selectedBarber: null,
    salons: [],
    barbers: [],
    loadingSalons: false,
    loadingBarbers: false,
    creatingBooking: false,
    cancellingBooking: false,
    loadingActiveBooking: false,
    loadingQueueInfo: false,
    activeBooking: null,
    queuePosition: null,
    totalInQueue: null,
    error: null,
    cities: [],
    neighborhoods: [],
    loadingLocations: false,
    estimatedPosition: null,
    activeClientsCount: null
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
      // Reset active booking data
      state.activeBooking = null;
      state.queuePosition = null;
      state.totalInQueue = null;
      
      // Reset location selections
      state.selectedCity = null;
      state.selectedNeighborhood = null;
      
      // Reset salon and barber selections and lists
      state.salons = [];
      state.selectedSalon = null;
      state.barbers = [];
      state.selectedBarber = null;
      
      // Reset error state
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      
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
      
      
      .addCase(fetchActiveBooking.pending, (state) => {
        state.loadingActiveBooking = true;
        state.error = null;
      })
      .addCase(fetchActiveBooking.fulfilled, (state, action) => {
        state.loadingActiveBooking = false;
        
        // Only update if we have valid data
        if (action.payload) {
          // Check if the response has an entry property or if it is the entry itself
          if (action.payload.entry) {
            // Structure with entry property
            state.activeBooking = action.payload.entry;
            state.queuePosition = action.payload.position;
            state.totalInQueue = action.payload.totalInQueue;
            
            console.log('Active booking data updated (entry format):', {
              entry: action.payload.entry,
              position: action.payload.position,
              totalInQueue: action.payload.totalInQueue
            });
          } else if (action.payload.id) {
            // Direct entry structure (the payload itself is the entry)
            state.activeBooking = action.payload;
            // If position is not provided in this format, default to the position in the entry
            state.queuePosition = action.payload.position || 0;
            // If totalInQueue is not provided, default to 1 (at least this booking)
            state.totalInQueue = 1;
            
            console.log('Active booking data updated (direct format):', action.payload);
          } else {
            console.log('Unexpected data format received:', action.payload);
          }
        } else {
          console.log('No active booking data received from API');
        }
      })
      .addCase(fetchActiveBooking.rejected, (state, action) => {
        state.loadingActiveBooking = false;
        state.activeBooking = null;
        state.error = action.payload;
      })
      
      
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
      })
      
      // Handle fetchQueueInfo
      .addCase(fetchQueueInfo.pending, (state) => {
        state.loadingQueueInfo = true;
        state.error = null;
      })
      .addCase(fetchQueueInfo.fulfilled, (state, action) => {
        state.loadingQueueInfo = false;
        if (action.payload) {
          state.estimatedPosition = action.payload.estimatedPosition || 1;
          state.activeClientsCount = action.payload.activeClientsCount || 0;
          state.totalInQueue = action.payload.totalInQueue || state.activeClientsCount + 1;
          
          console.log('Queue info updated:', {
            estimatedPosition: state.estimatedPosition,
            activeClientsCount: state.activeClientsCount,
            totalInQueue: state.totalInQueue
          });
        }
      })
      .addCase(fetchQueueInfo.rejected, (state, action) => {
        state.loadingQueueInfo = false;
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

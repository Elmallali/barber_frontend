import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../service/authService";
import api from "../../service/api";

// Thunk for logging in
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const data = await authService.login(credentials);
      localStorage.setItem("token", data.token);
      // Set the token in the API headers for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Login failed");
    }
  }
);

// Thunk for registering
export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const data = await authService.register(userData);
      localStorage.setItem("token", data.token);
      // Set the token in the API headers for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Registration failed"
      );
    }
  }
);

// Thunk for checking if user is already authenticated
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        return thunkAPI.rejectWithValue("No token found");
      }
      
      // Set the token in the API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch the current user's data
      const data = await authService.getCurrentUser();
      return { user: data, token };
    } catch (err) {
      // If the token is invalid or expired, remove it
      localStorage.removeItem("token");
      return thunkAPI.rejectWithValue(err.response?.data || "Authentication failed");
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  isLoading: false,
  isError: false,
  errorMessage: null,
  isAuthenticated: !!localStorage.getItem("token"),
  isAuthChecked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      // Remove the token from API headers
      delete api.defaults.headers.common['Authorization'];
    },
  },
  extraReducers: (builder) => {
    builder
      // login handlers
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        
        // Store user data in localStorage for persistence
        if (action.payload.user) {
          localStorage.setItem('user_name', action.payload.user.name || '');
          localStorage.setItem('user_email', action.payload.user.email || '');
          localStorage.setItem('user_id', action.payload.user.id ? action.payload.user.id.toString() : '1');
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      // register handlers
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        
        // Store user data in localStorage for persistence
        if (action.payload.user) {
          localStorage.setItem('user_name', action.payload.user.name || '');
          localStorage.setItem('user_email', action.payload.user.email || '');
          localStorage.setItem('user_id', action.payload.user.id ? action.payload.user.id.toString() : '1');
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      // checkAuth handlers
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        
        // Store user data in localStorage for persistence
        if (action.payload.user) {
          localStorage.setItem('user_name', action.payload.user.name || '');
          localStorage.setItem('user_email', action.payload.user.email || '');
          localStorage.setItem('user_id', action.payload.user.id ? action.payload.user.id.toString() : '1');
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      });
  },
});

export const { logout } = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectError = (state) => state.auth.errorMessage;

export default authSlice.reducer;

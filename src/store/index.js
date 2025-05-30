import { configureStore } from "@reduxjs/toolkit";
import queueReducer from "./slices/queueSlice";
import authReducer from "./slices/authSlice";
import clientsReducer from "./slices/clientsSlice";
import bookingReducer from "./slices/bookingSlice";
import dashboardReducer from "./slices/dashboardSlice";
import { notificationMiddleware } from "./middleware/notificationMiddleware";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    queue: queueReducer,
    clients: clientsReducer,
    booking: bookingReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(notificationMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});
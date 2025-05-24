import { configureStore } from "@reduxjs/toolkit";
import queueReducer from "./slices/queueSlice";
import authReducer from "./slices/authSlice";
import clientsReducer from "./slices/clientsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    queue: queueReducer,
    clients: clientsReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});
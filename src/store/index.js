import { configureStore } from "@reduxjs/toolkit";
import queueReducer from "./slices/queueSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    queue: queueReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});
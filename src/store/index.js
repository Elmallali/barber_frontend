import { configureStore } from "@reduxjs/toolkit";
import queueReducer from "./slices/queueSlice";

export const store = configureStore({
  reducer: {
    queue: queueReducer,
  },
});

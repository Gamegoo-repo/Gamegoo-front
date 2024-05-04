import { configureStore } from "@reduxjs/toolkit";
import exampleSlice from "./slices/exampleSlice";

export const store = configureStore({
  reducer: {
    // slice
    example: exampleSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

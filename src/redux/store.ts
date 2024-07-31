import { configureStore } from "@reduxjs/toolkit";
import exampleSlice from "./slices/exampleSlice";
import modalReducer from "./slices/modalSlice";
import mannerStatusReducer from "./slices/mannerStatusSlice";


export const store = () => {
  return configureStore({
    reducer: {
      example: exampleSlice,
      modal: modalReducer,
      mannerStatus: mannerStatusReducer,
    },
  })
}

export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

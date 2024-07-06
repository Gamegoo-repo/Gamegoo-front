import { configureStore } from "@reduxjs/toolkit";
import exampleSlice from "./slices/exampleSlice";
import confirmModalReducer from "./slices/confirmModalSlice";
import mannerStatusReducer from "./slices/mannerStatusSlice";


export const store = () => {
  return configureStore({
    reducer: {
      example: exampleSlice,
      confirmModal: confirmModalReducer,
      mannerStatus: mannerStatusReducer,
    },
  })
}

export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

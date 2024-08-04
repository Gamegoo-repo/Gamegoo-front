import { configureStore } from "@reduxjs/toolkit";
import signInReducer from "./slices/signInSlice";
import userReducer from "./slices/userSlice";
import modalReducer from "./slices/modalSlice";
import mannerStatusReducer from "./slices/mannerStatusSlice";


export const store = () => {
  return configureStore({
    reducer: {
      signIn: signInReducer,
      user: userReducer,
      modal: modalReducer,
      mannerStatus: mannerStatusReducer,
    },
  })
}

export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

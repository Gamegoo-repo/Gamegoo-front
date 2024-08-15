import { configureStore } from "@reduxjs/toolkit";
import signInReducer from "./slices/signInSlice";
import userReducer from "./slices/userSlice";
import modalReducer from "./slices/modalSlice";
import mannerStatusReducer from "./slices/mannerStatusSlice";
import postReducer from "./slices/postSlice";
import passwordReducer from "./slices/passwordSlice";

export const store = () => {
  return configureStore({
    reducer: {
      signIn: signInReducer,
      password: passwordReducer,
      user: userReducer,
      modal: modalReducer,
      mannerStatus: mannerStatusReducer,
      post: postReducer
    },
  })
}

export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

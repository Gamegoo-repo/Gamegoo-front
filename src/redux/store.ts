import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import boardReducer from "./slices/boardSlice";
import chatPositionReducer from "./slices/chatPositionSlice";
import chatReducer from "./slices/chatSlice";
import mannerStatusReducer from "./slices/mannerStatusSlice";
import matchInfoReducer from "./slices/matchInfo";
import matchingReducer from "./slices/matchingSlice";
import modalReducer from "./slices/modalSlice";
import notiReducer from "./slices/notiSlice";
import passwordReducer from "./slices/passwordSlice";
import postReducer from "./slices/postSlice";
import signInReducer from "./slices/signInSlice";
import userReducer from "./slices/userSlice";

// chat reducer만 persist 적용
const chatPersistConfig = {
  key: "chat",
  storage,
  whitelist: ["activeTab"],
};

const persistedChatReducer = persistReducer(chatPersistConfig, chatReducer);

export const store = () => {
  return configureStore({
    reducer: {
      signIn: signInReducer,
      password: passwordReducer,
      user: userReducer,
      modal: modalReducer,
      mannerStatus: mannerStatusReducer,
      post: postReducer,
      matchInfo: matchInfoReducer,
      chat: persistedChatReducer,
      noti: notiReducer,
      matching: matchingReducer,
      board: boardReducer,
      chatPosition: chatPositionReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
};

export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

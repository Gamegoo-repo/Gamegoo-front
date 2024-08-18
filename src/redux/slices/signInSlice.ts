import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SignInState {
  email: string;
  emailAuth: string;
  password: string;
  authStatus: boolean;
  summonerName: string;
  summonerTag: string;
  socketId: string | undefined;
};

const initialState: SignInState = {
  email: '',
  emailAuth: '',
  password: '',
  authStatus: false,
  summonerName: '',
  summonerTag: '',
  socketId: '' || undefined,
};

export const signInSlice = createSlice({
  name: 'signIn',
  initialState,
  reducers: {
    updateEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    updateEmailAuth: (state, action: PayloadAction<string>) => {
      state.emailAuth = action.payload;
    },
    updatePassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    updateAuthStatus: (state, action: PayloadAction<boolean>) => {
      state.authStatus = action.payload;
    },
    updateSummoner: (state, action: PayloadAction<string>) => {
      state.summonerName = action.payload;
      state.summonerTag = action.payload;
    },
    updateSocketId: (state, action: PayloadAction<string | undefined>) => {
      state.socketId = action.payload;
    }
  },
});

export const {
  updateEmail,
  updateEmailAuth,
  updatePassword,
  updateAuthStatus,
  updateSocketId
} = signInSlice.actions;

export default signInSlice.reducer;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SignInState {
    email: string;
    emailAuth: string;
    password: string;
    authStatus: boolean;
};

const initialState: SignInState = {
    email: '',
    emailAuth: '',
    password: '',
    authStatus: false,
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
  },
});

export const {updateEmail, updateEmailAuth, updatePassword, updateAuthStatus } = signInSlice.actions;

export default signInSlice.reducer;
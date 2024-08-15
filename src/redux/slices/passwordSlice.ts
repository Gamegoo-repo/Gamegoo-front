import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PasswordState {
    email: string;
    emailAuth: string;
    authStatus: boolean;
    password: string;
};

const initialState: PasswordState = {
    email: '',
    emailAuth: '',
    authStatus: false,
    password: '',
};

export const passwordSlice = createSlice({
  name: 'password',
  initialState,
  reducers: {
    updateEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    updateEmailAuth: (state, action: PayloadAction<string>) => {
      state.emailAuth = action.payload;
    },
    updateAuthStatus: (state, action: PayloadAction<boolean>) => {
        state.authStatus = action.payload;
      },
    updatePassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
  },
});

export const {updateEmail, updateEmailAuth, updateAuthStatus, updatePassword } = passwordSlice.actions;

export default passwordSlice.reducer;
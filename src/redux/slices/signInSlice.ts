import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SignInState {
    terms: boolean[];
    email: string;
    emailAuth: string;
    password: string;
    authStatus: boolean;
    summonerName: string;
    summonerTag: string;
};

const initialState: SignInState = {
    terms: [false, false, false],
    email: '',
    emailAuth: '',
    password: '',
    authStatus: false,
    summonerName: '',
    summonerTag: '',
};

export const signInSlice = createSlice({
  name: 'signIn',
  initialState,
  reducers: {
    updateTerms: (state, action: PayloadAction<boolean[]>) => {
      state.terms = action.payload;
    },
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
  },
});

export const {updateTerms, updateEmail, updateEmailAuth, updatePassword, updateAuthStatus } = signInSlice.actions;

export default signInSlice.reducer;
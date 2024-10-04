import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SignInState {
  terms: boolean[];
  email: string;
  emailAuth: string;
  password: string;
  authStatus: boolean;
  summonerName: string;
  summonerTag: string;
  socketId: string | undefined;
};

const initialState: SignInState = {
  terms: [false, false, false],
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
    clearSignIn(state) {
      state.terms= [false, false, false];
      state.email= '';
      state.emailAuth='';
      state.password='';
      state.authStatus= false;
      state.summonerName= '';
      state.summonerTag= '';
      state.socketId ='';
    }
  },
});

export const { updateTerms, updateEmail, updateEmailAuth, updatePassword, updateAuthStatus,clearSignIn } = signInSlice.actions;

export default signInSlice.reducer;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GameStyle {
  gameStyleId: number;
  gameStyleName: string;
}

interface Champion {
  championId: number;
  championName: string;
}

interface UserState {
  id: number;
  gameName: string;
  profileImg: number;
  email: string;
  tag: string;
  tier: string;
  rank: number;
  manner: number;
  mike: boolean;
  mainP: number;
  subP: number;
  updatedAt: string;
  isAgree: boolean;
  isBlind: boolean;
  loginType: string;
  winRate: number;
  gameStyleResponseDTOList: GameStyle[];
  championResponseDTOList: Champion[];
};

const initialState: UserState = {
  id: 0,
  profileImg: 0,
  email: '',
  gameName: '',
  tag: '',
  tier: '',
  rank: 0,
  manner: 0,
  mike: false,
  mainP: 0,
  subP: 0,
  updatedAt: '',
  isAgree: true,
  isBlind: true,
  loginType: '',
  winRate: 0,
  gameStyleResponseDTOList: [],
  championResponseDTOList: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserName: (state, action: PayloadAction<string>) => {
      state.gameName = action.payload;
    },
    setUserProfileImg: (state, action: PayloadAction<number>) => {
      state.profileImg = action.payload;
    },
    setUserProfile: (state: any, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setUserName, setUserProfileImg, setUserProfile } = userSlice.actions;

export default userSlice.reducer;
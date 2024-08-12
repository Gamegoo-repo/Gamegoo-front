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
  gameName: string;
  profileImg: number;
  email: string;
  tag: string;
  tier: string;
  rank: string;
  mike: boolean;
  mainP: number;
  subP: number;
  updatedAt: string;
  gameStyleResponseDTOList: GameStyle[];
  championResponseDTOList: Champion[];
};

const initialState: UserState = {
  profileImg: 0,
  email: '',
  gameName: '',
  tag: '',
  tier: '',
  rank: '',
  mike: false,
  mainP: 0,
  subP: 0,
  updatedAt: '',
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
    setUserProfile: (state:any, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {setUserName, setUserProfileImg, setUserProfile} = userSlice.actions;

export default userSlice.reducer;
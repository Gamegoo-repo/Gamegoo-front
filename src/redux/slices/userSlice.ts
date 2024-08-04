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
  profileImg: string;
  email: string;
  tag: string;
  tier: string;
  rank: string;
  updatedAt: string;
  gameStyleResponseDTOList: GameStyle[];
  championResponseDTOList: Champion[];
};

const initialState: UserState = {
  profileImg: '',
  email: '',
  gameName: '',
  tag: '',
  tier: '',
  rank: '',
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
    setUserProfile: (state:any, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {setUserName, setUserProfile} = userSlice.actions;

export default userSlice.reducer;
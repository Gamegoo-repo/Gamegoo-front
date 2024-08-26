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
  id?: number | undefined;
  profileImg: number;
  mike: boolean;
  email: string;
  gameName: string;
  tag: string;
  tier: string;
  rank: number;
  manner: number;
  updatedAt: string;
  mainP: number;
  subP: number;
  isAgree: boolean;
  isBlind: boolean;
  loginType: string;
  winrate: number;
  gameStyleResponseDTOList: GameStyle[];
  championResponseDTOList: Champion[];
  blocked: boolean;
  friend: boolean;
  friendRequestMemberId: number | null;
};

const initialState: UserState = {
  id: 0,
  profileImg: 1,
  mike: false,
  email: '',
  gameName: '',
  tag: '',
  tier: '',
  rank: 0,
  manner: 0,
  updatedAt: '',
  mainP: 0,
  subP: 0,
  isAgree: false,
  isBlind: false,
  loginType: '',
  winrate: 0,
  gameStyleResponseDTOList: [],
  championResponseDTOList: [],
  blocked: false,
  friend: false,
  friendRequestMemberId: null,
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
    clearUserProfile(state) {
      state.id = 0;
      state.profileImg = 1;
      state.mike = false;
      state.email = '';
      state.gameName = '';
      state.tag = '';
      state.tier = '';
      state.rank = 0;
      state.manner = 0;
      state.updatedAt = '';
      state.mainP = 0;
      state.subP = 0;
      state.isAgree = false;
      state.isBlind = false;
      state.loginType = '';
      state.winrate = 0;
      state.gameStyleResponseDTOList = [];
      state.championResponseDTOList = [];
      state.blocked = false;
      state.friend = false;
      state.friendRequestMemberId = null;
    },
  },
});

export const { setUserName, setUserProfileImg, setUserProfile, clearUserProfile } = userSlice.actions;

export default userSlice.reducer;
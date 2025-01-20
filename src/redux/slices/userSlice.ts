import { ChampionList, GameStyleList } from '@/interface/profile';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id?: number | undefined;
  profileImg: number;
  mike: boolean;
  email: string;
  gameName: string;
  tag: string;
  tier: string;
  gameRank: number;
  mannerRank: number;
  mannerLevel: number;
  updatedAt: string;
  mainP: number;
  subP: number;
  wantP: number;
  isAgree: boolean;
  isBlind: boolean;
  loginType: string;
  winrate: number;
  gameStyleResponseList: GameStyleList[];
  championResponseList: ChampionList[];
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
  gameRank: 0,
  mannerRank: 0,
  mannerLevel: 0,
  updatedAt: '',
  mainP: 0,
  subP: 0,
  wantP: 0,
  isAgree: false,
  isBlind: false,
  loginType: '',
  winrate: 0,
  gameStyleResponseList: [],
  championResponseList: [],
  blocked: false,
  friend: false,
  friendRequestMemberId: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<number>) => {
      state.id = action.payload;
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.gameName = action.payload;
    },
    setUserProfileImg: (state, action: PayloadAction<number>) => {
      state.profileImg = action.payload;
    },
    setUserMike: (state, action: PayloadAction<boolean>) => {
      state.mike = action.payload;
    },
    setUserProfile: (state: any, action: PayloadAction<Partial<UserState>>) => {
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
      state.gameRank = 0;
      state.mannerRank = 0;
      state.mannerLevel = 0;
      state.updatedAt = '';
      state.mainP = 0;
      state.subP = 0;
      state.wantP = 0;
      state.isAgree = false;
      state.isBlind = false;
      state.loginType = '';
      state.winrate = 0;
      state.gameStyleResponseList = [];
      state.championResponseList = [];
      state.blocked = false;
      state.friend = false;
      state.friendRequestMemberId = null;
    },
  },
});

export const { setUserId, setUserName, setUserProfileImg, setUserMike, setUserProfile, clearUserProfile } = userSlice.actions;

export default userSlice.reducer;
import { ChampionList, GameStyleList } from '@/interface/profile';
import { Position } from '@/types/position/position';
import { Mike } from '@/types/user/mike';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id?: number | undefined;
  profileImg: number;
  mike: Mike;
  email: string;
  gameName: string;
  tag: string;
  tier: string;
  gameRank: number;
  mannerRank: number;
  mannerLevel: number;
  updatedAt: string;
  mainP: Position;
  subP: Position;
  wantP: Position;
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
  mike: "UNAVAILABLE",
  email: "",
  gameName: "",
  tag: "",
  tier: "",
  gameRank: 0,
  mannerRank: 0,
  mannerLevel: 0,
  updatedAt: "",
  mainP: "ANY",
  subP: "ANY",
  wantP: "ANY",
  isAgree: false,
  isBlind: false,
  loginType: "",
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
    setUserMike: (state, action: PayloadAction<Mike>) => {
      state.mike = action.payload;
    },
    setUserProfile: (state: any, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
    clearUserProfile(state) {
      state.id = 0;
      state.profileImg = 1;
      state.mike = "UNAVAILABLE";
      state.email = '';
      state.gameName = '';
      state.tag = '';
      state.tier = '';
      state.gameRank = 0;
      state.mannerRank = 0;
      state.mannerLevel = 0;
      state.updatedAt = '';
      state.mainP = "ANY";
      state.subP = "ANY";
      state.wantP = "ANY";
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
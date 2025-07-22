import { createSlice } from "@reduxjs/toolkit";



import type { PayloadAction } from "@reduxjs/toolkit";
import type { WritableDraft } from "immer";
import type { ChampionResponseDTO } from "@/types/api/champion/champion";
import type { GameStyleList } from "@/types/api/user/profile/profile";
import type { Position } from "@/types/position/position";
import type { Mike } from "@/types/user/mike";


export interface UserState {
  id?: number | undefined;
  profileImg: number;
  mike: Mike;
  email: string;
  gameName: string;
  tag: string;
  soloTier: string;
  freeTier: string;
  soloRank: number;
  freeRank: number;
  updatedAt: string;
  mainP: Position;
  subP: Position;
  wantP: Position[];
  isAgree: boolean;
  isBlind: boolean;
  loginType: string;
  soloWinrate: number;
  freeWinrate: number;
  gameStyleResponseList: GameStyleList[];
  championResponseList: ChampionResponseDTO[];
  blocked: boolean;
  friend: boolean;
  friendRequestMemberId: number | null;
}

const initialState: UserState = {
  id: 0,
  profileImg: 1,
  mike: "UNAVAILABLE",
  email: "",
  gameName: "",
  tag: "",
  soloTier: "",
  freeTier: "",
  soloRank: 0,
  freeRank: 0,
  updatedAt: "",
  mainP: "ANY",
  subP: "ANY",
  wantP: [],
  isAgree: false,
  isBlind: false,
  loginType: "",
  soloWinrate: 0,
  freeWinrate: 0,
  gameStyleResponseList: [],
  championResponseList: [],
  blocked: false,
  friend: false,
  friendRequestMemberId: null,
};

export const userSlice = createSlice({
  name: "user",
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
    setUserProfile: (
      state: WritableDraft<UserState>,
      action: PayloadAction<Partial<Record<keyof UserState, any>>>
    ) => {
      const payload = action.payload;

      (Object.keys(initialState) as (keyof UserState)[]).forEach((key) => {
        const value = payload[key];

        if (key === "gameStyleResponseList" && Array.isArray(value)) {
          (state as any)[key] = value.map((style: any) => ({
            gameStyleId: style?.gameStyleId ?? 0,
            gameStyleName: style?.gameStyleName ?? "",
          }));
        } else if (key === "championResponseList" && Array.isArray(value)) {
          (state as any)[key] = value.map((champ: any) => ({
            championId: champ?.championId ?? 0,
            championName: champ?.championName ?? "",
            winRate: champ?.winRate ?? 0,
            wins: champ?.wins ?? 0,
            games: champ?.games ?? 0,
            csPerMinute: champ?.csPerMinute ?? 0,
            averageCs: champ?.averageCs ?? 0,
            kda: champ?.kda ?? 0,
            kills: champ?.kills ?? 0,
            deaths: champ?.deaths ?? 0,
            assists: champ?.assists ?? 0,
          }));
        } else {
          // 타입 충돌 대비
          (state as Record<keyof UserState, UserState[keyof UserState]>)[key] =
            value !== undefined ? value : initialState[key];
        }
      });
    },
    clearUserProfile(state) {
      state.id = 0;
      state.profileImg = 1;
      state.mike = "UNAVAILABLE";
      state.email = "";
      state.gameName = "";
      state.tag = "";
      state.soloTier = "";
      state.freeTier = "";
      state.soloRank = 0;
      state.freeRank = 0;
      // state.mannerRank = 0;
      // state.mannerLevel = 0;
      state.updatedAt = "";
      state.mainP = "ANY";
      state.subP = "ANY";
      state.wantP = [];
      state.isAgree = false;
      state.isBlind = false;
      state.loginType = "";
      state.soloWinrate = 0;
      state.freeWinrate = 0;
      state.gameStyleResponseList = [];
      state.championResponseList = [];
      state.blocked = false;
      state.friend = false;
      state.friendRequestMemberId = null;
    },
  },
});

export const {
  setUserId,
  setUserName,
  setUserProfileImg,
  setUserMike,
  setUserProfile,
  clearUserProfile,
} = userSlice.actions;

export default userSlice.reducer;
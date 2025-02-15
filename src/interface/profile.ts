import { Position } from "@/types/position/position";
import { Mike } from "@/types/user/mike";

export type profileType = "normal" | "wind" | "other" | "me";

export interface Champion {
  championId: number;
  championName: string;
}

export interface GameStyle {
  gameStyleId: number;
  gameStyleName: string;
}

export interface User {
  id?: number;
  profileImg: number;
  mike: Mike;
  email?: string;
  gameName: string;
  tag: string;
  soloTier: string;
  freeTier: string;
  soloRank: number;
  freeRank: number;
  mannerLevel: number;
  mannerRank?: null | number;
  mannerRatingCount?: number;
  updatedAt: string;
  mainP: Position;
  subP: Position;
  wantP: Position;
  blocked: boolean;
  isAgree: boolean;
  isBlind: boolean;
  loginType: string;
  soloWinrate: number;
  freeWinrate: number;
  gameStyleResponseList: GameStyle[];
  championResponseList: Champion[];
  friend: boolean;
  friendRequestMemberId: number | null;
}

export interface Profile {
  user: User;
  profileType?: profileType;
}

export interface GameStyleList {
  gameStyleId: number;
  gameStyleName: string;
}

export interface ChampionList {
  championId: number;
  championName: string;
}

export interface UserInfo {
  id: number;
  isAgree: boolean;
  isBlind: boolean;
  mainP: Position;
  subP: Position;
  winRate: number;
  profileImg: number;
  email: string;
  gameName: string;
  tag: string;
  tier: string;
  rank: string;
  updatedAt: string;
  gameStyleResponseDTOList: GameStyleList[];
  championResponseDTOList: ChampionList[];
  loginType: string;
}


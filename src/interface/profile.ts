export type profileType = "fun" | "hard" | "other" | "me";

export interface Champion {
  championId: number;
  championName: string;
}

export interface GameStyle {
  gameStyleId: number;
  gameStyleName: string;
}

export interface User {
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
  mainP: number;
  subP: number;
  winRate: number;
  profileImg: number;
  email: string;
  gameName: string;
  tag: string;
  tier: string;
  rank: string;
  updatedAt: string,
  gameStyleResponseDTOList: GameStyleList[];
  championResponseDTOList: ChampionList[];
  loginType: string;
}


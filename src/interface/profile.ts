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
  mike: boolean;
  email: string;
  gameName: string;
  tag: string;
  tier: string;
  rank: number;
  manner: number;
  updatedAt: string;
  mainP: number;
  subP:number;
  blocked: boolean;
  isAgree: boolean;
  isBlind: boolean;
  loginType: string;
  winrate: number;
  gameStyleResponseDTOList: GameStyle[];
  championResponseDTOList: Champion[];
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


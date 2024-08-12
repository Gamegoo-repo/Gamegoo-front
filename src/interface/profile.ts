export type profileType = "fun" | "hard" | "other" | "me";

export interface Champion {
  id: number;
  value: string;
}

export interface User {
  image: string;
  account: string;
  tag: string;
  tier: string;
  mic: boolean;
  champions?: Champion[];
  gameStyle: string[];
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


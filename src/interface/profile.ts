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
  profileImg: string;
  email: string;
  tag: string;
  tier: string;
  rank: string;
  updatedAt: string;
  gameStyleResponseDTOList: GameStyle[];
  championResponseDTOList: Champion[];
}

export interface Profile {
  user: User;
  profileType?: profileType;
}

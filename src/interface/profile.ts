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
  profileType: profileType;
}
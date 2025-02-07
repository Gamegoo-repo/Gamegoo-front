import { ChampionList, GameStyleList } from "@/interface/profile";
import { ApiResponse } from "../api";
import { Mike } from "@/types/user/mike";

interface BaseProfileData {
  id: number;
  profileImg: number;
  mike: Mike;
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
}

export interface GetMyProfileData extends BaseProfileData {
  email: string;
}

export interface GetOtherProfileData extends BaseProfileData {
  mannerRatingCount: number;
  blocked: boolean;
  friend: boolean;
  friendRequestMemberId: number;
}

export type GetMyProfileResponse = ApiResponse<GetMyProfileData>;
export type GetOtherProfileResponse = ApiResponse<GetOtherProfileData>;
import { ChampionList, GameStyleList } from "@/interface/profile";
import { ApiResponse } from "../api";
import { Mike } from "@/types/user/mike";

interface BaseProfileData {
  id: number;
  profileImg: number;
  mike: Mike;
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
  championResponseList: ChampionList[];
  memberRecentStats: MemberRecentStats;
}

export interface GetMyProfileData extends BaseProfileData {
  email: string;
}

export interface GetOtherProfileData extends BaseProfileData {
  blocked: boolean;
  friend: boolean;
  friendRequestMemberId: number;
}

export type GetMyProfileResponse = ApiResponse<GetMyProfileData>;
export type GetOtherProfileResponse = ApiResponse<GetOtherProfileData>;

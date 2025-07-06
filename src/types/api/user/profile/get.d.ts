import { ChampionList, GameStyleList } from "@/types/api/user/profile/profile";
import { ApiResponse } from "@/types/api/api";
import { Mike } from "@/types/user/mike";
import { Position } from "@/types/position/position";

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
  championStatsResponseList: ChampionList[];
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

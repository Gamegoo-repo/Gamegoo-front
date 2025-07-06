import type { ApiResponse } from "@/types/api/api";
import type {
  ChampionList,
  GameStyleList,
} from "@/types/api/user/profile/profile";
import type { Position } from "@/types/position/position";
import type { Mike } from "@/types/user/mike";

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

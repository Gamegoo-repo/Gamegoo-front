import type { ChampionResponseDTO } from "@/types/api/champion/champion";
import type { Position } from "@/types/position/position";
import type { Mike } from "@/types/user/mike";

export type profileType = "normal" | "wind" | "other" | "me";

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
  updatedAt: string;
  mainP: Position;
  subP: Position;
  wantP: Position[];
  blocked: boolean;
  isAgree: boolean;
  isBlind: boolean;
  loginType: string;
  soloWinrate: number;
  freeWinrate: number;
  gameStyleResponseList: GameStyle[];
  championResponseList: ChampionResponseDTO[];
  memberRecentStats?: MemberRecentStats;
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

export interface MemberRecentStats {
  recTotalWins: number;
  recTotalLosses: number;
  recWinRate: number;
  recAvgKDA: number;
  recAvgKills: number;
  recAvgDeaths: number;
  recAvgAssists: number;
  recAvgCsPerMinute: number;
  recTotalCs: number;
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
  championResponseDTOList: ChampionResponseDTO[];
  loginType: string;
}

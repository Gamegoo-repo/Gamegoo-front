import { MannerKeywordDTO } from "@/types/api/board/board";
import { GameMode } from "@/types/game/gameMode";
import { Position } from "@/types/position/position";
import { Mike } from "@/types/user/mike";

export interface ChampionResponseDTOList {
  championId: number;
  championName: string;
}

export interface gameStyleResponseDTOList {
  gameStyleId: number;
  gameStyleName: string;
}

export interface BoardListDetail {
  boardId: number;
  memberId: number;
  profileImage: number;
  gameName: string;
  mannerLevel: number;
  tag: string;
  tier: string;
  rank: number;
  gameMode: GameMode;
  mainP: Position;
  subP: Position;
  wantP: Position[];
  championResponseList?: ChampionResponseDTOList[];
  winRate: number;
  createdAt: string;
  mike: Mike;
}

export interface BoardDetail {
  boardId: number;
  memberId: number;
  profileImage: number;
  gameName: string;
  mannerLevel: number;
  tag: string;
  soloTier: string;
  freeTier: string;
  soloRank: number;
  freeRanks: number;
  gameMode: GameMode;
  mainP: Position;
  subP: Position;
  wantP: Position[];
  championResponseList?: ChampionResponseDTOList[];
  winRate: number;
  createdAt: string;
  mike: Mike;
}

export interface BoardList {
  totalPage: number;
  totalCount: number;
  boards: BoardListDetail[];
}

export interface MemberPost {
  boardId: number;
  memberId: number;
  isBlocked?: boolean;
  isFriend?: boolean;
  friendRequestMemberId?: number;
  createdAt: string;
  profileImage: number;
  gameName: string;
  tag: string;
  mannerLevel: number;
  mannerKeywords?: MannerKeywordDTO[];
  soloTier?: string;
  freeTier?: string;
  mike: Mike;
  championResponseList?: ChampionResponseDTOList[];
  championResponseDTOList?: ChampionResponseDTOList[];
  gameMode: GameMode;
  mainP?: Position;
  subP?: Position;
  wantP?: Position[];
  recentGameCount?: number;
  winRate: number;
  gameStyles: number[];
  contents: string;
  soloRank?: number;
  freeRank?: number;
}

export interface PostReq {
  boardProfileImage: number;
  gameMode: GameMode;
  mainP: Position;
  subP: Position;
  wantP: Position[];
  mike: Mike;
  gameStyles: number[];
  contents: string;
}

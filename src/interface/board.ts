import { MannerKeywordDTO } from "@/types/api/board/board";
import { Position } from "@/types/position/position";

export interface ChampionResponseDTOList {
  championId: number;
  championName: string;
}

export interface gameStyleResponseDTOList {
  gameStyleId: number;
  gameStyleName: string;
}

export interface BoardDetail {
  boardId: number;
  memberId: number;
  profileImage: number;
  gameName: string;
  mannerLevel: number;
  tag: string;
  tier: string;
  rank?: number;
  gameMode: number;
  mainPosition: Position;
  subPosition: Position;
  wantPosition: Position;
  championResponseList?: ChampionResponseDTOList[];
  winRate: number;
  createdAt: string;
  mike: boolean;
}

export interface BoardList {
  totalPage: number;
  totalCount: number;
  boards: BoardDetail[];
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
  tier: string;
  mike: boolean;
  championResponseList?: ChampionResponseDTOList[];
  championResponseDTOList?: ChampionResponseDTOList[];
  gameMode: number;
  mainPosition?: Position;
  subPosition?: Position;
  wantPosition?: Position;
  recentGameCount?: number;
  winRate: number;
  gameStyles: number[];
  contents: string;
  rank?: number;
}

export interface PostReq {
  boardProfileImage: number;
  gameMode: number;
  mainPosition: Position;
  subPosition: Position;
  wantPosition: Position;
  mike: boolean;
  gameStyles: number[];
  contents: string;
}

import { Position } from "@/types/position/position";
import { ApiResponse } from "../api";
import { Mike } from "@/types/user/mike";
import { GameMode } from "@/types/game/gameMode";
import { ChampionResponseDTO } from "../champion/champion";

// 기본 DTO 인터페이스들
export interface MannerKeywordDTO {
  createdAt: string;
  updatedAt: string;
  id: number;
  contents: string;
  positive: boolean;
}

// 기본 플레이어 정보 인터페이스
interface BasePlayerInfo {
  memberId: number;
  profileImage: number;
  gameName: string;
  tag: string;
  // tier?: string;
  // soloTier?: string;
  // freeTier?: string;
}

// 게임 관련 기본 정보 인터페이스
interface GameInfo {
  gameMode: GameMode;
  mainP: Position;
  subP: Position;
  wantP: Position[];
  mike: Mike;
  gameStyles: Array<number>;
}

// 게임 스탯 정보 인터페이스
interface GameStats {
  winRate: number;
  recentGameCount?: number;
  championStatsResponseList?: ChampionResponseDTO[];
}

// 기본 게시글 정보 인터페이스
interface BaseBoardInfo {
  boardId: number;
  contents: string;
  // rank?: number;
  // soloRank?: number;
  // freeRank?: number;
}

// 게시글 목록의 기본 구조
interface BoardListStructure {
  totalPages: number;
  totalCount: number;
}

// 구체적인 인터페이스들
export interface PostsData extends BasePlayerInfo, GameInfo, BaseBoardInfo {
  tier: string;
  rank: number;
}

export interface GetBoardListData extends BoardListStructure {
  boards: Array<BoardDetail>;
}

export interface GetMyBoardListData extends BoardListStructure {
  myBoards: Array<MyBoardDetail>;
}

interface BoardDetail
  extends BasePlayerInfo,
    GameInfo,
    BaseBoardInfo,
    GameStats {
  tier: string;
  rank: number;
  mannerLevel: number;
  createdAt: string;
  bumpTime: string;
}

interface MyBoardDetail extends BasePlayerInfo, BaseBoardInfo, GameStats {
  tier: string;
  rank: number;
  createdAt: string;
  bumpTime: string;
}

export interface MemberPostBoardData
  extends BasePlayerInfo,
    GameInfo,
    BaseBoardInfo,
    GameStats {
  soloTier: string;
  freeTier: string;
  soloRank: number;
  freeRank: number;
  isBlocked: boolean;
  isFriend: boolean;
  friendRequestMemberId: number;
  createdAt: string;
  bumpTime: string; // TODO: 서버 응답 추가 필요
  mannerLevel: number;
  mannerKeywords: MannerKeywordDTO[];
}

export interface NotMemberBoardData
  extends BasePlayerInfo,
    GameInfo,
    BaseBoardInfo,
    GameStats {
  soloTier: string;
  freeTier: string;
  soloRank: number;
  freeRank: number;
  createdAt: string;
  bumpTime: string; // TODO: 서버 응답 추가 필요
  mannerLevel: number;
}

export interface BoardPullUpData {
  boardId: number;
  bumpTime: string;
}

export interface BoardEditData
  extends BasePlayerInfo,
    GameInfo,
    BaseBoardInfo {}

export interface BoardDeleteData {}

// API 응답 타입들
export type PostsResponse = ApiResponse<PostsData>;
export type BoardDeleteResponse = ApiResponse<BoardDeleteData>;
export type BoardPullUpResponse = ApiResponse<BoardPullUpData>;
export type BoardEditResponse = ApiResponse<BoardEditData>;
export type NotMemberBoardResponse = ApiResponse<NotMemberBoardData>;
export type MemberPostBoardResponse = ApiResponse<MemberPostBoardData>;
export type GetBoardListResponse = ApiResponse<GetBoardListData>;
export type GetMyBoardListResponse = ApiResponse<GetMyBoardListData>;

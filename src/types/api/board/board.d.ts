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

interface BoardListCursorStructure {
  cursorId: number;
  hasNext: boolean;
  nextCursor: string;
}

interface MyBoardListStructure {
  totalPage: number;
  totalCount: number;
}

interface MyBoardListCursorStructure {
  size: number;
  hasNext: boolean;
  nextCursor: string;
}

// 구체적인 인터페이스들
export interface PostsData extends BasePlayerInfo, GameInfo, BaseBoardInfo {
  tier: string;
  rank: number;
}

export interface GetBoardListData extends BoardListStructure {
  boards: Array<_BoardDetail>;
}

export interface GetBoardListCursorData extends BoardListCursorStructure {
  boards: Array<_BoardDetail>;
}

export interface GetMyBoardListData extends MyBoardListStructure {
  myBoards: Array<MyBoardDetail>;
}

export interface GetMyBoardListCursorData extends MyBoardListCursorStructure {
  myBoards: Array<MyBoardDetail>;
}

interface _BoardDetail
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
  wantP: (Position | null)[];
  championStatsResponseList?: ChampionResponseDTO[];
  winRate: number;
  createdAt: string;
  bumpTime: string;
  contents: string;
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
  championResponseList?: ChampionResponseDTO[];
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
  bumpTime: string;
  profileImage: number;
  gameName: string;
  tag: string;
  mannerLevel: number;
  mannerKeywords?: MannerKeywordDTO[];
  soloTier?: string;
  freeTier?: string;
  mike: Mike;
  championStatsResponseList?: ChampionResponseDTO[];
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

// API 응답 타입들
export type PostsResponse = ApiResponse<PostsData>;
export type BoardDeleteResponse = ApiResponse<BoardDeleteData>;
export type BoardPullUpResponse = ApiResponse<BoardPullUpData>;
export type BoardEditResponse = ApiResponse<BoardEditData>;
export type NotMemberBoardResponse = ApiResponse<NotMemberBoardData>;
export type MemberPostBoardResponse = ApiResponse<MemberPostBoardData>;
export type GetBoardListResponse = ApiResponse<GetBoardListData>;
export type GetMyBoardListResponse = ApiResponse<GetMyBoardListData>;
export type GetBoardListCursorResponse = ApiResponse<GetBoardListCursorData>;
export type GetMyBoardListCursorResponse =
  ApiResponse<GetMyBoardListCursorData>;

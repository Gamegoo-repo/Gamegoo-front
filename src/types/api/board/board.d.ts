import { Position } from "@/types/position/position";
import { ApiResponse } from "../api";

// 기본 DTO 인터페이스들
interface ChampionResponseDTO {
  championId: number;
  championName: string;
}

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
  tier: string;
}

// 게임 관련 기본 정보 인터페이스
interface GameInfo {
  gameMode: number;
  mainPosition: Position;
  subPosition: Position;
  wantPosition: Position;
  mike: boolean;
  gameStyles: Array<number>;
}

// 게임 스탯 정보 인터페이스
interface GameStats {
  winRate: number;
  recentGameCount?: number;
  championResponseList?: ChampionResponseDTO[];
  championResponseDTOList?: ChampionResponseDTO[];
}

// 기본 게시글 정보 인터페이스
interface BaseBoardInfo {
  boardId: number;
  contents: string;
  rank?: number;
}

// 게시글 목록의 기본 구조
interface BoardListStructure {
  totalPage: number;
  totalCount: number;
}

// 구체적인 인터페이스들
export interface PostsData extends BasePlayerInfo, GameInfo, BaseBoardInfo {}

export interface GetBoardListData extends BoardListStructure {
  boards: Array<BoardDetail>;
}

interface BoardDetail
  extends BasePlayerInfo,
    GameInfo,
    BaseBoardInfo,
    GameStats {
  mannerLevel: number;
  createdAt: string;
}

export interface MemberPostBoardData
  extends BasePlayerInfo,
    GameInfo,
    BaseBoardInfo,
    GameStats {
  isBlocked: boolean;
  isFriend: boolean;
  friendRequestMemberId: number;
  createdAt: string;
  mannerLevel: number;
  mannerKeywords: MannerKeywordDTO[];
}

export interface NotMemberBoardData
  extends BasePlayerInfo,
    GameInfo,
    BaseBoardInfo,
    GameStats {
  createdAt: string;
  mannerLevel: number;
}

export interface BoardEditData
  extends BasePlayerInfo,
    GameInfo,
    BaseBoardInfo {}

export interface BoardDeleteData {}

// API 응답 타입들
export type PostsResponse = ApiResponse<PostsData>;
export type BoardDeleteResponse = ApiResponse<BoardDeleteData>;
export type BoardEditResponse = ApiResponse<BoardEditData>;
export type NotMemberBoardResponse = ApiResponse<NotMemberBoardData>;
export type MemberPostBoardResponse = ApiResponse<MemberPostBoardData>;
export type GetBoardListResponse = ApiResponse<GetBoardListData>;

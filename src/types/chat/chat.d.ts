import { ApiResponse } from "../api";

// data interface

interface chatMessageList {
  senderId: number;
  senderName: string;
  senderProfileImg: number;
  message: string;
  createdAt: string;
  timestamp: number;
}

interface RoomListResponseData {
  chatMessageList: Array<chatMessageList>;
  listSize: number;
  hasNext: boolean;
  nextCursor: null;
}

interface RoomEnterFriendData {
  uuid: string;
  memberId: number;
  gameName: string;
  memberProfileImg: number;
  friend: boolean;
  blocked: boolean;
  blind: boolean;
  friendRequestMemberId: null;
  system: null;
  chatMessageListResponse: RoomListResponseData;
}

interface RoomBoardData {
  uuid: string;
  memberId: number;
  gameName: string;
  memberProfileImg: number;
  friend: boolean;
  blocked: boolean;
  blind: boolean;
  friendRequestMemberId: null;
  system: {
    flag: number;
    boardId: number;
  };
  chatMessageListResponse: RoomListResponseData;
}

interface RoomData {
  chatroomResponseList: Array<{
    chatroomId: number;
    uuid: string;
    targetMemberId: number;
    targetMemberImg: number;
    targetMemberName: string;
    friend: boolean;
    blocked: boolean;
    blind: boolean;
    friendRequestMemberId: null;
    lastMsg: string;
    lastMsgAt: string;
    notReadMsgCnt: number;
    lastMsgTimestamp: number;
  }>;
}

interface EnterData {
  uuid: string;
  memberId: number;
  gameName: string;
  memberProfileImg: number;
  friend: boolean;
  blocked: boolean;
  blind: boolean;
  friendRequestMemberId: null;
  system: null;
  chatMessageListResponse: RoomListResponseData;
}

interface Messages {
  senderId: number;
  senderName: string;
  senderProfileImg: number;
  message: string;
  createdAt: string;
  timestamp: number;
}

interface MessageData {
  chatMessageList: Array<Messages>;
}

// requset

export interface chatRoomExitRequest {
  uuid: string;
}

export interface chatRoomEnterRequest {
  uuid: string;
}

export interface chatRoomReadRequest {
  uuid: string;
  timestamp: null | number;
}

export interface chatRoomMessageRequest {
  uuid: string;
  cursor?: number | null;
}

export interface ChatRoomGetRequest {
  cursor?: number;
}

export interface ChatRoomBoardRequest {
  boardId: number;
}

export interface chatRoomEnterFriendRequest {
  memberId: string;
}

// data

export interface chatRoomExitData {
  status: number;
  message: string;
  data: string;
}

export interface chatRoomReadData {
  status: number;
  message: string;
  data: string;
}

export interface chatRoomSearchUuid {
  status: number;
  message: string;
  data: array<string>;
}

export interface chatRoomMessageData {
  status: number;
  message: string;
  data: MessageData;
}

export interface chatRoomEnterData {
  status: number;
  message: string;
  data: EnterData;
}

export interface chatRoomGetData {
  status: number;
  message: string;
  data: RoomData;
}

export interface chatRoomBoardData {
  status: number;
  message: string;
  data: RoomBoardData;
}

export interface chatRoomFriendData {
  status: nubmer;
  message: string;
  data: RoomEnterFriendData;
}

// response
export type chatRoomExitResponse = ApiResponse<LoginData>;
export type chatRoomReadResponse = ApiResponse<chatRoomReadData>;
export type chatRoomSearchResponse = ApiResponse<chatRoomSearchUuid>;
export type chatRoomMessageResponse = ApiResponse<chatRoomMessageData>;
export type chatRoomEnterResponse = ApiResponse<chatRoomEnterData>;
export type chatRoomGetResponse = ApiResponse<chatRoomGetData>;
export type chatRoomBoardResponse = ApiResponse<chatRoomBoardData>;
export type chatRoomFriendResponse = ApiResponse<chatRoomFriendData>;

import type { ApiResponse } from "../api";

export interface ChatMessageDto {
  senderId: number;
  senderName: string | null;
  senderProfileImg: number | null;
  message: string;
  createdAt: string;
  timestamp: number;
  systemType?: number;
  boardId?: number | null;
}

export interface ChatMessageList {
  chatMessageList: ChatMessageDto[] | [];
  listSize: number;
  hasNext: boolean;
  nextCursor: number | null;
}

// requset

export interface chatRoomExitRequest {
  uuid: string | number;
}

export interface chatRoomEnterRequest {
  uuid: string | number;
}

export interface chatRoomReadRequest {
  uuid: string | number;
  timestamp: null | number;
}

export interface chatRoomMessageRequest {
  uuid: string | number;
  cursor?: number | null;
}

export interface ChatRoomGetRequest {
  cursor?: string | number | null;
}

export interface ChatRoomBoardRequest {
  boardId: string | number;
}

export interface chatRoomEnterFriendRequest {
  memberId: string | number;
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
  data: ChatMessageList;
}

export interface chatRoomEnterData {
  status: number;
  message: string;
  uuid: string;
  memberId: number;
  gameName: string;
  memberProfileImg: number;
  friend: boolean;
  blocked: boolean;
  blind: boolean;
  friendRequestMemberId: number;
  system: System;
  chatMessageListResponse: ChatMessageList;
}

export interface chatRoomGetData {
  status: number;
  message: string;
  has_next: boolean;
  next_cursor: number;
  chatroomResponseList: Array<{
    chatroomId: number;
    uuid: string;
    targetMemberId: number;
    targetMemberImg: number;
    targetMemberName: string;
    friend: boolean;
    blocked: boolean;
    blind: boolean;
    friendRequestMemberId: number;
    lastMsg: string;
    lastMsgAt: string;
    notReadMsgCnt: number;
    lastMsgTimestamp: number;
  }>;
}

export interface chatRoomBoardData {
  status: number;
  message: string;
  uuid: string;
  memberId: number;
  gameName: string;
  memberProfileImg: number;
  friend: boolean;
  blocked: boolean;
  blind: boolean;
  friendRequestMemberId: number;
  system: System;
  chatMessageListResponse: ChatMessageList;
}

export interface chatRoomFriendData {
  status: nubmer;
  message: string;
  uuid: string;
  memberId: number;
  gameName: string;
  memberProfileImg: number;
  friend: boolean;
  blocked: boolean;
  blind: boolean;
  friendRequestMemberId: number;
  system: System;
  chatMessageListResponse: ChatMessageList;
}

export interface ChatroomList {
  blocked: boolean;
  blind: boolean;
  chatroomId: number;
  friend: boolean;
  friendRequestMemberId: number;
  uuid: string;
  targetMemberId: number;
  targetMemberImg: number;
  targetMemberName: string;
  lastMsg: string;
  lastMsgAt: string;
  lastMsgTimestamp: number;
  notReadMsgCnt: number;
}

export interface SystemMessage {
  chatroomUuid?: string;
  senderId: number;
  senderName: null;
  senderProfileImg: null;
  message: string;
  createdAt: string;
  timestamp: number;
  systemType: number;
  boardId?: number | null;
}

export interface DesignedSystemMessage {
  senderId: number;
  senderName: string | null;
  senderProfileImg: null;
  message: string;
  createdAt: null;
  timestamp: null;
  systemType?: number;
  boardId: number;
}

interface System {
  flag: number;
  boardId: number;
}

export interface ChatContent {
  blind: boolean;
  blocked: boolean;
  chatMessageList: ChatMessageList;
  friend: boolean;
  friendRequestMemberId: number;
  gameName: string;
  memberId: number;
  memberProfileImg: number;
  system: System | null;
  uuid: string;
}

export interface Chat {
  uuid: string;
  memberId: number;
  gameName: string;
  memberProfileImg: number;
  friend: boolean;
  blocked: boolean;
  blind: boolean;
  friendRequestMemberId: number;
  systemMessage?: SystemMessage | null;
  system?: System;
  senderId?: number;
  senderName?: string;
  senderProfileImg?: number;
  message?: string;
  createdAt?: string;
  timestamp?: number;
  chatMessageListResponse: ChatMessageList;
}

export interface FriendsList {
  memberId: number;
  name: string;
  memberProfileImg: number;
  liked: boolean;
}

export interface UnreadResponse {
  code: string;
  isSuccess: boolean;
  message: string;
  result: string[];
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

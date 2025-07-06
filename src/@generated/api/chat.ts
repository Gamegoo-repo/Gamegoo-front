import { AuthAxios } from "@/api/auth";

import type {
  ApiResponse,
  ChatMessageListResponse,
  ChatroomListResponse,
  EnterChatroomResponse,
} from "../types";

/* patchChatChatroomUuidRead - 업데이트 */
export const patchChatChatroomUuidRead = async (
  chatroomUuid: number | string,
  timestamp?: number
): Promise<ApiResponse<string>> => {
  const endpoint = `/api/v2/chat/${chatroomUuid}/read`;
  try {
    const response = await AuthAxios.patch(endpoint);
    return response.data;
  } catch (error) {
    console.error("patchChatChatroomUuidRead failed:", error);
    throw error;
  }
};

/* patchChatChatroomUuidExit - 업데이트 */
export const patchChatChatroomUuidExit = async (
  chatroomUuid: number | string
): Promise<ApiResponse<any>> => {
  const endpoint = `/api/v2/chat/${chatroomUuid}/exit`;
  try {
    const response = await AuthAxios.patch(endpoint);
    return response.data;
  } catch (error) {
    console.error("patchChatChatroomUuidExit failed:", error);
    throw error;
  }
};

/* getChatroom - 조회 */
export const getChatroom = async (): Promise<
  ApiResponse<ChatroomListResponse>
> => {
  const endpoint = "/api/v2/chatroom";
  try {
    const response = await AuthAxios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("getChatroom failed:", error);
    throw error;
  }
};

/* getChatChatroomUuidMessages - 조회 */
export const getChatChatroomUuidMessages = async (
  chatroomUuid: number | string,
  cursor?: number
): Promise<ApiResponse<ChatMessageListResponse>> => {
  const endpoint = `/api/v2/chat/${chatroomUuid}/messages`;
  try {
    const response = await AuthAxios.get(endpoint, { params: { cursor } });
    return response.data;
  } catch (error) {
    console.error("getChatChatroomUuidMessages failed:", error);
    throw error;
  }
};

/* getChatChatroomUuidEnter - 조회 */
export const getChatChatroomUuidEnter = async (
  chatroomUuid: number | string
): Promise<ApiResponse<EnterChatroomResponse>> => {
  const endpoint = `/api/v2/chat/${chatroomUuid}/enter`;
  try {
    const response = await AuthAxios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("getChatChatroomUuidEnter failed:", error);
    throw error;
  }
};

/* getChatUnread - 조회 */
export const getChatUnread = async (): Promise<ApiResponse<string[]>> => {
  const endpoint = "/api/v2/chat/unread";
  try {
    const response = await AuthAxios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("getChatUnread failed:", error);
    throw error;
  }
};

/* getChatStartMemberMemberId - 조회 */
export const getChatStartMemberMemberId = async (
  memberId: number | string
): Promise<ApiResponse<EnterChatroomResponse>> => {
  const endpoint = `/api/v2/chat/start/member/${memberId}`;
  try {
    const response = await AuthAxios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("getChatStartMemberMemberId failed:", error);
    throw error;
  }
};

/* getChatStartBoardBoardId - 조회 */
export const getChatStartBoardBoardId = async (
  boardId: number | string
): Promise<ApiResponse<EnterChatroomResponse>> => {
  const endpoint = `/api/v2/chat/start/board/${boardId}`;
  try {
    const response = await AuthAxios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("getChatStartBoardBoardId failed:", error);
    throw error;
  }
};

import { AuthAxios } from "@/api";

import type {
  ApiResponse,
  ChatCreateRequest,
  ChatCreateResponse,
} from "../types";

/* postInternalMemberIdChatChatroomUuid - 생성 */
export const postInternalMemberIdChatChatroomUuid = async (
  memberId: number | string,
  chatroomUuid: number | string,
  data: ChatCreateRequest
): Promise<ApiResponse<ChatCreateResponse>> => {
  const endpoint = `/api/v2/internal/${memberId}/chat/${chatroomUuid}`;
  try {
    const response = await AuthAxios.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("postInternalMemberIdChatChatroomUuid failed:", error);
    throw error;
  }
};

/* getInternalMemberIdChatroomUuid - 조회 */
export const getInternalMemberIdChatroomUuid = async (
  memberId: number | string
): Promise<ApiResponse<string[]>> => {
  const endpoint = `/api/v2/internal/${memberId}/chatroom/uuid`;
  try {
    const response = await AuthAxios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("getInternalMemberIdChatroomUuid failed:", error);
    throw error;
  }
};

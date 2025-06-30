import {
  chatRoomExitResponse,
  chatRoomReadRequest,
  chatRoomSearchResponse,
  chatRoomExitRequest,
  chatRoomReadData,
  chatRoomMessageRequest,
  chatRoomMessageData,
  chatRoomEnterRequest,
  chatRoomEnterResponse,
  ChatRoomGetRequest,
  chatRoomGetResponse,
  ChatRoomBoardRequest,
  chatRoomBoardResponse,
  chatRoomEnterFriendRequest,
  chatRoomFriendResponse,
} from "@/types/api/chat/chat";
import { AuthAxios } from "../auth";

/* 채팅방 목록 조회 */
export const getChatrooms = async ({
  cursor,
}: ChatRoomGetRequest): Promise<chatRoomGetResponse> => {
  const url = cursor ? `/api/v2/chatroom?cursor=${cursor}` : `/api/v2/chatroom`;

  try {
    const response = await AuthAxios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* 대화방에서 채팅방 입장 */
export const enterUsingUuid = async ({
  uuid,
}: chatRoomEnterRequest): Promise<chatRoomEnterResponse> => {
  try {
    const response = await AuthAxios.get(`/api/v2/chat/${uuid}/enter`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* 친구 목록에서 채팅방 입장 */
export const enterUsingMemberId = async ({
  memberId,
}: chatRoomEnterFriendRequest): Promise<chatRoomFriendResponse> => {
  try {
    const response = await AuthAxios.get(
      `/api/v2/chat/start/member/${memberId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* 게시글에서 채팅방 입장 */
export const enterUsingBoardId = async ({
  boardId,
}: ChatRoomBoardRequest): Promise<chatRoomBoardResponse> => {
  try {
    const response = await AuthAxios.get(`/api/v2/chat/start/board/${boardId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* 채팅 내역 조회 */
export const getChatList = async ({
  uuid,
  cursor,
}: chatRoomMessageRequest): Promise<chatRoomMessageData> => {
  const url = cursor
    ? `/api/v2/chat/${uuid}/messages?cursor=${cursor}`
    : `/api/v2/chat/${uuid}/messages`;
  try {
    const response = await AuthAxios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* 채팅방 나가기 */
export const leaveChatroom = async ({
  uuid,
}: chatRoomExitRequest): Promise<chatRoomExitResponse> => {
  try {
    const response = await AuthAxios.patch(`/api/v2/chat/${uuid}/exit`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* 채팅방 읽음 처리 */
export const markChatAsRead = async ({
  uuid,
  timestamp,
}: chatRoomReadRequest): Promise<chatRoomReadData> => {
  const url = timestamp
    ? `/api/v2/chat/${uuid}/read?timestamp=${timestamp}`
    : `/api/v2/chat/${uuid}/read`;
  try {
    const response = await AuthAxios.patch(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* 안 읽은 채팅방 uuid 가져오기 */
export const getUnreadUuid = async (): Promise<chatRoomSearchResponse> => {
  try {
    const response = await AuthAxios.get("/api/v2/chat/unread");
    return response.data;
  } catch (error) {
    throw error;
  }
};

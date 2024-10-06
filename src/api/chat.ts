import Axios from ".";
import { AuthAxios } from "./auth";

/* 채팅방 목록 조회 */
export const getChatrooms = async (cursor?: number) => {
    const url = cursor ? `/v1/member/chatroom?cursor=${cursor}` : `/v1/member/chatroom`;

    try {
        const response = await AuthAxios.get(url);
        console.log("채팅방 목록 조회 완료:", response.data);
        return response.data;
    } catch (error) {
        console.error("채팅방 목록 조회 실패:", error);
        throw error;
    }
};

/* 대화방에서 채팅방 입장 */
export const enterUsingUuid = async (uuid: string) => {
    try {
        const response = await AuthAxios.get(`/v1/chat/${uuid}/enter`);
        console.log("채팅방 입장 성공:", response.data);
        return response.data;
    } catch (error) {
        console.error("채팅방 입장 실패:", error);
        throw error;
    }
};

/* 친구 목록에서 채팅방 입장 */
export const enterUsingMemberId = async (memberId: number) => {
    try {
        const response = await AuthAxios.get(`/v1/chat/start/member/${memberId}`);
        console.log("채팅방 입장 성공:", response.data);
        return response.data;
    } catch (error) {
        console.error("채팅방 입장 실패:", error);
        throw error;
    }
};

/* 게시글에서 채팅방 입장 */
export const enterUsingBoardId = async (boardId: number) => {
    try {
        const response = await AuthAxios.get(`/v1/chat/start/board/${boardId}`);
        console.log("채팅방 입장 성공:", response.data);
        return response.data;
    } catch (error) {
        console.error("채팅방 입장 실패:", error);
        throw error;
    }
};

/* 채팅 내역 조회 */
export const getChatList = async (uuid: string, cursor?: number | null) => {
    const url = cursor ? `/v1/chat/${uuid}/messages?cursor=${cursor}` : `/v1/chat/${uuid}/messages`;
    try {
        const response = await AuthAxios.get(url);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/* 채팅방 나가기 */
export const leaveChatroom = async (uuid: string) => {
    try {
        const response = await AuthAxios.patch(`/v1/chat/${uuid}/exit `);
        console.log("채팅방 나가기 성공:", response.data);
        return response.data;
    } catch (error) {
        console.error("채팅방 나가기 실패:", error);
        throw error;
    }
};

/* 채팅방 읽음 처리 */
export const markChatAsRead = async (uuid: string, timestamp = null) => {
    const url = timestamp
        ? `/v1/chat/${uuid}/read?timestamp=${timestamp}`
        : `/v1/chat/${uuid}/read`;
    try {
        const response = await AuthAxios.patch(url);
        console.log("채팅 메시지 읽음 처리 성공:", response.data);
        return response.data;
    } catch (error) {
        console.error("채팅 메시지 읽음 처리 실패:", error);
        throw error;
    }
};

/* 안 읽은 채팅방 uuid 가져오기 */
export const getUnreadUuid = async () => {
    try {
        const response = await AuthAxios.get('/v1/chat/unread');
        return response.data;
    } catch (error) {
        throw error;
    }
};

/* 친구 검색 */
export const searchFriend = async (user: string) => {
    try {
        const response = await AuthAxios.get(`/v1/friends/search?query=${user}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
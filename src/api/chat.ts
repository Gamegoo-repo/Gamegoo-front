import Axios from ".";
import { AuthAxios } from "./auth";

/* 채팅방 목록 조회 */
export const getChatrooms = async () => {
    try {
        const response = await AuthAxios.get("/v1/member/chatroom");
        console.log("채팅방 목록 조회 완료:", response.data);
        return response.data;
    } catch (error) {
        console.error("채팅방 목록 조회 실패:", error);
        throw error;
    }
};

/* 대화방에서 채팅방 입장 */
export const enterUsingUuid = async (chatroomUuid: string) => {
    try {
        const response = await AuthAxios.get(`/v1/chat/${chatroomUuid}/enter`);
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

/* 채팅방 나가기 */
export const leaveChatroom = async (chatroomUuid: string) => {
    try {
        const response = await AuthAxios.patch(`/v1/chat/${chatroomUuid}/exit `);
        console.log("채팅방 나가기 성공:", response.data);
        return response.data;
    } catch (error) {
        console.error("채팅방 나가기 실패:", error);
        throw error;
    }
};
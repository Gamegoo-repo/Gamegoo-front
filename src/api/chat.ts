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
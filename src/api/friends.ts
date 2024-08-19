import { AuthAxios } from "./auth";
import Axios from ".";

/* 친구 요청 */
export const reqFriend = async (memberId: number) => {
    try {
        const response = await AuthAxios.post(`/v1/friends/request/${memberId}`);
        console.log("친구 요청 완료:", response.data);
        return response.data;
    } catch (error) {
        console.error("친구 요청 실패:", error);
        throw error;
    }
};

/* 친구 요청 취소 */
export const cancelFriendReq = async (memberId: number) => {
    try {
        const response = await Axios.delete(`/v1/friends/request/${memberId}`);
        console.log("친구 요청 취소 성공:", response.data);
        return response.data;
    } catch (error) {
        console.error("친구 요청 취소 실패:", error);
        throw error;
    }
}


/* 친구 삭제 */
export const deleteFriend = async (memberId: number) => {
    try {
        const response = await Axios.delete(`/v1/friends/${memberId}`);
        console.log("친구 삭제 완료:", response.data);
        return response.data;
    } catch (error) {
        console.error("친구 삭제 실패:", error);
        throw error;
    }
};

/* 친구 목록 조회 */
export const getFriendsList = async () => {
    try {
        const response = await Axios.get(`/v1/friends`);
        console.log("친구 목록 조회 완료:", response.data);
        return response.data;
    } catch (error) {
        console.error("친구 목록 조회 실패:", error);
        throw error;
    }
};

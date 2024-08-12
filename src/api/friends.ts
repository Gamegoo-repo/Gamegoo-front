import { AuthAxios } from "./auth";

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


export const deleteFriend = async (memberId: number) => {
    try {
        const response = await AuthAxios.delete(`/v1/friends/${memberId}`);
        console.log("친구 삭제 완료:", response.data);
        return response.data;
    } catch (error) {
        console.error("친구 삭제 실패:", error);
        throw error;
    }
};
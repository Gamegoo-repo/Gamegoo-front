import { AuthAxios } from "./auth";
import Axios from ".";
import { notify } from "@/hooks/notify";

/* 친구 요청 */
export const reqFriend = async (memberId: number) => {
    try {
        const response = await AuthAxios.post(`/v1/friends/request/${memberId}`);
        console.log("친구 요청 완료:", response.data);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.code === "FRIEND403") {
          const errorMessage = "나를 차단한 회원입니다.\n친구 요청을 보낼 수 없습니다.";

          notify({ text: errorMessage, icon: '🚫', type: 'error' });
          console.error(errorMessage);
        } else {
          console.error("친구 요청 실패:", error);
        }
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

/* 친구 요청 수락 */
export const acceptFreindReq = async (memberId: number) => {
    try {
        const response = await AuthAxios.patch(`/v1/friends/request/${memberId}/accept`);
        console.log("친구 요청 수락 성공:", response.data);
        return response.data;
    } catch (error) {
        console.log("친구 요청 수락 실패:", error);
        throw error;
    }
};

/* 친구 요청 거절 */
export const rejectFreindReq = async (memberId: number) => {
    try {
        const response = await AuthAxios.patch(`/v1/friends/request/${memberId}/reject`);
        console.log("친구 요청 거절 성공:", response.data);
        return response.data;
    } catch (error) {
        console.log("친구 요청 거절 실패:", error);
        throw error;
    }
};

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
        return response.data;
    } catch (error) {
        throw error;
    }
};

/* 친구 즐겨찾기 추가 */
export const likeFriend = async (memberId: number) => {
    try {
        const response = await AuthAxios.patch(`/v1/friends/${memberId}/star`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/* 친구 즐겨찾기 해제 */
export const unLikeFriend = async (memberId: number) => {
    try {
        const response = await AuthAxios.delete(`/v1/friends/${memberId}/star`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
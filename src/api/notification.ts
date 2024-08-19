import { AuthAxios } from "./auth";

/* 알림 전체 목록 조회 */
export const getNotiTotal = async (page: number) => {
    const endpoint = `/v1/notification/total?page=${page}`;
    try {
      const response = await AuthAxios.get(endpoint);
      console.log("알림 전체 목록 조회 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("알림 전체 목록 조회 실패:", error);
      throw error;
    }
  };

/* 알림 읽음 처리 */
export const readNoti = async (notificationId:number) => {
    const endpoint = `/v1/notification/${notificationId}`;
    try {
      const response = await AuthAxios.patch(endpoint);
      console.log("알림 읽음 처리 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("알림 읽음 처리 실패:", error);
      throw error;
    }
  };

/* 안 읽은 알림 개수 조회 */
export const getNotiCount = async () => {
    const endpoint = '/v1/notification/unread/count';
    try {
      const response = await AuthAxios.get(endpoint);
      console.log("안 읽은 알림 개수 조회 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("안 읽은 알림 개수 조회 실패:", error);
      throw error;
    }
  };

/* 알림 모달 목록 조회 (cursor) */
export const getNotiModal = async (cursor: number|null) => {
    const endpoint = cursor? `/v1/notification?cursor=${cursor}`:'/v1/notification';
    try {
      const response = await AuthAxios.get(endpoint);
      console.log("알림 모달 목록 조회 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("알림 모달 목록 조회 실패:", error);
      throw error;
    }
  };
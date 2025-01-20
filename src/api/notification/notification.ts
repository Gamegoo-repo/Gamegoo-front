import { AuthAxios } from "../auth";
import { PopupNotificationResponse, ReadNotificationResponse, TotalNotificationResponse, UnreadNotificationCountResponse } from "@/types/api/notification/notification";

/* 알림 전체 목록 조회 */
export const getTotalNotification = async (
  page: number
): Promise<TotalNotificationResponse> => {
  const endpoint = `/api/v2/notification/total?page=${page}`;
  try {
    const response = await AuthAxios.get(endpoint);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* 알림 읽음 처리 */
export const patchReadNotification = async (notificationId: number): Promise<ReadNotificationResponse> => {
  const endpoint = `/api/v2/notification/${notificationId}`;
  try {
    const response = await AuthAxios.patch(endpoint);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* 안 읽은 알림 개수 조회 */
export const getUnreadNotificationCount =
  async (): Promise<UnreadNotificationCountResponse> => {
    const endpoint = "/api/v2/notification/unread/count";
    try {
      const response = await AuthAxios.get(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

/* 알림 팝업 목록 조회 */
export const getPopupNotification = async (
  cursor: number | null
): Promise<PopupNotificationResponse> => {
  const endpoint = cursor
    ? `/api/v2/notification?cursor=${cursor}`
    : "/api/v2/notification";
  try {
    const response = await AuthAxios.get(endpoint);
    return response.data;
  } catch (error) {
    throw error;
  }
};
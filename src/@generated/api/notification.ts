import Axios from "@/api/api";

import type {
  ApiResponse,
  NotificationCursorListResponse,
  NotificationPageListResponse,
  ReadNotificationResponse,
} from "../types";

/* patchNotificationNotificationId - 업데이트 */
export const patchNotificationNotificationId = async (
  notificationId: number | string
): Promise<ApiResponse<ReadNotificationResponse>> => {
  const endpoint = `/api/v2/notification/${notificationId}`;
  try {
    const response = await Axios.patch(endpoint);
    return response.data;
  } catch (error) {
    console.error("patchNotificationNotificationId failed:", error);
    throw error;
  }
};

/* getNotification - 조회 */
export const getNotification = async (
  cursor?: number
): Promise<ApiResponse<NotificationCursorListResponse>> => {
  const endpoint = "/api/v2/notification";
  try {
    const response = await Axios.get(endpoint, { params: { cursor } });
    return response.data;
  } catch (error) {
    console.error("getNotification failed:", error);
    throw error;
  }
};

/* getNotificationUnreadCount - 조회 */
export const getNotificationUnreadCount = async (): Promise<
  ApiResponse<number>
> => {
  const endpoint = "/api/v2/notification/unread/count";
  try {
    const response = await Axios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("getNotificationUnreadCount failed:", error);
    throw error;
  }
};

/* getNotificationTotal - 조회 */
export const getNotificationTotal = async (
  page: number
): Promise<ApiResponse<NotificationPageListResponse>> => {
  const endpoint = "/api/v2/notification/total";
  try {
    const response = await Axios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("getNotificationTotal failed:", error);
    throw error;
  }
};

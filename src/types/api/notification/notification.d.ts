import { Notification } from "@/types/notification/notification";
import { ApiResponse } from "../api";

interface TotalNotificationData {
  notificationList: [
    {
      notificationId: number;
      notificationType: number;
      content: string;
      pageUrl: string;
      read: boolean;
      createdAt: string;
    }
  ];
  listSize: number;
  totalPage: number;
  totalElements: number;
  isFirst: boolean;
  isLast: boolean;
}

interface ReadNotificationData {
    notificationId: number;
  message: string;
}

interface PopupNotificationData {
  notificationList: Notification[];
  listSize: number;
  hasNext: boolean;
  nextCursor: number;
}

export type TotalNotificationResponse = ApiResponse<TotalNotificationData>;
export type ReadNotificationResponse = ApiResponse<ReadNotificationData>;
export type UnreadNotificationCountResponse = ApiResponse<number>;
export type PopupNotificationResponse = ApiResponse<PopupNotificationData>;
export interface Notification {
  notificationId: number;
  notificationType: number;
  content: string;
  pageUrl: string;
  read: boolean;
  createdAt: string;
}
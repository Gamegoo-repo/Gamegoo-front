import {
  AuthControllerApi,
  BlockApi,
  FriendApi,
  MemberApi,
  NotificationApi,
  PasswordControllerApi,
  ReportApi,
  RiotApi,
} from "@generated";
import { EmailApi } from "@generated/apis/EmailApi";

export const emailApi = new EmailApi();

export const riotApi = new RiotApi();

export const authApi = new AuthControllerApi();

export const memberApi = new MemberApi();

export const blockApi = new BlockApi();

export const notificationApi = new NotificationApi();

export const passwordApi = new PasswordControllerApi();

export const friendApi = new FriendApi();

export const reportApi = new ReportApi();

import {
  AuthControllerApi,
  BlockApi,
  Configuration,
  FriendApi,
  MemberApi,
  NotificationApi,
  PasswordControllerApi,
  ReportApi,
  RiotApi,
} from "@generated";
import { EmailApi } from "@generated/apis/EmailApi";

import { authMiddleware } from "./authMiddleware";

// API 클라이언트 공통 설정
const apiConfig = new Configuration({
  basePath: process.env.NEXT_PUBLIC_BASE_URL,
  credentials: "include", // 쿠키 포함
  headers: {
    "Content-Type": "application/json",
  },
  middleware: [authMiddleware],
});

export const emailApi = new EmailApi(apiConfig);

export const riotApi = new RiotApi(apiConfig);

export const authApi = new AuthControllerApi(apiConfig);

export const memberApi = new MemberApi(apiConfig);

export const blockApi = new BlockApi(apiConfig);

export const notificationApi = new NotificationApi(apiConfig);

export const passwordApi = new PasswordControllerApi(apiConfig);

export const friendApi = new FriendApi(apiConfig);

export const reportApi = new ReportApi(apiConfig);

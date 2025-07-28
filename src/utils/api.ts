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
  // authMiddleware를 통해 토큰 관리 처리
  middleware: [authMiddleware],
});

// 토큰 재발급을 위한 별도 설정 (middleware 없이)
const authOnlyConfig = new Configuration({
  basePath: process.env.NEXT_PUBLIC_BASE_URL,
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
});

export const emailApi = new EmailApi(apiConfig);

export const riotApi = new RiotApi(apiConfig);

// 토큰 재발급 API는 middleware 없이 사용 (무한 루프 방지)
export const authApi = new AuthControllerApi(authOnlyConfig);

export const memberApi = new MemberApi(apiConfig);

export const blockApi = new BlockApi(apiConfig);

export const notificationApi = new NotificationApi(apiConfig);

export const passwordApi = new PasswordControllerApi(apiConfig);

export const friendApi = new FriendApi(apiConfig);

export const reportApi = new ReportApi(apiConfig);

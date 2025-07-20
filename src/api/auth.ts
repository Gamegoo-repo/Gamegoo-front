import axios from "axios";

import ko from "@/constants/ko.json";
import { notify } from "@/hooks/notify";
import { connectSocket } from "@/socket";
import { clearTokens, getAccessToken } from "@/utils/storage";



import { BASE_URL } from "./api";



import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { refreshAndStoreToken } from "@/utils";


/* AuthAxios 인스턴스 생성 */
export const AuthAxios: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});

/* AuthAxios 요청 인터셉터 */
AuthAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* AuthAxios 응답 인터셉터 */
AuthAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const {
      config,
      response: { status },
    } = error;

    /* 토큰 만료 시 */
    if (status === 401) {
      console.log("AuthAxios 401 Error Response Interceptor");

      try {
        /* 토큰 재발급 요청 */
        const newAccessToken = await refreshAndStoreToken();
        if (!newAccessToken)
          throw new Error("재발급된 accessToken이 없습니다.");

        const originRequest = config; // 이전 요청 저장
        originRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        
        connectSocket();

        return axios(originRequest);
      } catch (reissueError: any) {
        if (reissueError.response && reissueError.response.status === 404) {
          notify({ text: ko["login.expired"], icon: "🚫", type: "error" });
        } else {
          notify({ text: ko["common.error"], icon: "🚫", type: "error" });
        }
        // 토큰 재발급 실패 시 처리
        console.error("토큰 재발급 실패:", reissueError);
        clearTokens(); // 저장된 토큰 삭제
        window.location.replace("/riot"); // 로그인 페이지로 이동
      }
    }
    return Promise.reject(error);
  }
);
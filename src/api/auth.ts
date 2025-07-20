import axios from "axios";



import { postAuthRefresh } from "@/@generated/api";
import ko from "@/constants/ko.json";
import { STORAGE_KEY } from "@/constants/storage";
import { notify } from "@/hooks/notify";
import { connectSocket } from "@/socket";
import { clearTokens, getAccessToken, getRefreshToken } from "@/utils/storage";



import { BASE_URL } from "./api";



import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";


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
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw new Error("리프레시 토큰이 없습니다.");

        const response = await postAuthRefresh({ refreshToken });
        
        if (!response.data) throw new Error("토큰 재발급 응답에 데이터가 없습니다.");

        const {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        } = response.data;

        const originRequest = config; // 이전 요청 저장

        // 로컬 또는 세션에 재발급된 토큰 저장
        const storage = localStorage.getItem(STORAGE_KEY.accessToken)
          ? localStorage
          : sessionStorage;
        storage.setItem(STORAGE_KEY.accessToken, newAccessToken ?? "");
        storage.setItem(STORAGE_KEY.refreshToken, newRefreshToken ?? "");

        connectSocket();
        originRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
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
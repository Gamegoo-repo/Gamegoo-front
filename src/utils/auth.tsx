import { STORAGE_KEY } from "@/constants/storage";

import { authApi } from "./api";
import { getRefreshToken } from "./storage";

export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiryTime = payload.exp * 1000;
    const currentTime = Date.now();

    console.log("Token Expiry Time:", expiryTime);
    console.log("Current Time:", currentTime);
    console.log(currentTime > expiryTime);
    return currentTime > expiryTime;
  } catch (error) {
    console.error("Failed to parse token:", error);
    return true;
  }
};

export const refreshAndStoreToken = async (): Promise<string | null> => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error("리프레시 토큰이 없습니다.");

    const response = await authApi.updateToken({
      refreshTokenRequest: { refreshToken },
    });
    if (!response.data)
      throw new Error("토큰 재발급 응답에 데이터가 없습니다.");

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      response.data;

    const storage = localStorage.getItem(STORAGE_KEY.accessToken)
      ? localStorage
      : sessionStorage;

    storage.setItem(STORAGE_KEY.accessToken, newAccessToken ?? "");
    storage.setItem(STORAGE_KEY.refreshToken, newRefreshToken ?? "");

    return newAccessToken ?? null;
  } catch (error) {
    console.error("토큰 재발급 실패:", error);
    return null;
  }
};

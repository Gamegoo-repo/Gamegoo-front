import { useEffect } from "react";
import { connectSocket, socket } from "@/socket";
import { reissueToken } from "@/api/reissue/reissue";
import { STORAGE_KEY } from "@/constants/storage";

const useJwtError = () => {
  useEffect(() => {
    // 소켓 연결되어 있지 않으면 소켓 연결
    if (!socket) {
      connectSocket();
    }

    const handleJwtExpiredError = async (res: any) => {
      const { eventName, eventData } = res.data;

      try {
        const response = await reissueToken();
        const newToken = response.data.accessToken;

        // 로컬 또는 세션에 재발급된 토큰 저장
        if (localStorage.getItem(STORAGE_KEY.accessToken)) {
          localStorage.setItem(
            STORAGE_KEY.accessToken,
            response.data.accessToken
          );
          localStorage.setItem(
            STORAGE_KEY.refreshToken,
            response.data.refreshToken
          );
        } else {
          sessionStorage.setItem(
            STORAGE_KEY.accessToken,
            response.data.accessToken
          );
          sessionStorage.setItem(
            STORAGE_KEY.refreshToken,
            response.data.refreshToken
          );
        }
        socket?.emit(eventName, { ...eventData, token: newToken });
      } catch (error) {
        console.error("소켓 이벤트 전송 실패:", error);
      }
    };

    const handleConnectionJwtError = async () => {
      try {
        const response = await reissueToken();
        const newToken = response.data.accessToken;

        // 로컬 또는 세션에 재발급된 토큰 저장
        if (localStorage.getItem(STORAGE_KEY.accessToken)) {
          localStorage.setItem(
            STORAGE_KEY.accessToken,
            response.data.accessToken
          );
          localStorage.setItem(
            STORAGE_KEY.refreshToken,
            response.data.refreshToken
          );
        } else {
          sessionStorage.setItem(
            STORAGE_KEY.accessToken,
            response.data.accessToken
          );
          sessionStorage.setItem(
            STORAGE_KEY.refreshToken,
            response.data.refreshToken
          );
        }
        socket?.emit("connection-update-token", { token: newToken });
      } catch (error) {
        console.error("연결 업데이트 실패:", error);
      }
    };

    socket?.on("connection-jwt-error", handleConnectionJwtError);
    socket?.on("jwt-expired-error", handleJwtExpiredError);

    return () => {
      socket?.off("connection-jwt-error", handleConnectionJwtError);
      socket?.off("jwt-expired-error", handleJwtExpiredError);
    };
  }, []);
};

export default useJwtError;

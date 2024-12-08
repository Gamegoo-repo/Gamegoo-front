import { useEffect } from 'react';
import { connectSocket, socket } from '@/socket';
import { reissueToken } from '@/api/auth';

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
              const newToken = response.result.accessToken;
                
              // 로컬 또는 세션에 재발급된 토큰 저장
              if (localStorage.getItem("accessToken")) {
                localStorage.setItem("accessToken", response.result.accessToken);
                localStorage.setItem(
                  "refreshToken",
                  response.result.refreshToken
                );
              } else {
                sessionStorage.setItem(
                  "accessToken",
                  response.result.accessToken
                );
                sessionStorage.setItem(
                  "refreshToken",
                  response.result.refreshToken
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
            const newToken = response.result.accessToken;

            // 로컬 또는 세션에 재발급된 토큰 저장
            if (localStorage.getItem("accessToken")) {
              localStorage.setItem("accessToken", response.result.accessToken);
              localStorage.setItem(
                "refreshToken",
                response.result.refreshToken
              );
            } else {
              sessionStorage.setItem(
                "accessToken",
                response.result.accessToken
              );
              sessionStorage.setItem(
                "refreshToken",
                response.result.refreshToken
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
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { socket } from "@/socket";
import useChatMessage from "@/hooks/useChatMessage";
import useChatFriend from "@/hooks/useChatFriend";
import { reissueToken } from "@/api/auth";
import { getAccessToken } from "@/utils/storage";
import { isTokenExpired } from "@/utils/auth";

const SocketConnection: React.FC = () => {
  const dispatch = useDispatch();

  useChatMessage();
  useChatFriend();

  useEffect(() => {
    const onConnect = () => {
      const socketId = socket?.id || "";
      sessionStorage.setItem("gamegooSocketId", socketId);
    };

    const onDisconnect = () => {
      console.error("소켓 끊김");
    };

    const handleJwtExpiredError = async (data: any) => {
      const { eventName, eventData } = data;
      try {
        const currentToken = getAccessToken();
        // 토큰이 없을 경우 토큰 재발급
        if (!currentToken || isTokenExpired(currentToken)) {
          const response = await reissueToken();
          const newToken = response.result.refreshToken;
          console.log('newToken', newToken);
          socket?.emit(eventName, { ...eventData, token: newToken });
        }
      } catch (error) {
        console.error("토큰 재발급 실패:", error);
      }
    };

    const handleConnectionJwtError = async () => {
      try {
        const currentToken = getAccessToken();

        // 토큰이 없을 경우 토큰 재발급
        if (!currentToken || isTokenExpired(currentToken)) {
          const response = await reissueToken();
          const newToken = response.result.refreshToken;
          socket?.emit("connection-update-token", { token: newToken });
        }
      } catch (error) {
        console.error("토큰 재발급 실패:", error);
      }
    };

    if (socket?.connected) {
      onConnect();
    }

    socket?.on("connect", onConnect);
    socket?.on("disconnect", onDisconnect);
    socket?.on("connection-jwt-error", handleConnectionJwtError);
    socket?.on("jwt-expired-error", handleJwtExpiredError);
    return () => {
      socket?.off("connect", onConnect);
      socket?.off("disconnect", onDisconnect);
      socket?.off("connection-jwt-error", handleConnectionJwtError);
      socket?.off("jwt-expired-error", handleJwtExpiredError);
    };
  }, [dispatch]);

  return null;
};

export default SocketConnection;

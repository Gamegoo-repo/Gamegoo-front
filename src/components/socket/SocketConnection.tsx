import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { socket } from "@/socket";
import useChatMessage from "@/hooks/useChatMessage";
import useChatFriend from "@/hooks/useChatFriend";
import { reissueToken } from "@/api/auth";
import { getAccessToken } from "@/utils/storage";

const SocketConnection: React.FC = () => {
  const dispatch = useDispatch();

  useChatMessage();
  useChatFriend();

  useEffect(() => {
    const onConnect = () => {
      const socketId = socket?.id || "";
      sessionStorage.setItem("gamegooSocketId", socketId);
    }

    const onDisconnect = () => {
      console.error("소켓 끊김");
    }

    const handleJwtExpiredError = async (data: any) => {
      const { eventName, eventData } = data;
      try {
        const currentToken = getAccessToken();

        // 현재 저장된 토큰이 만료되었는지 확인하고 재발급
        if (!currentToken) {
          const response = await reissueToken();
          socket?.emit(eventName, { ...eventData, token: response.result.accessToken; });
        } else {
          socket?.emit(eventName, { ...eventData, token: currentToken });
        }
      } catch (error) {
        console.error("토큰 재발급 실패:", error);
      }
    }

    const handleConnectionJwtError = async () => {
      try {
        const currentToken = getAccessToken();

        // 현재 저장된 토큰이 만료되었는지 확인하고 재발급
        if (!currentToken) {
          const response = await reissueToken();
          socket?.emit("connection-update-token", { token: response.result.accessToken });
        } else {
          socket?.emit("connection-update-token", { token: currentToken });
        }
      } catch (error) {
        console.error("토큰 재발급 실패:", error);
      }
    }

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

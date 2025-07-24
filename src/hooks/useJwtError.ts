import { useEffect } from "react";

import { connectSocket, socket } from "@/socket";
import { refreshAndStoreToken } from "@/utils";

const useJwtError = () => {
  useEffect(() => {
    // 소켓 연결되어 있지 않으면 소켓 연결
    if (!socket) {
      connectSocket();
    }

    const handleJwtExpiredError = async (res: any) => {
      const { eventName, eventData } = res.data;

      const newAccessToken = await refreshAndStoreToken();
      if (!newAccessToken) return;

      socket?.emit(eventName, { ...eventData, token: newAccessToken });

    };

    const handleConnectionJwtError = async () => {
      const newAccessToken = await refreshAndStoreToken();
      if (!newAccessToken) return;

      socket?.emit("connection-update-token", { token: newAccessToken });
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
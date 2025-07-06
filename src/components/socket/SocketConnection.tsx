import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import useChatFriend from "@/hooks/useChatFriend";
import useChatMessage from "@/hooks/useChatMessage";
import useJwtError from "@/hooks/useJwtError";
import { socket } from "@/socket";

const SocketConnection: React.FC = () => {
  const dispatch = useDispatch();

  useChatMessage();
  useChatFriend();
  useJwtError();

  useEffect(() => {
    const onConnect = () => {
      const socketId = socket?.id || "";
      sessionStorage.setItem("gamegooSocketId", socketId);
    };

    const onDisconnect = () => {
      console.error("소켓 끊김");
    };

    if (socket?.connected) {
      onConnect();
    }

    socket?.on("connect", onConnect);
    socket?.on("disconnect", onDisconnect);
    return () => {
      socket?.off("connect", onConnect);
      socket?.off("disconnect", onDisconnect);
    };
  }, [dispatch]);

  return null;
};

export default SocketConnection;

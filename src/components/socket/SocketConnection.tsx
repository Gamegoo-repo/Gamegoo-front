import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { STORAGE_KEY } from "@/constants/storage";
import { useChatFriend, useChatMessage, useJwtError } from "@/hooks";
import { socket } from "@/socket";

import type React from "react";

const SocketConnection: React.FC = () => {
  const dispatch = useDispatch();

  useChatMessage();
  useChatFriend();
  useJwtError();

  useEffect(() => {
    const onConnect = () => {
      const socketId = socket?.id || "";
      sessionStorage.setItem(STORAGE_KEY.gamegooSocketId, socketId);
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

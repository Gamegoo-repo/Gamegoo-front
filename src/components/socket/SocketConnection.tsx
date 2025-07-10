import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { socket } from "@/socket";
import useChatMessage from "@/hooks/useChatMessage";
import useChatFriend from "@/hooks/useChatFriend";
import useJwtError from "@/hooks/useJwtError";
import { STORAGE_KEY } from "@/constants/storage";

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

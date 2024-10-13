import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { socket } from "@/socket";
import useChatMessage from "@/hooks/useChatMessage";
import useChatFriend from "@/hooks/useChatFriend";


const SocketConnection: React.FC = () => {
  const dispatch = useDispatch();

  useChatMessage();
  useChatFriend();

  useEffect(() => {
    function onConnect() {
      const socketId = socket?.id || "";
      sessionStorage.setItem("gamegooSocketId", socketId);
    }

    function onDisconnect() {
      console.error("소켓 끊김");
    }

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

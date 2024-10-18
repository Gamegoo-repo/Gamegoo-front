"use client";

import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "@/api";
import { getAccessToken } from "./utils/storage";

let socket: Socket | null = null;
let socketId: string | null = null;

export const connectSocket = (): void => {


  if (socket?.connected) {
    return;
  }

  // 클라이언트 사이드에서만 실행
  if (typeof window !== "undefined") {
    const token = getAccessToken();
    
    const options = token ? { auth: { token } } : {};

    socket = io(SOCKET_URL, options);

    socket.on("connect", () => {
      socketId = socket?.id || null;
      sessionStorage.setItem("gamegooSocketId", socketId || "");
    });

    socket.on("disconnect", () => {
      sessionStorage.removeItem("gamegooSocketId");
      socketId = null;
    });

    setupSocketListeners();
  }
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    sessionStorage.removeItem("gamegooSocketId");
    socket = null;
    socketId = null;
  }
};

export const sendMatchingQuitEvent = (): void => {
  if (socket) {
    socket.emit("matching-quit");
  }
};

const setupSocketListeners = () => {
  if (!socket) return;
};

export { socket };
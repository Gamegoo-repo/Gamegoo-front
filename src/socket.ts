"use client";

import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "@/api";
import { getRefreshToken } from "@/utils/storage";

let socket: Socket | null = null;

export const connectSocket = (): void => {
  const token = getRefreshToken();

  if (!token) return;

  const options = token ? { auth: { token } } : {};

  socket = io(SOCKET_URL, options);

  socket.on("connect", () => {
    console.log("서버 연결. Socket ID:", socket?.id);
    const socketId = socket?.id || '';
    localStorage.setItem('gamegooSocketId', socketId);
  });

  socket.on("disconnect", () => {
    console.log("서버 연결 끊김");
    localStorage.removeItem('gamegooSocketId');
  });

  setupSocketListeners();
};

const setupSocketListeners = () => {
  if (!socket) return;

};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    console.log("소켓 연결 해지");
    localStorage.removeItem('gamegooSocketId');
  } else {
    console.log("소켓이 연결되지 않았습니다.");
  }
};


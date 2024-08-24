"use client";

import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "@/api";

let socket: Socket | null = null;
let socketId: string | null = null;

export const connectSocket = (): void => {
  const token = sessionStorage.getItem('accessToken');

  const options = token ? { auth: { token } } : {};

  socket = io(SOCKET_URL, options);

  socket.on("connect", () => {
    console.log("서버 연결. Socket ID:", socket?.id);
    socketId = socket?.id || null;
    localStorage.setItem('gamegooSocketId', socketId || '');
  });

  socket.on("disconnect", () => {
    console.log("서버 연결 끊김");
    socketId = null;
    localStorage.removeItem('gamegooSocketId');
  });

  // setupSocketListeners();
};

const setupSocketListeners = () => {
  if (!socket) return;

};

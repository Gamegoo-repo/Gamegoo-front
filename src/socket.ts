"use client";

import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "@/api";
import { getAccessToken } from "./utils/storage";

let socket: Socket | null = null;
let socketId: string | null = null;

export const connectSocket = (): void => {
  if (socket) {
    console.log("이미 소켓이 연결되어 있습니다.");
    return;
  }

  // 클라이언트 사이드에서만 실행
  if (typeof window !== "undefined") {
    const token = getAccessToken();
    const options = token ? { auth: { token } } : {};

    socket = io(SOCKET_URL, options);

    socket.on("connect", () => {
      console.log("소켓 연결 성공, Socket ID:", socket?.id);
      socketId = socket?.id || null;
      localStorage.setItem("gamegooSocketId", socketId || "");
      console.log("연결된 accessToken", token);
    });

    socket.on("disconnect", () => {
      console.log("서버 연결 끊김");
      localStorage.removeItem("gamegooSocketId");
      socketId = null;
    });
    
    setupSocketListeners();
  }
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    console.log("소켓 연결 해제");
    localStorage.removeItem("gamegooSocketId");
    socket = null;
    socketId = null;
  }
};

export const sendMatchingQuitEvent = (): void => {
  if (socket) {
    console.log("매칭 종료 이벤트 전송");
    socket.emit("matching-quit");
  }
};

const setupSocketListeners = () => {
  if (!socket) return;

};

export { socket };
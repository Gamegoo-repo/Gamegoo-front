"use client";

import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "@/api";  
import { getAccessToken } from "@/utils/storage";  

let socket: Socket | null = null;

export const connectSocket = (): void => {
  const token = getAccessToken();

  if (!token) return; 
  
  const options = token ? { auth: { token } } : {};

  socket = io(SOCKET_URL, options);

  socket.on("connect", () => {
    console.log("Connected to server. Socket ID:", socket?.id);
    alert("Connected to server. Socket ID: " + socket?.id);
  });

  setupSocketListeners();
};

const setupSocketListeners = () => {
  if (!socket) return;

};
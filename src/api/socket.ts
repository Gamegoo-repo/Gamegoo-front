import axios from "axios";

import { STORAGE_KEY } from "@/constants/storage";
import { connectSocket } from "@/socket";
import { getAccessToken } from "@/utils/storage";

import { SocketAxios } from "./api";

/* 소켓 로그인 */
export const socketLogin = async () => {
  try {
    const jwtToken = getAccessToken();
    const socketId = sessionStorage.getItem(STORAGE_KEY.gamegooSocketId);

    if (!jwtToken || !socketId) return;

    const response = await SocketAxios.post(
      "/login",
      {},
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Socket-Id": socketId,
        },
      }
    );

    if (response.status === 200) {
      console.log("소켓 서버에 로그인했음 알림");
    } else {
      console.error("소켓 서버에 로그인 알림 실패:", response.statusText);
    }
  } catch (error: any) {
    if (error.response) {
      console.error("소켓 서버에 로그인 알림 실패:", error.response.statusText);
    } else {
      console.error(error.message);
    }
  }
};

/* 소켓 로그아웃 */
export const socketLogout = async () => {
  try {
    const jwtToken = getAccessToken(); // localStorage와 sessionStorage 모두 확인
    const socketId = sessionStorage.getItem(STORAGE_KEY.gamegooSocketId);
    const isLogout = sessionStorage.getItem(STORAGE_KEY.logout);

    if (!socketId) return;

    const response = await SocketAxios.post(
      "/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Socket-Id": socketId,
        },
      }
    );

    if (response.status === 200) {
      console.log("소켓 서버 로그아웃 성공");

      // 로그아웃 버튼으로 로그아웃한 경우이고 토큰이 이미 삭제된 경우
      if (isLogout && !jwtToken) {
        // 소켓 재연결 (익명 연결)
        connectSocket();
      }
    } else {
      console.error("소켓 서버에 로그아웃 알림 실패:", response.statusText);
    }
  } catch (error: any) {
    // 401 에러는 토큰이 이미 만료된 것이므로 정상적인 로그아웃으로 간주
    if (error.response && error.response.status === 401) {
      console.log("소켓 서버 로그아웃 완료 (토큰 이미 만료됨)");

      const isLogout = sessionStorage.getItem(STORAGE_KEY.logout);
      const jwtToken = getAccessToken();

      // 로그아웃 버튼으로 로그아웃한 경우이고 토큰이 이미 삭제된 경우
      if (isLogout && !jwtToken) {
        // 소켓 재연결 (익명 연결)
        connectSocket();
      }
    } else if (error.response) {
      console.error(
        "소켓 서버에 로그아웃 요청 실패:",
        error.response.statusText
      );
    } else {
      console.error("소켓 로그아웃 에러:", error.message);
    }
  }
};

export const getSystemMsg = async (tier?: string) => {
  try {
    const url = tier
      ? `https://socket.gamegoo.co.kr/socket/message?tier=${tier}`
      : `https://socket.gamegoo.co.kr/socket/message`;

    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("시스템 메세지 조회 실패:", error.response.statusText);
    } else {
      console.error("시스템 메세지 조회 에러:", error.message);
    }
  }
};

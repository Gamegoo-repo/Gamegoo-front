import axios from "axios";
import { SocketAxios } from ".";
import { getAccessToken } from "@/utils/storage";
import { connectSocket } from "@/socket";

/* 소켓 로그인 */
export const socketLogin = async () => {
    try {
        const jwtToken = getAccessToken();
        const socketId = sessionStorage.getItem('gamegooSocketId');

        if (!jwtToken || !socketId) return;

        const response = await SocketAxios.post("/login", {}, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
                "Socket-Id": socketId,
            },
        });

        if (response.status === 200) {
            console.log('소켓 서버에 로그인했음 알림');
        } else {
            console.error('소켓 서버에 로그인 알림 실패:', response.statusText);
        }
    } catch (error: any) {
        if (error.response) {
            console.error('소켓 서버에 로그인 알림 실패:', error.response.statusText);
        } else {
            console.error(error.message);
        }
    }
};

/* 소켓 로그아웃 */
export const socketLogout = async () => {
    try {
        const jwtToken = sessionStorage.getItem('accessToken');
        const socketId = sessionStorage.getItem('gamegooSocketId');
        const isLogout = sessionStorage.getItem('logout');

        if (!socketId) return;

        const response = await SocketAxios.post("/logout", {}, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
                "Socket-Id": socketId,
            },
        });
        if (response.status===200 && isLogout && !jwtToken) {
            console.log('로그아웃 성공')
            // 로그아웃 버튼 클릭해서 로그인 페이지 들어온 경우
            // 소켓 연결 끊어진 이후 소켓 재연결 시키기
            connectSocket();
        } else {
            console.error('소켓 서버에 로그아웃 알림 실패:', response.statusText);
        }
    } catch (error: any) {
        if (error.response) {
            console.error('소켓 서버에 로그아웃 요청 실패:', error.response.statusText);
        } else {
            console.error(error.message);
        }
    }
};

export const getSystemMsg = async (tier?: string) => {
    try {
        const url = tier ? `https://socket.gamegoo.co.kr/socket/message?tier=${tier}` : `https://socket.gamegoo.co.kr/socket/message`;

        const response = await axios.get(url);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            console.error('시스템 메세지 조회 실패:', error.response.statusText);
        } else {
            console.error('시스템 메세지 조회 에러:', error.message);
        }
    }
}



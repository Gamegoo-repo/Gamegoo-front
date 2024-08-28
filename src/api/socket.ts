import { SocketAxios } from ".";

/* 소켓 로그인 */
export const socketLogin = async () => {
    try {
        const jwtToken = sessionStorage.getItem('accessToken');
        const socketId = localStorage.getItem('gamegooSocketId');

        if (!socketId) {
            console.error('소켓 아이디 없음');
            return;
        }

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
            console.error('에러:', error.message);
        }
    }
};


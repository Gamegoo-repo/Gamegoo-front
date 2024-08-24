import { SocketAxios } from ".";

export const socketLogin = async () => {
    try {
        const jwtToken = sessionStorage.getItem('accessToken');
        const socketId = localStorage.getItem('gamegooSocketId');

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
            console.error('소켓 서버에 로그인 알림 실패:', response);

        }
    } catch (error: any) {
        console.error('에러 전체:', error);
        if (error.response) {
            console.error('소켓 서버에 로그인 알림 실패:', error.response.message);
        } else {
            console.error('에러:', error.message);
        }
    }
};
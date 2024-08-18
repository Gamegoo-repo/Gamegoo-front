import Axios from ".";

export const socketLogin = async () => {
    const jwtToken = localStorage.getItem('refreshToken');
    const socketId = localStorage.getItem('gamegooSocketId');

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
        'Socket-Id': socketId,
    };

    try {
        const response = await Axios.post('/login', { headers });
        console.log('소켓 로그인 성공:', response.data);

    } catch (error) {
        console.error('소켓 로그인 실패', error);
        throw error;

    }
};
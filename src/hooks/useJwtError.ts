import { useEffect } from 'react';
import { connectSocket, socket } from '@/socket';
import { getAccessToken } from '@/utils/storage';
import { isTokenExpired } from '@/utils/auth';
import { AuthAxios, reissueToken } from '@/api/auth';

const useJwtError = () => {

    useEffect(() => {
        // 소켓 연결되어 있지 않으면 소켓 연결
        if (!socket) {
            connectSocket();
        }

        AuthAxios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const { response: { status } } = error;

                if (status === 401) {
                    try {
                        const response = await reissueToken();
                        const newToken = response.result.refreshToken;

                        // 재발급된 토큰을 로컬 저장소에 저장
                        if (localStorage.getItem('accessToken')) {
                            localStorage.setItem('accessToken', newToken);
                        } else {
                            sessionStorage.setItem('accessToken', newToken);
                        }

                        // 요청을 새로운 토큰으로 다시 전송
                        error.config.headers['Authorization'] = `Bearer ${newToken}`;
                        return AuthAxios(error.config);
                    } catch (tokenReissueError) {
                        console.error("토큰 재발급 실패:", tokenReissueError);
                        // 재발급 실패 시 추가 처리 (로그아웃 등)
                        throw tokenReissueError;
                    }
                }

                return Promise.reject(error);
            }
        );

        const handleJwtExpiredError = async (res: any) => {
            const { eventName, eventData } = res.data;

            try {
                const newToken = getAccessToken();
                socket?.emit(eventName, { ...eventData, token: newToken });
            } catch (error) {
                console.error("소켓 이벤트 전송 실패:", error);
            }
        };

        const handleConnectionJwtError = async () => {
            try {
                const newToken = getAccessToken();
                socket?.emit("connection-update-token", { token: newToken });
            } catch (error) {
                console.error("연결 업데이트 실패:", error);
            }
        };

        socket?.on("connection-jwt-error", handleConnectionJwtError);
        socket?.on("jwt-expired-error", handleJwtExpiredError);

        return () => {
            socket?.off("connection-jwt-error", handleConnectionJwtError);
            socket?.off("jwt-expired-error", handleJwtExpiredError);
        };
    }, []);

};

export default useJwtError;
import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { LOGIN } from "@/constants/messages";
import Axios, { BASE_URL } from ".";
import { clearTokens, getAccessToken, getRefreshToken } from "@/utils/storage";
import { notify } from "@/hooks/notify";

export const reissueToken = async () => {
  const endpoint = '/v1/member/refresh';

  try {
    const refreshToken = getRefreshToken();
    const response = await Axios.post(endpoint, { refreshToken: refreshToken });
    console.log("accessToken 재발급 성공:", response);
    return response.data;
  } catch (error) {
    console.error("accessToken 재발급 실패:", error);
    throw error;
  }
};

/* AuthAxios 인스턴스 생성 */
export const AuthAxios: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

/* AuthAxios 요청 인터셉터 */
AuthAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* AuthAxios 응답 인터셉터 */
AuthAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { config, response: { status } } = error;

    /* 토큰 만료 시 */
    if (status === 401) {
      console.log("AuthAxios 401 Error Response Interceptor");

      try {
      /* 토큰 재발급 요청 */
        const response = await reissueToken();
        const newAccessToken = response.result.accessToken;
        const originRequest = config;  // 이전 요청 저장
        
        // 로컬 또는 세션에 재발급된 토큰 저장
      if (localStorage.getItem('accessToken')) {
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', response.result.refreshToken);
      } else {
        sessionStorage.setItem('accessToken', newAccessToken);
        sessionStorage.setItem('refreshToken', response.result.refreshToken);
        }
      
      originRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
      return axios(originRequest);
    } catch (reissueError:any) {
      if(reissueError.response && reissueError.response.status === 404){
        notify({ text: LOGIN.MESSAGE.EXPIRED, icon: '🚫', type: 'error' });
      } else {
        notify({ text: LOGIN.MESSAGE.ETC, icon: '🚫', type: 'error' });
      }
      // 토큰 재발급 실패 시 처리
      console.error("토큰 재발급 실패:", reissueError);
      clearTokens();  // 저장된 토큰 삭제
      window.location.replace('/login');  // 로그인 페이지로 이동
      }
    }
    return Promise.reject(error);
  }
);
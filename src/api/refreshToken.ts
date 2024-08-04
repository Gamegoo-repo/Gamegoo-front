import axios from "axios";
import Axios, { AuthAxios } from ".";
import { LOGIN } from "@/constants/messages";

const reissueToken = async () => {
  const endpoint = '/v1/member/refresh';
  try {
    const response = await Axios.post(endpoint, { refreshToken: localStorage.getItem('refreshToken') });
    console.log("accessToken 재발급 성공:", response);
    return response.data;
  } catch (error) {
    console.error("accessToken 재발급 실패:", error);
    throw error;
  }
};

/* AuthAxios에 interceptor 적용 */
AuthAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const {
      config,
      response: { status },
    } = error;
    
    /* 토큰이 만료 시*/
    if (status === 401) {
      if (error.response.data.message === 'Unauthorized') {
        const originRequest = config;
        const response = await reissueToken();
        // refreshToken 요청 성공
        if (response.status === 200) {
          const newAccessToken = response.data.token;
          localStorage.setItem('accessToken', response.data.token);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          axios.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          // 진행중이던 요청 이어서
          originRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originRequest);
        // refreshToken 요청 실패 (refreshToken도 만료되었을때 = 재로그인 안내)
        } else if (response.status === 404) {
          alert(LOGIN.MESSAGE.EXPIRED);
          window.location.replace('/');
        } else {
          alert(LOGIN.MESSAGE.ETC);
        }
      }
    }
    return Promise.reject(error);
  },
);
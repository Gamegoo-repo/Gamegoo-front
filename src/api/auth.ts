import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { LOGIN } from "@/constants/messages";
import Axios, { BASE_URL } from ".";
import { getAccessToken, getRefreshToken } from "@/utils/storage";
import { clearUserProfile } from "@/redux/slices/userSlice";
import { useDispatch } from "react-redux";

export const reissueToken = async () => {
  const endpoint = '/v1/member/refresh';

  console.log("요청한 refreshToken", getRefreshToken())
  try {
    const response = await Axios.post(endpoint, { refreshToken: getRefreshToken() });
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
    console.log("토큰", token);
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
    const {
      config,
      response: { status },
    } = error;
    /* 토큰이 만료 시 */
    if (status === 401) {
      console.log("AuthAxios 401 Error Response Interceptor");
      const dispatch = useDispatch();
      try {
        const originRequest = config;
        const response = await reissueToken();
        console.log("토큰 재발급 성공");

        // refreshToken 요청 성공
        const newAccessToken = response.result.accessToken;
        console.log(newAccessToken);
        if (localStorage.getItem('accessToken')) {
          localStorage.setItem('accessToken', newAccessToken);
          localStorage.setItem('refreshToken', response.result.refreshToken);
        } else {
          sessionStorage.setItem('accessToken', newAccessToken);
          sessionStorage.setItem('refreshToken', response.result.refreshToken);
        }
        // 진행중이던 요청 이어서
        originRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axios(originRequest);
      } catch (reissueError: any) {
        if (reissueError.response && reissueError.response.status === 404) {
          console.log(LOGIN.MESSAGE.EXPIRED);
          dispatch(clearUserProfile());
          window.location.replace('/login');
        } else {
          console.log(LOGIN.MESSAGE.ETC);
          dispatch(clearUserProfile());
          window.location.replace('/login');
        }
        return Promise.reject(reissueError);
      }
    }
    return Promise.reject(error);
  }
);
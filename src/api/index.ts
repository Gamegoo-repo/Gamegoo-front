import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosInstance } from "axios";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

/* 토큰을 가져오는 함수 */
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

/* Axios 인스턴스 생성 */
const Axios: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

/* AuthAxios 인스턴스 생성 */
export const AuthAxios: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    Authorization: `Bearer ${getToken()}`,
  },
});

/* 요청 인터셉터 */
Axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* 응답 인터셉터 */
Axios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const errorData = error.response.data;
      return Promise.reject(new Error(errorData.message || 'Failed to fetch data'));
    }
    return Promise.reject(error);
  }
);

export default Axios;

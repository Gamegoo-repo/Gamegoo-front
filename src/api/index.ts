import { getAccessToken } from "@/utils/storage";
import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosInstance } from "axios";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

/* Axios 인스턴스 생성 */
const Axios: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

/* 요청 인터셉터 */
Axios.interceptors.request.use(
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

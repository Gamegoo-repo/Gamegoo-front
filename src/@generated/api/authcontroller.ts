import Axios from "@/api";

import type {
  ApiResponse,
  JoinRequest,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "../types";

/* postAuthRefresh - 생성 */
export const postAuthRefresh = async (
  data: RefreshTokenRequest
): Promise<ApiResponse<RefreshTokenResponse>> => {
  const endpoint = "/api/v2/auth/refresh";
  try {
    const response = await Axios.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("postAuthRefresh failed:", error);
    throw error;
  }
};

/* postAuthLogout - 생성 */
export const postAuthLogout = async (): Promise<ApiResponse<string>> => {
  const endpoint = "/api/v2/auth/logout";
  try {
    const response = await Axios.post(endpoint);
    return response.data;
  } catch (error) {
    console.error("postAuthLogout failed:", error);
    throw error;
  }
};

/* postAuthLogin - 생성 */
export const postAuthLogin = async (
  data: LoginRequest
): Promise<ApiResponse<LoginResponse>> => {
  const endpoint = "/api/v2/auth/login";
  try {
    const response = await Axios.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("postAuthLogin failed:", error);
    throw error;
  }
};

/* postAuthJoin - 생성 */
export const postAuthJoin = async (
  data: JoinRequest
): Promise<ApiResponse<string>> => {
  const endpoint = "/api/v2/auth/join";
  try {
    const response = await Axios.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("postAuthJoin failed:", error);
    throw error;
  }
};

/* getAuthTokenMemberId - 조회 */
export const getAuthTokenMemberId = async (
  memberId: number | string
): Promise<ApiResponse<string>> => {
  const endpoint = `/api/v2/auth/token/${memberId}`;
  try {
    const response = await Axios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("getAuthTokenMemberId failed:", error);
    throw error;
  }
};

/* deleteAuth - 삭제 */
export const deleteAuth = async (): Promise<ApiResponse<string>> => {
  const endpoint = "/api/v2/auth";
  try {
    const response = await Axios.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error("deleteAuth failed:", error);
    throw error;
  }
};

import { ApiResponse } from "../api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginData {
  id: number;
  name: string;
  profileImage: number;
  accessToken: string;
  refreshToken: string;
}

export type LoginResponse = ApiResponse<LoginData>;

export interface LogoutData {
  message: string;
}

export type LogoutResponse = ApiResponse<LogoutData>;

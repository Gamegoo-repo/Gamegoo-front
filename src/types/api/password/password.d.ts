import type { ApiResponse } from "../api";

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  verifyCode: string;
}

export interface CheckPasswordData {
  true: boolean;
}

export interface PasswordData {
  message: string;
}

export type CheckPasswordResponse = ApiResponse<CheckPasswordData>;
export type PasswordResponse = ApiResponse<PasswordData>;

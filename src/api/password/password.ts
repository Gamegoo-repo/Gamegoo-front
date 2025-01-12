import { CheckPasswordResponse, PasswordResponse, ResetPasswordRequest } from "@/types/api/password/password";
import Axios from "..";
import { AuthAxios } from "../auth";

/* 비밀번호 찾기 */
export const resetPassword = async ({
  email,
  newPassword,
  verifyCode,
}: ResetPasswordRequest): Promise<PasswordResponse> => {
  const endpoint = "/api/v2/password/reset";
  try {
    const response = await Axios.post(endpoint, {
      email,
      newPassword,
      verifyCode,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* 비밀번호 재설정 */
export const checkPassword = async (password: string): Promise<CheckPasswordResponse> => {
  const endpoint = "/api/v2/password/check";
  try {
    const response = await AuthAxios.post(endpoint, { password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (
  newPassword: string
): Promise<PasswordResponse> => {
  const endpoint = "/api/v2/password/change";
  try {
    const response = await AuthAxios.put(endpoint, { newPassword });
    return response.data;
  } catch (error) {
    throw error;
  }
};
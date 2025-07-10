import { Axios } from "@/api";

import type { ApiResponse, EmailCodeRequest, EmailRequest } from "../types";

/* postEmailVerify - 생성 */
export const postEmailVerify = async (
  data: EmailCodeRequest
): Promise<ApiResponse<string>> => {
  const endpoint = "/api/v2/email/verify";
  try {
    const response = await Axios.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("postEmailVerify failed:", error);
    throw error;
  }
};

/* postEmailSendPwd - 생성 */
export const postEmailSendPwd = async (
  data: EmailRequest
): Promise<ApiResponse<string>> => {
  const endpoint = "/api/v2/email/send/pwd";
  try {
    const response = await Axios.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("postEmailSendPwd failed:", error);
    throw error;
  }
};

/* postEmailSendJoin - 생성 */
export const postEmailSendJoin = async (
  data: EmailRequest
): Promise<ApiResponse<string>> => {
  const endpoint = "/api/v2/email/send/join";
  try {
    const response = await Axios.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("postEmailSendJoin failed:", error);
    throw error;
  }
};

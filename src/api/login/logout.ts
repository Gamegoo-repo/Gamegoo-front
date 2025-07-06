import { LogoutResponse } from "@/types/api/login/login";

import { AuthAxios } from "../auth";

export const postLogout = async (): Promise<LogoutResponse> => {
  const endpoint = "/api/v2/auth/logout";

  try {
    const response = await AuthAxios.post(endpoint);
    return response.data;
  } catch (error) {
    console.error("로그아웃 실패:", error);
    throw error;
  }
};

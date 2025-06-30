import { ApiResponse } from "@/types/api/api";
import { AuthAxios } from "../auth";

export const deleteMember = async (): Promise<ApiResponse<string>> => {
  const endpoint = "/api/v2/auth";
  try {
    const response = await AuthAxios.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error("회원탈퇴 실패:", error);
    throw error;
  }
};

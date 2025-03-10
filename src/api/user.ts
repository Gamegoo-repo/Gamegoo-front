import { AuthAxios } from "./auth";

export const deleteMember = async () => {
  const endpoint = "/v1/member";
  try {
    const response = await AuthAxios.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error("회원탈퇴 실패:", error);
    throw error;
  }
};
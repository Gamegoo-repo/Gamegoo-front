import { getRefreshToken } from "@/utils/storage";
import Axios from ".";
import { ReissueResponse } from "@/types/api/reissue/reissue";

export const reissueToken = async ():Promise<ReissueResponse> => {
  const endpoint = "/api/v2/auth/refresh";

  try {
    const refreshToken = getRefreshToken();
    const response = await Axios.post(endpoint, { refreshToken });
    console.log("accessToken 재발급 성공:", response);
    return response.data;
  } catch (error) {
    console.error("accessToken 재발급 실패:", error);
    throw error;
  }
};
import { Axios } from "@/api";

import type {
  ApiResponse,
  RiotJoinRequest,
  RiotVerifyExistUserRequest,
} from "../types";

/* postRiotVerify - 생성 */
export const postRiotVerify = async (
  data: RiotVerifyExistUserRequest
): Promise<ApiResponse<string>> => {
  const endpoint = "/api/v2/riot/verify";
  try {
    const response = await Axios.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("postRiotVerify failed:", error);
    throw error;
  }
};

/* postRiotJoin - 생성 */
export const postRiotJoin = async (
  data: RiotJoinRequest
): Promise<ApiResponse<string>> => {
  const endpoint = "/api/v2/riot/join";
  try {
    const response = await Axios.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("postRiotJoin failed:", error);
    throw error;
  }
};

/* getRiotOauthCallback - 조회 */
export const getRiotOauthCallback = async (
  code: string,
  state?: string
): Promise<any> => {
  const endpoint = "/api/v2/riot/oauth/callback";
  try {
    const response = await Axios.get(endpoint, { params: { state } });
    return response.data;
  } catch (error) {
    console.error("getRiotOauthCallback failed:", error);
    throw error;
  }
};

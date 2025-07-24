import { AuthAxios } from "@/api";

import type {
  ApiResponse,
  GameStyleRequest,
  IsMikeRequest,
  MyProfileResponse,
  OtherProfileResponse,
  PositionRequest,
  ProfileImageRequest,
} from "../types";

/* putProfileProfileImage - 수정 */
export const putProfileProfileImage = async (
  data: ProfileImageRequest
): Promise<ApiResponse<string>> => {
  const endpoint = "/api/v2/profile/profileImage";
  try {
    const response = await AuthAxios.put(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("putProfileProfileImage failed:", error);
    throw error;
  }
};

/* putProfilePosition - 수정 */
export const putProfilePosition = async (
  data: PositionRequest
): Promise<ApiResponse<string>> => {
  const endpoint = "/api/v2/profile/position";
  try {
    const response = await AuthAxios.put(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("putProfilePosition failed:", error);
    throw error;
  }
};

/* putProfileMike - 수정 */
export const putProfileMike = async (
  data: IsMikeRequest
): Promise<ApiResponse<string>> => {
  const endpoint = "/api/v2/profile/mike";
  try {
    const response = await AuthAxios.put(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("putProfileMike failed:", error);
    throw error;
  }
};

/* putProfileGamestyle - 수정 */
export const putProfileGamestyle = async (
  data: GameStyleRequest
): Promise<ApiResponse<string>> => {
  const endpoint = "/api/v2/profile/gamestyle";
  try {
    const response = await AuthAxios.put(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("putProfileGamestyle failed:", error);
    throw error;
  }
};

/* putProfileChampionStatsRefresh - 수정 */
export const putProfileChampionStatsRefresh = async (): Promise<
  ApiResponse<string>
> => {
  const endpoint = "/api/v2/profile/champion-stats/refresh";
  try {
    const response = await AuthAxios.put(endpoint);
    return response.data;
  } catch (error) {
    console.error("putProfileChampionStatsRefresh failed:", error);
    throw error;
  }
};

/* patchProfileAdminRevokeMemberId - 업데이트 */
export const patchProfileAdminRevokeMemberId = async (
  memberId: number | string
): Promise<ApiResponse<string>> => {
  const endpoint = `/api/v2/profile/admin/revoke/${memberId}`;
  try {
    const response = await AuthAxios.patch(endpoint);
    return response.data;
  } catch (error) {
    console.error("patchProfileAdminRevokeMemberId failed:", error);
    throw error;
  }
};

/* patchProfileAdminGrantMemberId - 업데이트 */
export const patchProfileAdminGrantMemberId = async (
  memberId: number | string
): Promise<ApiResponse<string>> => {
  const endpoint = `/api/v2/profile/admin/grant/${memberId}`;
  try {
    const response = await AuthAxios.patch(endpoint);
    return response.data;
  } catch (error) {
    console.error("patchProfileAdminGrantMemberId failed:", error);
    throw error;
  }
};

/* getProfile - 조회 */
export const getProfile = async (): Promise<ApiResponse<MyProfileResponse>> => {
  const endpoint = "/api/v2/profile";
  try {
    const response = await AuthAxios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("getProfile failed:", error);
    throw error;
  }
};

/* getProfileOther - 조회 */
export const getProfileOther = async (
  id: number
): Promise<ApiResponse<OtherProfileResponse>> => {
  const endpoint = "/api/v2/profile/other";
  try {
    const response = await AuthAxios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("getProfileOther failed:", error);
    throw error;
  }
};

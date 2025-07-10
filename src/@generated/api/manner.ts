import { AuthAxios } from "@/api";

import type {
  ApiResponse,
  MannerInsertRequest,
  MannerInsertResponse,
  MannerKeywordListResponse,
  MannerRatingResponse,
  MannerResponse,
  MannerUpdateRequest,
  MannerUpdateResponse,
} from "../types";

/* putMannerMannerId - 수정 */
export const putMannerMannerId = async (
  mannerId: number | string,
  data: MannerUpdateRequest
): Promise<ApiResponse<MannerUpdateResponse>> => {
  const endpoint = `/api/v2/manner/${mannerId}`;
  try {
    const response = await AuthAxios.put(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("putMannerMannerId failed:", error);
    throw error;
  }
};

/* getMannerPositiveMemberId - 조회 */
export const getMannerPositiveMemberId = async (
  memberId: number | string
): Promise<ApiResponse<MannerRatingResponse>> => {
  const endpoint = `/api/v2/manner/positive/${memberId}`;
  try {
    const response = await AuthAxios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("getMannerPositiveMemberId failed:", error);
    throw error;
  }
};

/* postMannerPositiveMemberId - 생성 */
export const postMannerPositiveMemberId = async (
  memberId: number | string,
  data: MannerInsertRequest
): Promise<ApiResponse<MannerInsertResponse>> => {
  const endpoint = `/api/v2/manner/positive/${memberId}`;
  try {
    const response = await AuthAxios.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("postMannerPositiveMemberId failed:", error);
    throw error;
  }
};

/* getMannerNegativeMemberId - 조회 */
export const getMannerNegativeMemberId = async (
  memberId: number | string
): Promise<ApiResponse<MannerRatingResponse>> => {
  const endpoint = `/api/v2/manner/negative/${memberId}`;
  try {
    const response = await AuthAxios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("getMannerNegativeMemberId failed:", error);
    throw error;
  }
};

/* postMannerNegativeMemberId - 생성 */
export const postMannerNegativeMemberId = async (
  memberId: number | string,
  data: MannerInsertRequest
): Promise<ApiResponse<MannerInsertResponse>> => {
  const endpoint = `/api/v2/manner/negative/${memberId}`;
  try {
    const response = await AuthAxios.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("postMannerNegativeMemberId failed:", error);
    throw error;
  }
};

/* getMannerLevelMemberId - 조회 */
export const getMannerLevelMemberId = async (
  memberId: number | string
): Promise<ApiResponse<MannerResponse>> => {
  const endpoint = `/api/v2/manner/level/${memberId}`;
  try {
    const response = await AuthAxios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("getMannerLevelMemberId failed:", error);
    throw error;
  }
};

/* getMannerKeywordMemberId - 조회 */
export const getMannerKeywordMemberId = async (
  memberId: number | string
): Promise<ApiResponse<MannerKeywordListResponse>> => {
  const endpoint = `/api/v2/manner/keyword/${memberId}`;
  try {
    const response = await AuthAxios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("getMannerKeywordMemberId failed:", error);
    throw error;
  }
};

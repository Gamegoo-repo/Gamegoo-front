import { Axios } from "@/api";

import type {
  ApiResponse,
  InitializingMatchingRequest,
  MatchingFoundResponse,
  PriorityListResponse,
} from "../types";

/* postInternalMatchingPriorityMemberId - 생성 */
export const postInternalMatchingPriorityMemberId = async (
  memberId: number | string,
  data: InitializingMatchingRequest
): Promise<ApiResponse<PriorityListResponse>> => {
  const endpoint = `/api/v2/internal/matching/priority/${memberId}`;
  try {
    const response = await Axios.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("postInternalMatchingPriorityMemberId failed:", error);
    throw error;
  }
};

/* patchInternalMatchingSuccessMatchingUuidTargetMatchingUuid - 업데이트 */
export const patchInternalMatchingSuccessMatchingUuidTargetMatchingUuid =
  async (
    matchingUuid: number | string,
    targetMatchingUuid: number | string
  ): Promise<ApiResponse<string>> => {
    const endpoint = `/api/v2/internal/matching/success/${matchingUuid}/${targetMatchingUuid}`;
    try {
      const response = await Axios.patch(endpoint);
      return response.data;
    } catch (error) {
      console.error(
        "patchInternalMatchingSuccessMatchingUuidTargetMatchingUuid failed:",
        error
      );
      throw error;
    }
  };

/* patchInternalMatchingStatusMatchingUuidStatus - 업데이트 */
export const patchInternalMatchingStatusMatchingUuidStatus = async (
  matchingUuid: number | string,
  status: number | string
): Promise<ApiResponse<string>> => {
  const endpoint = `/api/v2/internal/matching/status/${matchingUuid}/${status}`;
  try {
    const response = await Axios.patch(endpoint);
    return response.data;
  } catch (error) {
    console.error(
      "patchInternalMatchingStatusMatchingUuidStatus failed:",
      error
    );
    throw error;
  }
};

/* patchInternalMatchingStatusTargetMatchingUuidStatus - 업데이트 */
export const patchInternalMatchingStatusTargetMatchingUuidStatus = async (
  matchingUuid: number | string,
  status: number | string
): Promise<ApiResponse<string>> => {
  const endpoint = `/api/v2/internal/matching/status/target/${matchingUuid}/${status}`;
  try {
    const response = await Axios.patch(endpoint);
    return response.data;
  } catch (error) {
    console.error(
      "patchInternalMatchingStatusTargetMatchingUuidStatus failed:",
      error
    );
    throw error;
  }
};

/* patchInternalMatchingFoundMatchingUuidTargetMatchingUuid - 업데이트 */
export const patchInternalMatchingFoundMatchingUuidTargetMatchingUuid = async (
  matchingUuid: number | string,
  targetMatchingUuid: number | string
): Promise<ApiResponse<MatchingFoundResponse>> => {
  const endpoint = `/api/v2/internal/matching/found/${matchingUuid}/${targetMatchingUuid}`;
  try {
    const response = await Axios.patch(endpoint);
    return response.data;
  } catch (error) {
    console.error(
      "patchInternalMatchingFoundMatchingUuidTargetMatchingUuid failed:",
      error
    );
    throw error;
  }
};

import { AuthAxios } from "@/api";



import type { ApiResponse, DeleteFriendResponse, FriendInfoResponse, FriendListResponse, FriendRequestResponse, StarFriendResponse } from "../types";


/* postFriendRequestMemberId - 생성 */
export const postFriendRequestMemberId = async (
  memberId: number | string
): Promise<ApiResponse<FriendRequestResponse>> => {
  const endpoint = `/api/v2/friend/request/${memberId}`;
  try {
    const response = await AuthAxios.post(endpoint);
    return response.data;
  } catch (error) {
    console.error("postFriendRequestMemberId failed:", error);
    throw error;
  }
};

/* deleteFriendRequestMemberId - 삭제 */
export const deleteFriendRequestMemberId = async (
  memberId: number | string
): Promise<ApiResponse<FriendRequestResponse>> => {
  const endpoint = `/api/v2/friend/request/${memberId}`;
  try {
    const response = await AuthAxios.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error("deleteFriendRequestMemberId failed:", error);
    throw error;
  }
};

/* patchFriendMemberIdStar - 업데이트 */
export const patchFriendMemberIdStar = async (
  memberId: number | string
): Promise<ApiResponse<StarFriendResponse>> => {
  const endpoint = `/api/v2/friend/${memberId}/star`;
  try {
    const response = await AuthAxios.patch(endpoint);
    return response.data;
  } catch (error) {
    console.error("patchFriendMemberIdStar failed:", error);
    throw error;
  }
};

/* patchFriendRequestMemberIdReject - 업데이트 */
export const patchFriendRequestMemberIdReject = async (
  memberId: number | string
): Promise<ApiResponse<FriendRequestResponse>> => {
  const endpoint = `/api/v2/friend/request/${memberId}/reject`;
  try {
    const response = await AuthAxios.patch(endpoint);
    return response.data;
  } catch (error) {
    console.error("patchFriendRequestMemberIdReject failed:", error);
    throw error;
  }
};

/* patchFriendRequestMemberIdAccept - 업데이트 */
export const patchFriendRequestMemberIdAccept = async (
  memberId: number | string
): Promise<ApiResponse<FriendRequestResponse>> => {
  const endpoint = `/api/v2/friend/request/${memberId}/accept`;
  try {
    const response = await AuthAxios.patch(endpoint);
    return response.data;
  } catch (error) {
    console.error("patchFriendRequestMemberIdAccept failed:", error);
    throw error;
  }
};

/* getFriend - 조회 */
export const getFriend = async (): Promise<ApiResponse<FriendListResponse>> => {
  const endpoint = "/api/v2/friend";
  try {
    const response = await AuthAxios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("getFriend failed:", error);
    throw error;
  }
};

/* getFriendSearch - 조회 */
export const getFriendSearch = async (
  query: string
): Promise<ApiResponse<FriendInfoResponse[]>> => {
  const endpoint = `/api/v2/friend/search?query=${query}`;
  try {
    const response = await AuthAxios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("getFriendSearch failed:", error);
    throw error;
  }
};

/* deleteFriendMemberId - 삭제 */
export const deleteFriendMemberId = async (
  memberId: number | string
): Promise<ApiResponse<DeleteFriendResponse>> => {
  const endpoint = `/api/v2/friend/${memberId}`;
  try {
    const response = await AuthAxios.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error("deleteFriendMemberId failed:", error);
    throw error;
  }
};
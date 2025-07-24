import { AuthAxios } from "@/api";



import type { ApiResponse, BlockListResponse, BlockResponse } from "../types";


/* postBlockMemberId - 생성 */
export const postBlockMemberId = async (
  memberId: number | string
): Promise<ApiResponse<BlockResponse>> => {
  const endpoint = `/api/v2/block/${memberId}`;
  try {
    const response = await AuthAxios.post(endpoint);
    return response.data;
  } catch (error) {
    console.error("postBlockMemberId failed:", error);
    throw error;
  }
};

/* deleteBlockMemberId - 삭제 */
export const deleteBlockMemberId = async (
  memberId: number | string
): Promise<ApiResponse<BlockResponse>> => {
  const endpoint = `/api/v2/block/${memberId}`;
  try {
    const response = await AuthAxios.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error("deleteBlockMemberId failed:", error);
    throw error;
  }
};

/* getBlock - 조회 */
export const getBlock = async (
  page: number
): Promise<ApiResponse<BlockListResponse>> => {
  const endpoint = "/api/v2/block";
  try {
    const response = await AuthAxios.get(endpoint, { params: page });
    return response.data;
  } catch (error) {
    console.error("getBlock failed:", error);
    throw error;
  }
};

/* deleteBlockDeleteMemberId - 삭제 */
export const deleteBlockDeleteMemberId = async (
  memberId: number | string
): Promise<ApiResponse<BlockResponse>> => {
  const endpoint = `/api/v2/block/delete/${memberId}`;
  try {
    const response = await AuthAxios.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error("deleteBlockDeleteMemberId failed:", error);
    throw error;
  }
};
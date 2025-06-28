import type { ApiResponse } from "../types";
import { AuthAxios } from "@/api/auth";

/* getInternalMemberIdFriendIds - 조회 */
export const getInternalMemberIdFriendIds = async (
  memberId: number | string
): Promise<ApiResponse<number[]>> => {
  const endpoint = `/api/v2/internal/${memberId}/friend/ids`;
  try {
    const response = await AuthAxios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("getInternalMemberIdFriendIds failed:", error);
    throw error;
  }
};

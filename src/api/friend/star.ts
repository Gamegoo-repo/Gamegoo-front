import { AuthAxios } from "../auth";

import type { FriendStatusResponse } from "@/types/api/friend/status";

/* 친구 즐겨찾기 설정&해제 */
export const patchFriendStar = async (
  memberId: number
): Promise<FriendStatusResponse> => {
  const endpoint = `/api/v2/friend/${memberId}/star`;
  try {
    const response = await AuthAxios.patch(endpoint);
    return response.data;
  } catch (error) {
    throw error;
  }
};

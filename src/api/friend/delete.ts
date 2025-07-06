import { FriendStatusResponse } from "@/types/api/friend/status";

import { AuthAxios } from "../auth";

/* 친구 삭제 */
export const deleteFriend = async (
  memberId: number
): Promise<FriendStatusResponse> => {
  const endpoint = `/api/v2/friend/${memberId}`;
  try {
    const response = await AuthAxios.delete(endpoint);
    return response.data;
  } catch (error) {
    throw error;
  }
};

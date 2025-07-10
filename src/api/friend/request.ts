import ko from "@/constants/ko.json";
import { notify } from "@/hooks/notify";

import { AuthAxios } from "../auth";

import type { FriendStatusResponse } from "@/types/api/friend/status";

/* 친구 요청 전송 */
export const sendFriendRequest = async (
  memberId: number
): Promise<FriendStatusResponse> => {
  const endpoint = `/api/v2/friend/request/${memberId}`;
  try {
    const response = await AuthAxios.post(endpoint);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      notify({
        text:
          ko[`error.friend.${error.response.data.code}` as keyof typeof ko] ??
          ko["error.friend.default"],
        icon: "🚫",
        type: "error",
      });
    } else {
      console.error("친구 요청 실패:", error);
    }
    throw error;
  }
};

/* 친구 요청 취소 */
export const cancelFriendRequest = async (
  memberId: number
): Promise<FriendStatusResponse> => {
  try {
    const response = await AuthAxios.delete(
      `/api/v2/friend/request/${memberId}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      notify({
        text: ko["error.friend.cancel.404"],
        icon: "🚫",
        type: "error",
      });
      throw error;
    }

    notify({
      text:
        ko[
          `error.friend.cancel.${error.response.data.code}` as keyof typeof ko
        ] ?? ko["error.friend.cancel.default"],
      icon: "🚫",
      type: "error",
    });
    throw error;
  }
};

/* 친구 요청 수락 */
export const acceptFriendRequest = async (
  memberId: number
): Promise<FriendStatusResponse> => {
  try {
    const response = await AuthAxios.patch(
      `/api/v2/friend/request/${memberId}/accept`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* 친구 요청 거절 */
export const rejectFriendRequest = async (
  memberId: number
): Promise<FriendStatusResponse> => {
  try {
    const response = await AuthAxios.patch(
      `/api/v2/friend/request/${memberId}/reject`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};


import { FriendStatusResponse } from "@/types/api/friend/status";
import { AuthAxios } from "../auth";
import { notify } from "@/hooks/notify";

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
      let errorMessage = "친구 요청이 실패했습니다.";
      switch (error.response.data.code) {
        case "MEMBER_401":
          errorMessage = "해당 사용자를 찾을 수 없습니다.";
          break;
        case "MEMBER_402":
          errorMessage = "탈퇴한 사용자입니다.";
          break;
        case "FRIEND_401":
          errorMessage = "본인에게는 친구 요청을 할 수 없습니다.";
          break;
        case "FRIEND_402":
          errorMessage =
            "내가 차단한 회원입니다.\n친구 요청을 보낼 수 없습니다.";
          break;
        case "FRIEND_403":
          errorMessage =
            "나를 차단한 회원입니다.\n친구 요청을 보낼 수 없습니다.";
          break;
        case "FRIEND_404":
          errorMessage =
            "해당 회원에게 보낸 수락 대기 중인 친구 요청이 존재합니다.";
          break;
        case "FRIEND_405":
          errorMessage =
            "해당 회원이 나에게 보낸 친구 요청이 수락 대기 중 입니다.\n해당 요청을 수락 해주세요.";
          break;
        case "FRIEND_406":
          errorMessage =
            "두 회원은 이미 친구 관계 입니다.\n친구 요청을 보낼 수 없습니다.";
          break;
        default:
          break;
      }

      notify({ text: errorMessage, icon: "🚫", type: "error" });
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
    let errorMessage = "친구 요청 취소에 실패했습니다.";
    if (error.response) {
      if (error.response.status === 404) {
        errorMessage = "취소/수락/거절할 친구 요청이 존재하지 않습니다.";
      } else if (error.response.data) {
        switch (error.response.data.code) {
          case "FRIEND401":
            errorMessage = "본인에게는 친구 요청 취소를 할 수 없습니다.";
            break;
          case "FRIEND407":
            errorMessage = "취소/수락/거절할 친구 요청이 존재하지 않습니다.";
            break;
          default:
            break;
        }
      }
    } else {
      console.error("친구 요청 취소 실패:", error);
    }
    notify({ text: errorMessage, icon: "🚫", type: "error" });
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
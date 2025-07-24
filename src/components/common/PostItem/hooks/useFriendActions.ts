import { useCallback, useRef } from "react";



import { deleteFriendMemberId, deleteFriendRequestMemberId, postFriendRequestMemberId } from "@/@generated/api";
import ko from "@/constants/ko.json";
import { notify } from "@/hooks";



import type { MemberPost } from "@/types";


interface UseFriendActionsProps {
  isPost: MemberPost | undefined;
  onCloseMoreBox: () => void;
}

interface UseFriendActionsReturn {
  handleFriendAdd: () => Promise<void>;
  handleCancelFriendReq: () => Promise<void>;
  handleFriendDelete: () => Promise<void>;
}

export const useFriendActions = ({
  isPost,
  onCloseMoreBox,
}: UseFriendActionsProps) => {
  const _return = useRef<UseFriendActionsReturn>();

  /* 친구 추가 */
  const handleFriendAdd = useCallback(async () => {
    try {
      if (isPost) {
        await postFriendRequestMemberId(isPost.memberId);
      }
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
    } 
    onCloseMoreBox();
  }, [isPost, onCloseMoreBox]);

  /* 친구 요청 취소 */
  const handleCancelFriendReq = useCallback(async () => {
    try {
      if (isPost) {
        await deleteFriendRequestMemberId(isPost.memberId);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        notify({
          text: ko["error.friend.cancel.404"],
          icon: "🚫",
          type: "error",
        });
        throw error;
      } else {
        notify({
          text:
            ko[
              `error.friend.cancel.${error.response.data.code}` as keyof typeof ko
            ] ?? ko["error.friend.cancel.default"],
          icon: "🚫",
          type: "error",
        });
      }
    }
    onCloseMoreBox();
  }, [isPost, onCloseMoreBox]);

  /* 친구 삭제 */
  const handleFriendDelete = useCallback(async () => {
    try {
      if (isPost) {
        await deleteFriendMemberId(isPost.memberId);
      }
    } catch (error) {
      console.error(error);
    }
    onCloseMoreBox();
  }, [isPost, onCloseMoreBox]);

  if (!_return.current) {
    _return.current = {
      handleFriendAdd,
      handleCancelFriendReq,
      handleFriendDelete,
    };
  }

  _return.current.handleFriendAdd = handleFriendAdd;
  _return.current.handleCancelFriendReq = handleCancelFriendReq;
  _return.current.handleFriendDelete = handleFriendDelete;

  return _return.current;
};
import { useRef, useCallback } from "react";
import { deleteFriend } from "@/api/friend/delete";
import { cancelFriendRequest, sendFriendRequest } from "@/api/friend/request";
import { MemberPost } from "@/interface/board";

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
        await sendFriendRequest(isPost.memberId);
      }
    } catch (error) {
      console.error(error);
    }
    onCloseMoreBox();
  }, [isPost, onCloseMoreBox]);

  /* 친구 요청 취소 */
  const handleCancelFriendReq = useCallback(async () => {
    try {
      if (isPost) {
        await cancelFriendRequest(isPost.memberId);
      }
    } catch (error) {
      console.error(error);
    }
    onCloseMoreBox();
  }, [isPost, onCloseMoreBox]);

  /* 친구 삭제 */
  const handleFriendDelete = useCallback(async () => {
    try {
      if (isPost) {
        await deleteFriend(isPost.memberId);
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

import {
  deleteFriendMemberId,
  deleteFriendRequestMemberId,
  patchFriendRequestMemberIdAccept,
  patchFriendRequestMemberIdReject,
  postFriendRequestMemberId,
} from "@/@generated/api";

import type { User } from "@/types";

export const useFriend = (
  user: User,
  myId: number,
  memberId: number,
  updateFriendState?: (state: {
    friend: boolean;
    friendRequestMemberId: number | null;
    blocked: boolean;
  }) => void
) => {
  const handleFriendState = async (action: string) => {
    const update = (
      data: Partial<{
        friend: boolean;
        friendRequestMemberId: number | null;
        blocked: boolean;
      }>
    ) => {
      updateFriendState?.({
        friend: data.friend ?? user.friend,
        friendRequestMemberId:
          data.friendRequestMemberId ?? user.friendRequestMemberId,
        blocked: data.blocked ?? user.blocked,
      });
    };

    try {
      switch (action) {
        case "add":
          await postFriendRequestMemberId(memberId);
          update({ friendRequestMemberId: myId });
          break;
        case "cancel":
          await deleteFriendRequestMemberId(memberId);
          update({ friendRequestMemberId: null });
          break;
        case "accept":
          await patchFriendRequestMemberIdAccept(memberId);
          update({ friend: true, friendRequestMemberId: memberId });
          break;
        case "reject":
          await patchFriendRequestMemberIdReject(memberId);
          update({ friendRequestMemberId: null });
          break;
        case "delete":
          await deleteFriendMemberId(memberId);
          update({ friend: false, friendRequestMemberId: null });
          break;
        default:
          throw new Error("존재하지 않는 친구 상태입니다.");
      }
    } catch (err) {
      console.error("Friend action failed", err);
    }
  };

  return { handleFriendState };
};

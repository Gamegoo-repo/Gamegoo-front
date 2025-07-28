import { friendApi } from "@/utils/api";

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
          await friendApi.sendFriendRequest({ memberId });
          update({ friendRequestMemberId: myId });
          break;
        case "cancel":
          await friendApi.cancelFriendRequest({ memberId });
          update({ friendRequestMemberId: null });
          break;
        case "accept":
          await friendApi.acceptFriendRequest({ memberId });
          update({ friend: true, friendRequestMemberId: memberId });
          break;
        case "reject":
          await friendApi.rejectFriendRequest({ memberId });
          update({ friendRequestMemberId: null });
          break;
        case "delete":
          await friendApi.deleteFriend({ memberId });
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

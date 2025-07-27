import { useState } from "react";

import { blockApi } from "@/utils/api";

import type { User } from "@/types";

export const useBlock = (
  user: User,
  memberId: number,
  updateFriendState?: (state: {
    friend: boolean;
    friendRequestMemberId: number | null;
    blocked: boolean;
  }) => void
) => {
  const [isBlockBoxOpen, setIsBlockBoxOpen] = useState(false);
  const [isBlockConfirmOpen, setIsBlockConfirmOpen] = useState(false);

  const handleRunBlock = async () => {
    setIsBlockBoxOpen(false);

    try {
      if (user.blocked) {
        // 차단해제 api
        await blockApi.deleteBlockMember({ memberId });
        updateFriendState?.({
          friend: user.friend,
          friendRequestMemberId: user.friendRequestMemberId,
          blocked: false,
        });
      } else {
        // 차단하기 api
        await blockApi.blockMember({ memberId });
        updateFriendState?.({
          friend: user.friend,
          friendRequestMemberId: user.friendRequestMemberId,
          blocked: true,
        });
      }
      setIsBlockConfirmOpen(true);
    } catch (error) {
      console.error("Block/unblock failed", error);
    }
  };

  return {
    isBlockBoxOpen,
    setIsBlockBoxOpen,
    isBlockConfirmOpen,
    setIsBlockConfirmOpen,
    handleRunBlock,
  };
};

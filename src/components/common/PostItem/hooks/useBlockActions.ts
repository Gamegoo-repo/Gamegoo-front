import { useCallback, useRef, useState } from "react";

import { blockMember, unblockMember } from "@/api";

import type { MemberPost } from "@/types";

interface UseBlockActionsProps {
  isPost: MemberPost | undefined;
  onCloseMoreBox: () => void;
}

interface UseBlockActionsReturn {
  isBlockedStatus: boolean;
  setIsBlockedStatus: (status: boolean) => void;
  isBlockBoxOpen: boolean;
  setIsBlockBoxOpen: (open: boolean) => void;
  isBlockConfirmOpen: boolean;
  setIsBlockConfirmOpen: (open: boolean) => void;
  handleBlock: () => Promise<void>;
  handleRunBlock: () => Promise<void>;
}

export const useBlockActions = ({
  isPost,
  onCloseMoreBox,
}: UseBlockActionsProps) => {
  const _return = useRef<UseBlockActionsReturn>();
  const [isBlockedStatus, setIsBlockedStatus] = useState(false);
  const [isBlockBoxOpen, setIsBlockBoxOpen] = useState(false);
  const [isBlockConfirmOpen, setIsBlockConfirmOpen] = useState(false);

  /* 차단하기 */
  const handleBlock = useCallback(async () => {
    setIsBlockBoxOpen(true);
    onCloseMoreBox();
  }, [onCloseMoreBox]);

  const handleRunBlock = useCallback(async () => {
    setIsBlockBoxOpen(false);
    if (isPost) {
      if (isPost.isBlocked) {
        await unblockMember(isPost.memberId);
        setIsBlockedStatus(false);
      } else {
        await blockMember(isPost.memberId);
        setIsBlockedStatus(true);
      }
    }
    setIsBlockConfirmOpen(true);
  }, [isPost]);

  if (!_return.current) {
    _return.current = {
      isBlockedStatus: false,
      setIsBlockedStatus,
      isBlockBoxOpen: false,
      setIsBlockBoxOpen,
      isBlockConfirmOpen: false,
      setIsBlockConfirmOpen,
      handleBlock,
      handleRunBlock,
    };
  }

  _return.current.isBlockedStatus = isBlockedStatus;
  _return.current.isBlockBoxOpen = isBlockBoxOpen;
  _return.current.isBlockConfirmOpen = isBlockConfirmOpen;
  _return.current.handleBlock = handleBlock;
  _return.current.handleRunBlock = handleRunBlock;

  return _return.current;
};

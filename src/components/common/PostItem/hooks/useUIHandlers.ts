import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import type { RootState } from "@/redux/store";
import type { PostItemData } from "../PostItem";

interface UseUIHandlersProps {
  data: PostItemData;
  isClickable: boolean;
  onPostClick?: (boardId: number) => void;
  onProfileClick?: (e: React.MouseEvent, memberId: number) => void;
  showAlertWithContent: (
    icon: string,
    content: string,
    handleAlertClose: () => void,
    btnText: string
  ) => void;
}

interface UseUIHandlersReturn {
  mannerLevelBoxRef: React.RefObject<HTMLDivElement>;
  isMannerLevelBoxOpen: boolean;
  handlePostClick: () => void;
  handleProfileClick: (e: React.MouseEvent) => void;
  handleMannerLevelBoxToggle: () => void;
}

export const useUIHandlers = ({
  data,
  isClickable,
  onPostClick,
  onProfileClick,
  showAlertWithContent,
}: UseUIHandlersProps) => {
  const _return = useRef<UseUIHandlersReturn>();
  const isUser = useSelector((state: RootState) => state.user);
  const mannerLevelBoxRef = useRef<HTMLDivElement>(null);

  const [isMannerLevelBoxOpen, setIsMannerLevelBoxOpen] = useState(false);

  const loginRequiredMessage = "로그인이 필요한 서비스입니다.";

  /* MannerLevelBox 외부 클릭 시 닫힘 */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mannerLevelBoxRef.current &&
        !mannerLevelBoxRef.current.contains(event.target as Node)
      ) {
        setIsMannerLevelBoxOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* 게시글 클릭 */
  const handlePostClick = useCallback(() => {
    if (isClickable && onPostClick) {
      onPostClick(data.boardId!);
    }
  }, [isClickable, onPostClick, data.boardId]);

  /* 프로필 클릭 */
  const handleProfileClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onProfileClick) {
        onProfileClick(e, data.memberId!);
      }
    },
    [onProfileClick, data.memberId]
  );

  /* 매너레벨 박스 토글 */
  const handleMannerLevelBoxToggle = useCallback(() => {
    if (!isUser.id) {
      return showAlertWithContent(
        "exclamation",
        loginRequiredMessage,
        () => setIsMannerLevelBoxOpen(false),
        "확인"
      );
    }
    setIsMannerLevelBoxOpen((prevState) => !prevState);
  }, [isUser.id, showAlertWithContent]);

  if (!_return.current) {
    _return.current = {
      mannerLevelBoxRef,
      isMannerLevelBoxOpen: false,
      handlePostClick,
      handleProfileClick,
      handleMannerLevelBoxToggle,
    };
  }

  _return.current.isMannerLevelBoxOpen = isMannerLevelBoxOpen;
  _return.current.handlePostClick = handlePostClick;
  _return.current.handleProfileClick = handleProfileClick;
  _return.current.handleMannerLevelBoxToggle = handleMannerLevelBoxToggle;

  return _return.current;
};

import { useState, useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { setOpenModal } from "@/redux/slices/modalSlice";
import { getMemberPost } from "@/api/board/board";
import { MemberPost } from "@/types/api/board/board";
import { MoreBoxMenuItems } from "@/interface/moreBox";
import { PostItemData } from "../PostItem";

interface UseMoreBoxMenuProps {
  data: PostItemData;
  variant: "list" | "mypage";
  isPost: MemberPost | undefined;
  setIsPost: (post: MemberPost) => void;
  setIsBlockedStatus: (status: boolean) => void;
  showAlertWithContent: (
    icon: string,
    content: string,
    handleAlertClose: () => void,
    btnText: string
  ) => void;
  // 액션 핸들러들
  handlePullUp: () => void;
  handleEdit: () => void;
  handleDelete: () => void;
  handleFriendAdd: () => void;
  handleCancelFriendReq: () => void;
  handleFriendDelete: () => void;
  handleBlock: () => void;
}

interface UseMoreBoxMenuReturn {
  isMoreBoxOpen: boolean;
  setIsMoreBoxOpen: (open: boolean) => void;
  handleMoreBoxToggle: (e: React.MouseEvent) => Promise<void>;
  handleMoreBoxClose: () => void;
  handleReportModal: () => void;
  MoreBoxMenuItems: MoreBoxMenuItems[];
}

export const useMoreBoxMenu = ({
  data,
  variant,
  isPost,
  setIsPost,
  setIsBlockedStatus,
  showAlertWithContent,
  handlePullUp,
  handleEdit,
  handleDelete,
  handleFriendAdd,
  handleCancelFriendReq,
  handleFriendDelete,
  handleBlock,
}: UseMoreBoxMenuProps) => {
  const _return = useRef<UseMoreBoxMenuReturn>();
  const dispatch = useDispatch();
  const router = useRouter();
  const isUser = useSelector((state: RootState) => state.user);

  const [isMoreBoxOpen, setIsMoreBoxOpen] = useState(false);

  const logoutMessage = "로그아웃 되었습니다. 다시 로그인 해주세요.";

  /* 더보기 버튼 토글 */
  const handleMoreBoxToggle = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();

      if (variant === "list") {
        const response = await getMemberPost(data.boardId!);
        setIsPost(response.data);
        setIsBlockedStatus(response.data.isBlocked || false);
      }

      setIsMoreBoxOpen((prevState) => !prevState);
    },
    [variant, data.boardId, setIsPost, setIsBlockedStatus]
  );

  /* 더보기 박스 닫기 */
  const handleMoreBoxClose = useCallback(() => {
    setIsMoreBoxOpen(false);
  }, []);

  /* 신고하기 */
  const handleReportModal = useCallback(() => {
    if (!isUser.gameName) {
      return showAlertWithContent(
        "exclamation",
        logoutMessage,
        () => router.push("/riot"),
        "로그인하기"
      );
    }

    dispatch(setOpenModal("report"));
    setIsMoreBoxOpen(false);
  }, [isUser.gameName, showAlertWithContent, dispatch, router]);

  /* 더보기 메뉴 아이템 구성 */
  const MoreBoxMenuItems = useMemo((): MoreBoxMenuItems[] => {
    const menuItems: MoreBoxMenuItems[] = [];

    if (isUser?.id === data.memberId) {
      // 내가 작성한 글
      menuItems.push(
        { text: "끌어올리기", onClick: handlePullUp },
        { text: "수정", onClick: handleEdit },
        { text: "삭제", onClick: handleDelete }
      );
    } else if (variant === "list") {
      // 다른 사람이 작성한 글 (PostList에서만)
      let friendText = "";
      let friendFunc = null;

      if (!isPost?.isBlocked) {
        if (isPost?.isFriend) {
          friendText = "친구 삭제";
          friendFunc = handleFriendDelete;
        } else {
          if (
            !isPost?.isFriend &&
            isPost?.friendRequestMemberId !== isUser.id
          ) {
            friendText = "친구 추가";
            friendFunc = handleFriendAdd;
          }
          if (
            !isPost?.isFriend &&
            isPost?.friendRequestMemberId === isUser.id
          ) {
            friendText = "친구 요청 취소";
            friendFunc = handleCancelFriendReq;
          }
        }
      }

      if (friendText && friendFunc) {
        menuItems.push({ text: friendText, onClick: friendFunc });
      }

      menuItems.push(
        {
          text: isPost?.isBlocked ? "차단 해제" : "차단하기",
          onClick: handleBlock,
        },
        { text: "신고하기", onClick: handleReportModal }
      );
    }

    return menuItems;
  }, [
    isUser?.id,
    data.memberId,
    variant,
    isPost?.isBlocked,
    isPost?.isFriend,
    isPost?.friendRequestMemberId,
    handlePullUp,
    handleEdit,
    handleDelete,
    handleFriendAdd,
    handleCancelFriendReq,
    handleFriendDelete,
    handleBlock,
    handleReportModal,
  ]);

  if (!_return.current) {
    _return.current = {
      isMoreBoxOpen: false,
      setIsMoreBoxOpen,
      handleMoreBoxToggle,
      handleMoreBoxClose,
      handleReportModal,
      MoreBoxMenuItems: [],
    };
  }

  _return.current.isMoreBoxOpen = isMoreBoxOpen;
  _return.current.handleMoreBoxToggle = handleMoreBoxToggle;
  _return.current.handleMoreBoxClose = handleMoreBoxClose;
  _return.current.handleReportModal = handleReportModal;
  _return.current.MoreBoxMenuItems = MoreBoxMenuItems;

  return _return.current;
};

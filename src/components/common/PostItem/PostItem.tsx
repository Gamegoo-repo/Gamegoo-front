import { FC, useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";

import UserSection from "./UserSection/UserSection";
import UserTierSection from "./UserTierSection";
import PositionSection from "./PositionSection";
import ChampionSection from "./ChampionSection";
import MemoSection from "./MemoSection";
import MoreBox from "../MoreBox";
import MoreBoxButton from "../../readBoard/MoreBoxButton";
import ConfirmModal from "../ConfirmModal";
import Alert from "../Alert";

import { BoardDetail, BoardListDetail, MemberPost } from "@/interface/board";
import { MoreBoxMenuItems } from "@/interface/moreBox";
import { GameMode } from "@/types/game/gameMode";
import { AlertProps } from "@/interface/modal";
import { Position } from "@/types/position/position";
import { RootState } from "@/redux/store";
import {
  setOpenReadingModal,
  setCloseReadingModal,
  setOpenPostingModal,
  setOpenModal,
} from "@/redux/slices/modalSlice";
import { setCurrentPost, setPostStatus } from "@/redux/slices/postSlice";
import { setRefresh } from "@/redux/slices/boardSlice";
import { notify } from "@/hooks/notify";

import { deletePost, getMemberPost, pullUpPost } from "@/api/board/board";
import { deleteFriend } from "@/api/friend/delete";
import { cancelFriendRequest, sendFriendRequest } from "@/api/friend/request";
import { blockMember, unblockMember } from "@/api/block/block";

export type PostItemData = Pick<
  BoardListDetail,
  | "boardId"
  | "memberId"
  | "profileImage"
  | "gameName"
  | "tag"
  | "mannerLevel"
  | "tier"
  | "rank"
  | "gameMode"
  | "mainP"
  | "subP"
  | "championStatsResponseList"
  | "winRate"
  | "contents"
  | "createdAt"
  | "bumpTime"
  | "wantP"
> &
  Partial<Omit<BoardDetail, "wantP">>;

export interface PostItemProps {
  data: PostItemData;
  variant?: "list" | "mypage"; // PostList, MoPost 사용 컴포넌트 구분
  isClickable?: boolean;
  showTierSection?: boolean;
  showMoreButton?: boolean;
  onPostClick?: (boardId: number) => void;
  onDeletePost?: (boardId: number) => void;
  onProfileClick?: (e: React.MouseEvent, memberId: number) => void;
}

const PostItem: FC<PostItemProps> = ({
  data,
  variant = "list",
  isClickable = true,
  showTierSection = false,
  showMoreButton = true,
  onPostClick,
  onDeletePost,
  onProfileClick,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const mannerLevelBoxRef = useRef<HTMLDivElement>(null);

  const [isPost, setIsPost] = useState<MemberPost>();
  const [isMoreBoxOpen, setIsMoreBoxOpen] = useState(false);
  const [isMannerLevelBoxOpen, setIsMannerLevelBoxOpen] = useState(false);
  const [isBlockedStatus, setIsBlockedStatus] = useState(false);
  const [isBlockBoxOpen, setIsBlockBoxOpen] = useState(false);
  const [isBlockConfirmOpen, setIsBlockConfirmOpen] = useState(false);
  const [isPullUpConfirmOpen, setIsPullUpConfirmOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertProps, setAlertProps] = useState<AlertProps>({
    icon: "",
    width: 0,
    height: 0,
    content: "",
    alt: "",
    onClose: () => {},
    buttonText: "",
  });

  const isUser = useSelector((state: RootState) => state.user);

  const logoutMessage = "로그아웃 되었습니다. 다시 로그인 해주세요.";
  const loginRequiredMessage = "로그인이 필요한 서비스입니다.";

  const showAlertWithContent = (
    icon: string,
    content: string,
    handleAlertClose: () => void,
    btnText: string
  ) => {
    setAlertProps({
      icon: icon,
      width: 68,
      height: 58,
      content: content,
      alt: "경고",
      onClose: handleAlertClose,
      buttonText: btnText,
    });
    setShowAlert(true);
  };

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
  const handlePostClick = () => {
    if (isClickable && onPostClick) {
      onPostClick(data.boardId);
    }
  };

  /* 프로필 클릭 */
  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onProfileClick) {
      onProfileClick(e, data.memberId);
    }
  };

  /* 매너레벨 박스 토글 */
  const handleMannerLevelBoxToggle = () => {
    if (!isUser.id) {
      return showAlertWithContent(
        "exclamation",
        loginRequiredMessage,
        () => setShowAlert(false),
        "확인"
      );
    }
    setIsMannerLevelBoxOpen((prevState) => !prevState);
  };

  /* 더보기 버튼 토글 */
  const handleMoreBoxToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (variant === "list") {
      const response = await getMemberPost(data.boardId);
      setIsPost(response.data);
      setIsBlockedStatus(response.data.isBlocked || false);
    }

    setIsMoreBoxOpen((prevState) => !prevState);
  };

  /* 더보기 박스 닫기 */
  const handleMoreBoxClose = () => {
    setIsMoreBoxOpen(false);
  };

  /* 차단하기 */
  const handleBlock = async () => {
    setIsBlockBoxOpen(true);
    setIsMoreBoxOpen(false);
  };

  const handleRunBlock = async () => {
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
  };

  /* 친구 추가 */
  const handleFriendAdd = async () => {
    try {
      if (isPost) {
        await sendFriendRequest(isPost.memberId);
      }
    } catch (error) {
      console.error(error);
    }
    handleMoreBoxClose();
  };

  /* 친구 요청 취소 */
  const handleCancelFriendReq = async () => {
    try {
      if (isPost) {
        await cancelFriendRequest(isPost.memberId);
      }
    } catch (error) {
      console.error(error);
    }
    handleMoreBoxClose();
  };

  /* 친구 삭제 */
  const handleFriendDelete = async () => {
    try {
      if (isPost) {
        await deleteFriend(isPost.memberId);
      }
    } catch (error) {
      console.error(error);
    }
    handleMoreBoxClose();
  };

  /* 게시글 끌어올리기 */
  const handlePullUp = () => {
    if (!isUser.id) {
      return showAlertWithContent(
        "exclamation",
        logoutMessage,
        () => router.push("/riot"),
        "로그인하기"
      );
    }
    setIsPullUpConfirmOpen(true);
    setIsMoreBoxOpen(false);
    if (variant === "list") {
      dispatch(setCloseReadingModal());
    }
  };

  const handlePullUpAction = async () => {
    if (variant === "list") {
      dispatch(setCloseReadingModal());
    }
    setIsPullUpConfirmOpen(false);
    await pullUpPost(data.boardId);
    dispatch(setRefresh());

    await notify({
      text: "끌어올리기가 완료되었습니다",
      icon: "👌🏼",
      type: "success",
    });
  };

  /* 게시글 수정 */
  const handleEdit = async () => {
    if (!isUser.id) {
      return showAlertWithContent(
        "exclamation",
        logoutMessage,
        () => router.push("/riot"),
        "로그인하기"
      );
    }

    setIsMoreBoxOpen(false);

    if (variant === "mypage" && isPost) {
      await dispatch(
        setCurrentPost({ currentPost: isPost, currentPostId: data.boardId })
      );
    }

    dispatch(setOpenPostingModal());

    if (variant === "list") {
      dispatch(setCloseReadingModal());
    }

    dispatch(setPostStatus(""));
  };

  /* 게시글 삭제 */
  const handleDelete = async () => {
    if (!isUser.id) {
      return showAlertWithContent(
        "exclamation",
        logoutMessage,
        () => router.push("/riot"),
        "로그인하기"
      );
    }

    setIsMoreBoxOpen(false);

    try {
      await deletePost(data.boardId);
      dispatch(setPostStatus("delete"));

      if (variant === "list") {
        dispatch(setCloseReadingModal());
      }

      if (onDeletePost) {
        onDeletePost(data.boardId);
      }

      dispatch(setPostStatus(""));
    } catch (error) {
      console.error(error);
    }
  };

  /* 신고하기 */
  const handleReportModal = () => {
    if (!isUser.gameName) {
      return showAlertWithContent(
        "exclamation",
        logoutMessage,
        () => router.push("/riot"),
        "로그인하기"
      );
    }

    dispatch(setOpenModal("report"));
    handleMoreBoxClose();
  };

  /* 더보기 메뉴 아이템 구성 */
  const MoreBoxMenuItems: MoreBoxMenuItems[] = [];

  if (isUser?.id === data.memberId) {
    // 내가 작성한 글
    MoreBoxMenuItems.push(
      { text: "끌어올리기", onClick: handlePullUp },
      { text: "수정", onClick: handleEdit },
      { text: "삭제", onClick: handleDelete }
    );
  } else if (variant === "list") {
    // 다른 사람이 작성한 글 (PostList에서만)
    let friendText = "";
    let friendFunc = null;

    if (!isBlockedStatus) {
      if (isPost?.isFriend) {
        friendText = "친구 삭제";
        friendFunc = handleFriendDelete;
      } else {
        if (!isPost?.isFriend && isPost?.friendRequestMemberId !== isUser.id) {
          friendText = "친구 추가";
          friendFunc = handleFriendAdd;
        }
        if (!isPost?.isFriend && isPost?.friendRequestMemberId === isUser.id) {
          friendText = "친구 요청 취소";
          friendFunc = handleCancelFriendReq;
        }
      }
    }

    if (friendText && friendFunc) {
      MoreBoxMenuItems.push({ text: friendText, onClick: friendFunc });
    }

    MoreBoxMenuItems.push(
      {
        text: isPost?.isBlocked ? "차단 해제" : "차단하기",
        onClick: handleBlock,
      },
      { text: "신고하기", onClick: handleReportModal }
    );
  }

  return (
    <>
      {showAlert && (
        <Alert
          icon={alertProps.icon}
          width={alertProps.width}
          height={alertProps.height}
          content={alertProps.content}
          alt={alertProps.alt}
          onClose={alertProps.onClose}
          buttonText={alertProps.buttonText}
        />
      )}

      <Wrapper $isClickable={isClickable} onClick={handlePostClick}>
        <UserSection
          data={data}
          isMannerLevelBoxOpen={isMannerLevelBoxOpen}
          onMannerLevelBoxToggle={handleMannerLevelBoxToggle}
          onProfileClick={handleProfileClick}
          mannerLevelBoxRef={mannerLevelBoxRef}
          showMoreButton={showMoreButton && !!isUser.id}
          isMoreBoxOpen={isMoreBoxOpen}
          onMoreBoxToggle={handleMoreBoxToggle}
          onMoreBoxClose={handleMoreBoxClose}
          moreBoxMenuItems={MoreBoxMenuItems}
        />

        {showTierSection && <UserTierSection data={data} />}

        {data.gameMode !== "ARAM" && <PositionSection data={data} />}

        <ChampionSection data={data} variant={variant} />

        <MemoSection data={data} />
      </Wrapper>

      {/* 차단 확인 팝업 */}
      {isBlockBoxOpen && (
        <ConfirmModal
          width="540px"
          primaryButtonText="예"
          secondaryButtonText="아니요"
          onPrimaryClick={handleRunBlock}
          onSecondaryClick={() => setIsBlockBoxOpen(false)}
        >
          {isBlockedStatus ? (
            <MsgConfirm>{"차단을 해제 하시겠습니까?"}</MsgConfirm>
          ) : (
            <Msg>
              {
                "차단한 상대에게는 메시지를 받을 수 없으며\n매칭이 이루어지지 않습니다.\n\n차단하시겠습니까?"
              }
            </Msg>
          )}
        </ConfirmModal>
      )}

      {/* 차단 완료 팝업 */}
      {isBlockConfirmOpen && (
        <ConfirmModal
          width="540px"
          primaryButtonText="확인"
          onPrimaryClick={() => setIsBlockConfirmOpen(false)}
        >
          <MsgConfirm>{`${
            isBlockedStatus ? "차단이" : "차단 해제가"
          } 완료되었습니다.`}</MsgConfirm>
        </ConfirmModal>
      )}

      {/* 끌어올리기 확인 팝업 */}
      {isPullUpConfirmOpen && (
        <ConfirmModal
          width="540px"
          primaryButtonText="아니요"
          secondaryButtonText="예"
          onPrimaryClick={() => setIsPullUpConfirmOpen(false)}
          onSecondaryClick={handlePullUpAction}
        >
          <MsgConfirm>{`본 게시글을 끌어올리시겠습니까?`}</MsgConfirm>
        </ConfirmModal>
      )}
    </>
  );
};

export default PostItem;

const Wrapper = styled.div<{ $isClickable: boolean }>`
  cursor: ${({ $isClickable }) => ($isClickable ? "pointer" : "default")};

  @media (max-width: 700px) {
    background: ${theme.colors.gray100};
    border-radius: 8px;
    padding: 16px;
  }
`;

const Msg = styled.div`
  text-align: center;
  color: ${theme.colors.gray800};
  ${(props) => props.theme.fonts.regular25};
  margin: 28px 0;
`;

const MsgConfirm = styled(Msg)`
  ${(props) => props.theme.fonts.regular25};
  margin: 80px 0;
  @media (max-width: 700px) {
    ${(props) => props.theme.fonts.medium14};
    margin: 32px 0;
  }
`;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import styled from "styled-components";

import { deleteBlockMemberId, postBlockMemberId } from "@/@generated/api";
import {
  cancelFriendRequest,
  deleteFriend,
  deletePost,
  getMemberPost,
  pullUpPost,
  sendFriendRequest,
} from "@/api";
import {
  Alert,
  ConfirmModal,
  Layout,
  ReadBoard,
  ReportModal,
} from "@/components";
import ko from "@/constants/ko.json";
import { notify, useConfirmModalContext } from "@/hooks";
import { setRefresh } from "@/redux/slices/boardSlice";
import {
  setCloseModal,
  setCloseReadingModal,
  setOpenAlertModal,
  setOpenModal,
  setOpenPostingModal,
  setOpenReadingModal,
} from "@/redux/slices/modalSlice";
import { setPostStatus } from "@/redux/slices/postSlice";
import { theme } from "@/styles/theme";

import TableHead from "./Table/TableHead";
import TableRow from "./Table/TableRow";

import type { RootState } from "@/redux/store";
import type {
  AlertProps,
  BoardListDetail,
  MemberPost,
  MoreBoxMenuItems,
} from "@/types";
import type { TableTitleProps } from "@/types/board/table";

interface TableProps {
  title: TableTitleProps[];
  content: BoardListDetail[];
}

const Table = (props: TableProps) => {
  const { title, content } = props;
  const dispatch = useDispatch();
  const router = useRouter();
  const { openConfirmModal, closeConfirmModal } = useConfirmModalContext();

  const [isBoardId, setIsBoardId] = useState(0);
  const [isPost, setIsPost] = useState<MemberPost>();
  const isChatRoomOpen = useSelector(
    (state: RootState) => state.chat.isChatRoomOpen
  );
  const [copiedAlert, setCopiedAlert] = useState(false);

  const isReadingModal = useSelector(
    (state: RootState) => state.modal.readingModal
  );
  const isModalType = useSelector((state: RootState) => state.modal.modalType);
  const isUser = useSelector((state: RootState) => state.user);

  const [isBlockedStatus, setIsBlockedStatus] = useState(false);
  const [isFriendStatus, setIsFriendStatus] = useState(false);
  const [isMoreBoxOpen, setIsMoreBoxOpen] = useState(false);
  const [isBlockBoxOpen, setIsBlockBoxOpen] = useState(false);
  const [isBlockConfirmOpen, setIsBlockConfrimOpen] = useState(false);

  /* 로그아웃 시, 비회원 접근 시 알럿 props 설정 함수 */
  const logoutMessage = "로그아웃 되었습니다. 다시 로그인 해주세요.";
  const loginRequiredMessage = "로그인이 필요한 서비스입니다.";
  const deletedMessage = "해당 글은 삭제된 글입니다.";

  /* 게시글 열기 */
  const handlePostOpen = (boardId: number) => {
    const exists = content.some((board) => board.boardId === boardId);

    if (!exists) {
      return dispatch(
        setOpenAlertModal({
          icon: "trash",
          width: 45,
          height: 50,
          content: deletedMessage,
          alt: deletedMessage,
          buttonText: "확인",
        })
      );
    }

    dispatch(setOpenReadingModal());
    setIsBoardId(boardId);
  };

  const showAlertWithContent = (
    icon: string,
    content: string,
    handleAlertClose: () => void,
    btnText: string
  ) => {
    dispatch(
      setOpenAlertModal({
        icon,
        width: 68,
        height: 58,
        content,
        alt: "경고",
        buttonText: btnText,
        onClose: handleAlertClose,
      })
    );
  };

  useEffect(() => {
    /* 차단하기 확인 팝업 */
    if (!isBlockConfirmOpen) return;

    openConfirmModal({
      width: "540px",
      primaryButtonText: "확인",
      onPrimaryClick: () => {
        setIsBlockConfrimOpen(false);
      },
      children: (
        <MsgConfirm>{`${
          isBlockedStatus ? "차단이" : "차단 해제가"
        } 완료되었습니다.`}</MsgConfirm>
      ),
    });
  }, [isBlockConfirmOpen]);

  useEffect(() => {
    if (isReadingModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isReadingModal]);

  /* 소환사명 복사 */
  const handleTextClick = async (
    gameName: string,
    tag: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    const copied = `${gameName.replace(/\s+/g, "")}#${tag}`;
    try {
      await navigator.clipboard.writeText(copied);
      await setCopiedAlert(true);
    } catch (error) {
      console.error("복사 실패", error);
    }
  };

  /* 소환사명 복사 모달 */
  useEffect(() => {
    if (isModalType === "copied") {
      openConfirmModal({
        width: "540px",
        primaryButtonText: "확인",
        secondaryButtonText: "나가기",
        onPrimaryClick: handleModalClose,
        children: <Text>{`소환사명이 클립보드에 복사되었습니다.`}</Text>,
      });
    }
  }, [isModalType]);

  /* 소환사명 복사 멘트 3초후 사라짐 */
  useEffect(() => {
    let timer: any;
    if (copiedAlert) {
      timer = setTimeout(() => {
        setCopiedAlert(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [copiedAlert]);

  /* 다른 사람 프로필 이동 */
  const handleMoveProfilePage = (e: React.MouseEvent, memberId: number) => {
    e.stopPropagation();

    router.push(`/user/${memberId}`);
  };

  /* 모달 닫기 */
  const handleModalClose = () => {
    dispatch(setCloseModal());
  };

  /* 차단하기 및 차단 해제 */
  const handleBlock = async () => {
    /* 차단하기 팝업 */
    openConfirmModal({
      width: "540px",
      primaryButtonText: "예",
      secondaryButtonText: "아니요",
      onPrimaryClick: () => {
        handleRunBlock();
      },
      children: isBlockedStatus ? (
        <MsgConfirm>{"차단을 해제 하시겠습니까?"}</MsgConfirm>
      ) : (
        <Msg>
          {
            "차단한 상대에게는 메시지를 받을 수 없으며\n매칭이 이루어지지 않습니다.\n\n차단하시겠습니까?"
          }
        </Msg>
      ),
    });

    setIsMoreBoxOpen(false);
  };

  const handleRunBlock = async () => {
    // 차단하기 api
    setIsBlockBoxOpen(false);
    if (isPost) {
      if (isPost.isBlocked) {
        await deleteBlockMemberId(isPost.memberId);
        setIsBlockedStatus(false);
      } else {
        await postBlockMemberId(isPost.memberId);
        setIsBlockedStatus(true);
      }
    }
    setIsBlockConfrimOpen(true);
  };

  /* 친구 추가 */
  const handleFriendAdd = async () => {
    try {
      if (isPost) {
        await sendFriendRequest(isPost.memberId);
      }
      await handleMoreBoxClose();
      setIsFriendStatus(true);
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
      await handleMoreBoxClose();
      setIsFriendStatus(false);
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
      await handleMoreBoxClose();
      setIsFriendStatus(false);
    } catch (error) {
      console.error(error);
    }

    handleMoreBoxClose();
  };

  /* 게시글 끌어올리기 */
  const handlePullUp = () => {
    setIsMoreBoxOpen((prevState) => !prevState);
    if (isBoardId) {
      {
        /* 끌어올리기 확인 팝업 */
      }
      openConfirmModal({
        width: "540px",
        primaryButtonText: "아니요",
        secondaryButtonText: "예",
        onPrimaryClick: () => {
          closeConfirmModal();
        },
        onSecondaryClick: handlePullUpAction,
        children: <MsgConfirm>{`본 게시글을 끌어올리시겠습니까?`}</MsgConfirm>,
      });
      dispatch(setCloseReadingModal());
    }
  };

  const handlePullUpAction = async () => {
    // 게시판 끌어올리기 API
    dispatch(setCloseReadingModal());
    await pullUpPost(isBoardId);
    await dispatch(setRefresh());

    await notify({
      text: ko["board.pullup.success"],
      icon: "👌🏼",
      type: "success",
    });
  };

  /* 게시글 수정 */
  const handleEdit = async () => {
    setIsMoreBoxOpen((prevState) => !prevState);
    if (isBoardId) {
      await dispatch(setCloseReadingModal());
      await dispatch(setOpenPostingModal());
      dispatch(setPostStatus(""));
    }
  };

  /* 게시글 삭제 */
  const handleDelete = async () => {
    setIsMoreBoxOpen((prevState) => !prevState);
    try {
      await deletePost(isBoardId);
      await dispatch(setPostStatus("delete"));
      await dispatch(setCloseReadingModal());
      await dispatch(setPostStatus(""));
    } catch (error) {
      console.error(error);
    }
  };
  /* 신고하기 모달 오픈 */
  const handleReportModal = () => {
    // 신고하기 버튼 클릭 시점 토큰 만료
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

  /* 더보기 버튼 토글 */
  const handleMoreBoxToggle = async (boardId: number) => {
    setIsBoardId(boardId);
    const response = await getMemberPost(boardId);
    setIsPost(response.data);
    setIsMoreBoxOpen((prevState) => !prevState);
  };

  /* 더보기 버튼 닫기 */
  const handleMoreBoxClose = () => {
    setIsMoreBoxOpen(false);
  };

  /* 더보기 버튼 메뉴 */
  const MoreBoxMenuItems: MoreBoxMenuItems[] = [];

  if (isUser?.id === isPost?.memberId) {
    /* 내가 작성한 글 */
    MoreBoxMenuItems.push(
      { text: "끌어올리기", onClick: handlePullUp },
      { text: "수정", onClick: handleEdit },
      { text: "삭제", onClick: handleDelete }
    );
  } else {
    /* 다른 사람이 작성한 글 */
    //친구 삭제 - 차단되어있을 때, 친구일 때, 친구 추가 요청 중일 때
    //친구 추가(친구 요청) - 친구가 아닐 때, 차단되어있지 않을 때, 친구 추가 요청 중이 아닐 때
    //친구 요청 취소 - 친구 추가 요청 중일 떄
    //차단하기 - 친구 추가 요청 중일 때, 친구 삭제된 상태일 때, 차단되어있지 않을 때
    //차단해제 - 차단되어 있을 때,

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
      {isReadingModal && !isChatRoomOpen && <ReadBoard postId={isBoardId} />}

      {isChatRoomOpen && <Layout />}

      {copiedAlert && <Copied>소환사명이 클립보드에 복사되었습니다.</Copied>}
      <TableWrapper>
        <TableHead title={title} />
        {content?.length > 0 ? (
          <TableContent>
            {content?.map((data) => (
              <TableRow
                key={data.boardId}
                data={data}
                isUser={isUser}
                isBoardId={isBoardId}
                isMoreBoxOpen={isMoreBoxOpen}
                onRowClick={handlePostOpen}
                onMoveProfile={handleMoveProfilePage}
                onCopyText={handleTextClick}
                onMoreBoxToggle={handleMoreBoxToggle}
                onMoreBoxClose={handleMoreBoxClose}
                menuItems={MoreBoxMenuItems}
              />
            ))}
          </TableContent>
        ) : (
          <NoData>게시된 글이 없습니다.</NoData>
        )}
      </TableWrapper>

      {/* 신고하기 팝업 */}
      {isModalType === "report" && (
        <ReportModal isPost={isPost} postId={isBoardId} />
      )}
    </>
  );
};

export default Table;

const TableWrapper = styled.div`
  width: 100%;
  text-align: center;
  .table_width {
    &:first-child {
      width: 17%;
    }
    &:nth-child(2) {
      width: 13%;
    }
    &:nth-child(3) {
      width: 10%;
    }
    &:nth-child(4) {
      width: 12%;
    }
    &:nth-child(5) {
      width: 13%;
    }
    &:nth-child(6) {
      width: 20%;
    }
    &:nth-child(7) {
      width: 9%;
    }
    &:nth-child(8) {
      width: 15%;
    }
    &:last-child {
      width: 11%;
    }
  }
`;

const TableContent = styled.div``;

const NoData = styled.p`
  color: ${theme.colors.gray800};
  ${(props) => props.theme.fonts.medium16};
  text-align: center;
  margin-top: 47px;
`;

const Text = styled.div`
  text-align: center;
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.regular18};
  margin: 28px 0;
`;

const Copied = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 10px 28px;
  ${(props) => props.theme.fonts.regular14};
  background: ${theme.colors.white};
  color: rgba(45, 45, 45, 1);
  box-shadow: 0 0 25.3px 0 rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  white-space: nowrap;
  z-index: ${theme.zIndex.popup};
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
`;

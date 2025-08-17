import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import styled from "styled-components";

import { deletePost, getMemberPost, getNonMemberPost, pullUpPost } from "@/api";
import {
  Alert,
  Button,
  Champion,
  ConfirmModal,
  LoadingSpinner,
  MannerLevel,
  MannerLevelBox,
  MoreBox,
  RankTier,
} from "@/components/common";
import { CRModal, PositionBox, UserAccount } from "@/components/crBoard";
import {
  MoreBoxButton,
  ProfileImage,
  QueueType,
  ReportModal,
  WinningRate,
} from "@/components/readBoard";
import ko from "@/constants/ko.json";
import { notify, useConfirmModalContext } from "@/hooks";
import { setRefresh } from "@/redux/slices/boardSlice";
import {
  openChatRoom,
  setChatEnterType,
  setChatRoomUuid,
  setErrorMessage,
} from "@/redux/slices/chatSlice";
import {
  setCloseReadingModal,
  setOpenAlertModal,
  setOpenModal,
  setOpenPostingModal,
} from "@/redux/slices/modalSlice";
import { setCurrentPost, setPostStatus } from "@/redux/slices/postSlice";
import { theme } from "@/styles/theme";
import { setPostingDateFormatter } from "@/utils";
import { blockApi, friendApi } from "@/utils/api";

import GameStyle from "./GameStyle";

import type { AxiosError } from "axios";
import type { RootState } from "@/redux/store";
import type {
  AlertProps,
  GameMode,
  MemberPost,
  MoreBoxMenuItems,
} from "@/types";

interface ReadBoardProps {
  postId: number;
}

const ReadBoard = (props: ReadBoardProps) => {
  const { postId } = props;
  const dispatch = useDispatch();
  const router = useRouter();
  const mannerLevelBoxRef = useRef<HTMLDivElement>(null);
  const moreBoxRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const ignoreClickRef = useRef(false);

  const [isPost, setIsPost] = useState<MemberPost>();
  const [isMoreBoxOpen, setIsMoreBoxOpen] = useState(false);
  const [isMannerLevelBoxOpen, setIsMannerLevelBoxOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [gameMode, setGameMode] = useState<GameMode>("FAST");
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
  const [isBlockBoxOpen, setIsBlockBoxOpen] = useState(false);
  const [isBlockConfirmOpen, setIsBlockConfrimOpen] = useState(false);
  const [blockActionResult, setBlockActionResult] = useState<
    "blocked" | "unblocked" | null
  >(null);
  const [isPullUpConfirmOpen, setIsPullUpConfirmOpen] = useState(false);

  const isModalType = useSelector((state: RootState) => state.modal.modalType);
  const isUser = useSelector((state: RootState) => state.user);
  const isPostModalOpen = useSelector(
    (state: RootState) => state.modal.postingModal
  );
  const isErrorMessage = useSelector(
    (state: RootState) => state.chat.errorMessage
  );
  const { openConfirmModal, closeConfirmModal } = useConfirmModalContext();

  /* 로그아웃 시, 비회원 접근 시 알럿 props 설정 함수 */
  const logoutMessage = "로그아웃 되었습니다. 다시 로그인 해주세요.";
  const loginRequiredMessage = "로그인이 필요한 서비스입니다.";
  const deletedMessage = "해당 글은 삭제된 글입니다.";

  const showAlertWithContent = (
    icon: string,
    content: string,
    btnText: string,
    handleAlertClose?: () => void
  ) => {
    dispatch(
      setOpenAlertModal({
        icon: icon,
        width: 68,
        height: 58,
        content: content,
        alt: "경고",
        onClose: handleAlertClose,
        buttonText: btnText,
      })
    );
  };

  /* 게시글 api */
  const getPostData = async () => {
    try {
      setLoading(true);

      if (!!isUser.id && postId) {
        const memberData = await getMemberPost(postId);
        setIsPost(memberData.data);
        setGameMode(memberData.data.gameMode);
      } else if (!isUser.id && postId) {
        const nonMember = await getNonMemberPost(postId);
        setIsPost(nonMember.data);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (
        axiosError?.response?.data?.message === "해당 글은 삭제된 글입니다."
      ) {
        return showAlertWithContent("trash", deletedMessage, "확인", () => {
          dispatch(setCloseReadingModal());
        });
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(
    () => {
      getPostData();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isUser, postId]
  );

  useEffect(
    () => {
      return () => {
        dispatch(setCloseReadingModal());
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

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

  useEffect(() => {
    // 차단하기 확인 팝업
    if (isBlockConfirmOpen) {
      openConfirmModal({
        width: "540px",
        primaryButtonText: "확인",
        onPrimaryClick: () => {
          closeConfirmModal();
        },
        children: (
          <MsgConfirm>{`${
            blockActionResult === "unblocked" ? "차단 해제가" : "차단이"
          } 완료되었습니다.`}</MsgConfirm>
        ),
      });
    }
  }, [isBlockConfirmOpen, blockActionResult]);

  /* 신고하기 모달 오픈 */
  const handleReportModal = () => {
    // 신고하기 버튼 클릭 시점 토큰 만료
    if (!isUser.gameName) {
      return showAlertWithContent(
        "exclamation",
        logoutMessage,
        "로그인하기",
        () => router.push("/riot")
      );
    }

    dispatch(setOpenModal("report"));
    handleMoreBoxClose();
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
      children: isBlocked ? (
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
    if (!isUser.id) {
      return showAlertWithContent(
        "exclamation",
        logoutMessage,
        "로그인하기",
        () => router.push("/riot")
      );
    }

    if (!isPost || isUser.id === isPost?.memberId) return;

    // 차단하기
    closeConfirmModal();
    if (isPost) {
      const wasBlocked = isPost.isBlocked;

      if (wasBlocked) {
        await blockApi.unblockMember({ memberId: isPost.memberId });
        setBlockActionResult("unblocked");
        setIsPost((prev) => (prev ? { ...prev, isBlocked: false } : prev));
      } else {
        await blockApi.blockMember({ memberId: isPost.memberId });
        setBlockActionResult("blocked");
        setIsPost((prev) => (prev ? { ...prev, isBlocked: true } : prev));
      }

      setIsMoreBoxOpen(false);

      await getPostData();

      setIsBlockConfrimOpen(true);
    }
  };

  /* 친구 추가 */
  const handleFriendAdd = async () => {
    if (!isUser.id) {
      return showAlertWithContent(
        "exclamation",
        logoutMessage,
        "로그인하기",
        () => router.push("/riot")
      );
    }

    if (!isPost || isUser.id === isPost?.memberId) return;

    try {
      await friendApi.sendFriendRequest({ memberId: isPost.memberId });
      await handleMoreBoxClose();
      await getPostData();
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
    } finally {
      handleMoreBoxClose();
    }
  };

  /* 친구 요청 취소 */
  const handleCancelFriendReq = async () => {
    if (!isUser.id) {
      return showAlertWithContent(
        "exclamation",
        logoutMessage,
        "로그인하기",
        () => router.push("/riot")
      );
    }

    if (!isPost || isUser.id === isPost?.memberId) return;

    try {
      await friendApi.cancelFriendRequest({ memberId: isPost.memberId });
      await handleMoreBoxClose();
      await getPostData();
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
    } finally {
      handleMoreBoxClose();
    }
  };

  /* 친구 삭제 */
  const handleFriendDelete = async () => {
    if (!isUser.id) {
      return showAlertWithContent(
        "exclamation",
        logoutMessage,
        "로그인하기",
        () => router.push("/riot")
      );
    }

    if (!isPost || isUser.id === isPost?.memberId) return;

    try {
      await friendApi.deleteFriend({ memberId: isPost.memberId });
      await handleMoreBoxClose();
      await getPostData();
    } catch (error) {
      console.error(error);
    }

    handleMoreBoxClose();
  };

  /* 매너레벨 박스 열기 */
  const handleMannerLevelBoxOpen = () => {
    if (!isUser.id) {
      return showAlertWithContent("exclamation", loginRequiredMessage, "확인");
    }

    setIsMannerLevelBoxOpen((prevState) => !prevState);
  };

  /* 게시글 끌어올리기 */
  const handlePullUp = () => {
    if (!isUser.id) {
      return showAlertWithContent(
        "exclamation",
        logoutMessage,
        "로그인하기",
        () => router.push("/riot")
      );
    }

    if (isUser?.id !== isPost?.memberId) return;

    if (isPost) {
      /*끌어올리기 확인 팝업 */
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
    }
  };

  const handlePullUpAction = async () => {
    // 게시판 끌어올리기 API
    await closeConfirmModal();
    await pullUpPost(postId);
    await dispatch(setRefresh());
    await dispatch(setCloseReadingModal());
    await notify({
      text: ko["board.pullup.success"],
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
        "로그인하기",
        () => router.push("/riot")
      );
    }

    if (isUser?.id !== isPost?.memberId) return;

    if (isPost) {
      await dispatch(
        setCurrentPost({ currentPost: isPost, currentPostId: postId })
      );
      await dispatch(setCloseReadingModal());
      await dispatch(setOpenPostingModal());
      dispatch(setPostStatus(""));
    }
  };

  /* 게시글 삭제 */
  const handleDelete = async () => {
    if (!isUser.id) {
      return showAlertWithContent(
        "exclamation",
        logoutMessage,
        "로그인하기",
        () => router.push("/riot")
      );
    }

    if (isUser?.id !== isPost?.memberId) return;

    try {
      await deletePost(postId);
      await dispatch(setPostStatus("delete"));
      await dispatch(setCloseReadingModal());
      await dispatch(setPostStatus(""));
    } catch (error) {
      console.error(error);
    }
  };

  /* 더보기 버튼 토글 */
  const handleMoreBoxToggle = (e: React.MouseEvent) => {
    if (!isUser.id) {
      return showAlertWithContent("exclamation", loginRequiredMessage, "확인");
    }

    e.stopPropagation();
    ignoreClickRef.current = true;
    setIsMoreBoxOpen((prevState) => !prevState);
  };

  /* 더보기 버튼 닫기 */
  const handleMoreBoxClose = () => {
    setIsMoreBoxOpen(false);
  };

  /* 더보기 버튼 메뉴 */
  const {
    MoreBoxMenuItems,
    isFriend,
    isBlocked,
    isMyPost,
    hasSentFriendRequest,
  } = useMemo(() => {
    const isFriend = isPost?.isFriend;
    const isBlocked = isPost?.isBlocked;
    const isMyPost = isUser?.id === isPost?.memberId;
    const hasSentFriendRequest = isPost?.friendRequestMemberId === isUser.id;

    const MoreBoxMenuItems: MoreBoxMenuItems[] = [];

    if (isMyPost) {
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

      if (!isBlocked) {
        if (isFriend) {
          friendText = "친구 삭제";
          friendFunc = handleFriendDelete;
        } else {
          if (!isFriend && !hasSentFriendRequest) {
            friendText = "친구 추가";
            friendFunc = handleFriendAdd;
          }
          if (!isFriend && hasSentFriendRequest) {
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
          text: isBlocked ? "차단 해제" : "차단하기",
          onClick: handleBlock,
        },
        { text: "신고하기", onClick: handleReportModal }
      );
    }

    return {
      MoreBoxMenuItems,
      isFriend,
      isBlocked,
      isMyPost,
      hasSentFriendRequest,
    };
  }, [
    isPost?.isBlocked,
    isPost?.isFriend,
    isPost?.friendRequestMemberId,
    isPost?.memberId,
    isUser?.id,
    isPost,
  ]);

  /* 로딩 스피너 */
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  /* 채팅방 연결 */
  const handleChatStart = async () => {
    if (!isUser.id) {
      // 비회원 게스트용
      if (isPost) {
        await dispatch(
          setCurrentPost({ currentPost: isPost, currentPostId: postId })
        );
        dispatch(setChatRoomUuid(isPost.boardId));
        dispatch(setCloseReadingModal());
        dispatch(openChatRoom());
        dispatch(setChatEnterType(2));
      }
    }

    if (isPost?.isBlocked) {
      return notify({
        text: ko["chat.blocked.error"],
        icon: "🚫",
        type: "error",
      });
    }

    if (isErrorMessage) {
      alert(isErrorMessage);
      dispatch(setErrorMessage(null));
    } else {
      try {
        dispatch(setCloseReadingModal());
        if (isPost) {
          dispatch(setChatRoomUuid(isPost.boardId));
          dispatch(openChatRoom());
          dispatch(setChatEnterType(2)); // 게시글에서 채팅방 입장
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <CRModal
        type="reading"
        hideContent={showAlert}
        onClose={() => dispatch(setCloseReadingModal())}
      >
        {isPost && (
          <>
            <Wrapper>
              <UserSection>
                <UserLeft>
                  <UserProfileWrapper>
                    <ProfileImage image={isPost.profileImage} />
                    <UserNManner>
                      <MannerLevelWrapper>
                        <MannerLevel
                          level={isPost.mannerLevel}
                          onClick={handleMannerLevelBoxOpen}
                          position="board"
                        />
                        {isMannerLevelBoxOpen && (
                          <div ref={mannerLevelBoxRef}>
                            <MannerLevelBox
                              memberId={isPost.memberId}
                              level={isPost.mannerLevel}
                              top="40px"
                              right="-780%"
                              tail={true}
                              tailPosition="top"
                              onClose={() =>
                                setIsMannerLevelBoxOpen(!isMannerLevelBoxOpen)
                              }
                            />
                          </div>
                        )}
                      </MannerLevelWrapper>
                    </UserNManner>
                  </UserProfileWrapper>
                  <UserAccount
                    account={isPost.gameName}
                    memberId={isPost.memberId}
                    mike={isPost.mike}
                    tag={isPost.tag}
                  />
                </UserLeft>
                <UserRight ref={moreBoxRef}>
                  <MoreBoxButton
                    ref={buttonRef}
                    onClick={handleMoreBoxToggle}
                  />
                  {isMoreBoxOpen && (
                    <MoreBox
                      items={MoreBoxMenuItems}
                      top={67}
                      right={45}
                      onClose={() => setIsMoreBoxOpen(false)}
                      moreAreaRef={moreBoxRef}
                    />
                  )}
                </UserRight>
              </UserSection>
              <UserTierWrapper>
                <RankTier
                  type="solo"
                  tier={isPost.soloTier || ""}
                  rank={isPost.soloRank}
                  direct="column"
                  color={theme.colors.gray800}
                  tierFontSize={theme.fonts.bold20}
                />
                <RankTier
                  type="free"
                  tier={isPost.freeTier || ""}
                  rank={isPost.freeRank}
                  direct="column"
                  color={theme.colors.gray800}
                  tierFontSize={theme.fonts.bold20}
                />
              </UserTierWrapper>
              {gameMode !== "ARAM" && (
                <PositionSection>
                  <Title>포지션</Title>
                  <PositionBox
                    status="reading"
                    main={isPost.mainP || null}
                    sub={isPost.subP || null}
                    want={
                      Array.isArray(isPost.wantP)
                        ? isPost.wantP.filter((v) => v !== null)
                        : null
                    }
                  />
                </PositionSection>
              )}
              <ChampionNQueueSection>
                <QueueType value={isPost.gameMode} />
                <Champion
                  title={true}
                  font="semiBold14"
                  list={isPost?.championStatsResponseList}
                />
              </ChampionNQueueSection>
              <WinningRateSection $gameType={gameMode}>
                <WinningRate
                  completed={isPost.winRate}
                  recentGameCount={isPost?.recentGameCount}
                />
              </WinningRateSection>
              <StyleSection $gameType={gameMode}>
                <Title>게임 스타일</Title>
                <GameStyle styles={isPost.gameStyles} />
              </StyleSection>
              <MemoSection $gameType={gameMode}>
                <Title>한마디</Title>
                <Memo>
                  <MemoData>{isPost.contents}</MemoData>
                </Memo>
                <UpdatedDate>
                  게시일 :{" "}
                  {setPostingDateFormatter(isPost.bumpTime || isPost.createdAt)}
                </UpdatedDate>
              </MemoSection>
            </Wrapper>
            {isUser.gameName !== isPost.gameName ? (
              <ButtonContent $gameType={gameMode}>
                <Button
                  type="submit"
                  buttonType="primary"
                  text={"말 걸어보기"}
                  onClick={handleChatStart}
                />
              </ButtonContent>
            ) : (
              // isPostStatus === "pullup" && (
              <ButtonContent $gameType={gameMode}>
                <Button
                  type="submit"
                  buttonType="primary"
                  text={"끌어올리기"}
                  onClick={handlePullUpAction}
                />
              </ButtonContent>
              // )
            )}
          </>
        )}
      </CRModal>

      {isModalType === "report" && (
        <ReportModal isPost={isPost} postId={postId} />
      )}
    </>
  );
};

export default ReadBoard;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    gap: 20px;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;
`;

const UserLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    gap: 8px;
  }
`;

const UserProfileWrapper = styled.div`
  width: 80px;
  height: 80px;
  position: relative;
  z-index: ${theme.zIndex.popup};

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 52px;
    height: 52px;
  }
`;

const UserNManner = styled.div`
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
`;

const MannerLevelWrapper = styled.div`
  position: relative;
`;

const UserTierWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  gap: 28px;
`;

const UserRight = styled.div`
  display: flex;
`;

const Title = styled.p`
  ${(props) => props.theme.fonts.semiBold14};
  color: ${theme.colors.gray800};
  margin-bottom: 5px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) => props.theme.fonts.medium11};
    margin-bottom: 4px;
  }
`;

const ChampionNQueueSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  gap: 8px;
`;

const PositionSection = styled.div``;

const WinningRateSection = styled.div<{ $gameType: GameMode }>`
  margin-top: ${({ $gameType }) => ($gameType !== "ARAM" ? "0px" : "46px")};
`;

const StyleSection = styled.div<{ $gameType: GameMode }>`
  margin-top: ${({ $gameType }) => ($gameType !== "ARAM" ? "0px" : "46px")};
`;

const MemoSection = styled.div<{ $gameType: GameMode }>`
  margin-top: ${({ $gameType }) => ($gameType !== "ARAM" ? "0px" : "46px")};
`;

const Memo = styled.div`
  width: 100%;
  min-height: 100px;
  max-height: 220px;
  padding: 11px 20px;
  border-radius: 15px;
  border: 1px solid ${theme.colors.gray400};
  overflow-y: scroll;

  /* 스크롤바 */
  &::-webkit-scrollbar {
    width: 16px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: ${theme.colors.gray500};
    background-clip: padding-box;
    border: 6px solid transparent;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    border-radius: 6px;
    padding: 8px 10px;
  }
`;

const MemoData = styled.p`
  color: ${theme.colors.gray700};
  ${(props) => props.theme.fonts.regular18}

  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) => props.theme.fonts.regular12};
  }
`;

const UpdatedDate = styled.p`
  ${(props) => props.theme.fonts.medium11};
  color: ${theme.colors.gray500};
  text-align: right;
  margin-top: 6px;
`;

const ButtonContent = styled.p<{ $gameType: GameMode }>`
  margin: ${({ $gameType }) => ($gameType !== "ARAM" ? "30px" : "150px")} 0 28px;
  text-align: center;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const ReportLabel = styled.p`
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.semiBold18};
  margin-bottom: 12px;
`;

const ReportContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

const ReportReasonContent = styled(ReportContent)`
  margin-bottom: 38px;
`;

const ReportButton = styled.div`
  margin-top: 21px;
`;

const Msg = styled.div`
  text-align: center;
  color: ${theme.colors.gray800};
  ${(props) => props.theme.fonts.regular25};
  margin: 28px 0;
  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) => props.theme.fonts.medium14};
  }
`;

const MsgConfirm = styled(Msg)`
  ${(props) => props.theme.fonts.regular25};
  margin: 80px 0;
  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) => props.theme.fonts.medium14};
    margin: 32px 0;
  }
`;

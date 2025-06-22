import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import ConfirmModal from "../common/ConfirmModal";
import MoreBoxButton from "../readBoard/MoreBoxButton";
import MoreBox from "@/components/common/MoreBox";
import MannerLevel from "@/components/common/MannerLevel";
import MannerLevelBox from "@/components/common/MannerLevelBox";
import PositionBox from "@/components/crBoard/PositionBox";
import Champion from "@/components/readBoard/Champion";
import ProfileImage from "@/components/readBoard/ProfileImage";
import Alert from "@/components/common/Alert";
import Layout from "@/components/chat/Layout";
import ReadBoard from "@/components/readBoard/ReadBoard";

import { setDateFormatter } from "@/utils/timeFormat";

import { RootState } from "@/redux/store";
import {
  setCloseModal,
  setCloseReadingModal,
  setOpenPostingModal,
  setOpenReadingModal,
  setOpenModal,
} from "@/redux/slices/modalSlice";
import { setCurrentPost, setPostStatus } from "@/redux/slices/postSlice";
import { setRefresh } from "@/redux/slices/boardSlice";
import { notify } from "@/hooks/notify";

import { deletePost, getMemberPost, pullUpPost } from "@/api/board/board";
import { deleteFriend } from "@/api/friend/delete";
import { cancelFriendRequest, sendFriendRequest } from "@/api/friend/request";
import { blockMember, unblockMember } from "@/api/block/block";

import { BoardListDetail, MemberPost } from "@/interface/board";
import { MoreBoxMenuItems } from "@/interface/moreBox";
import { GameMode } from "@/types/game/gameMode";
import { AlertProps } from "@/interface/modal";
import ReportModal from "@/components/readBoard/ReportModal";

interface PostListProps {
  content: BoardListDetail[];
}

const PostList = ({ content }: PostListProps) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [isBoardId, setIsBoardId] = useState(0);
  const [isPost, setIsPost] = useState<MemberPost>();
  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");
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
  const [isBlockBoxOpen, setIsBlockBoxOpen] = useState(false);
  const [isFriendStatus, setIsFriendStatus] = useState(false);
  const [isMoreBoxOpen, setIsMoreBoxOpen] = useState(false);
  const [isBlockConfirmOpen, setIsBlockConfrimOpen] = useState(false);
  const [isPullUpConfirmOpen, setIsPullUpConfirmOpen] = useState(false);

  const [isMannerLevelBoxOpen, setIsMannerLevelBoxOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [reportDetail, setReportDetail] = useState<string>("");
  const [gameMode, setGameMode] = useState<GameMode>("FAST");
  const [alertProps, setAlertProps] = useState<AlertProps>({
    icon: "",
    width: 0,
    height: 0,
    content: "",
    alt: "",
    onClose: () => {},
    buttonText: "",
  });

  const isPostModalOpen = useSelector(
    (state: RootState) => state.modal.postingModal
  );
  const isErrorMessage = useSelector(
    (state: RootState) => state.chat.errorMessage
  );

  /* 로그아웃 시, 비회원 접근 시 알럿 props 설정 함수 */
  const logoutMessage = "로그아웃 되었습니다. 다시 로그인 해주세요.";
  const loginRequiredMessage = "로그인이 필요한 서비스입니다.";
  const deletedMessage = "해당 글은 삭제된 글입니다.";

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

  /* 게시글 열기 */
  const handlePostOpen = (boardId: number) => {
    const exists = content.some((board) => board.boardId === boardId);

    if (!exists) {
      setAlertContent("해당 글은 삭제된 글입니다.");
      return setShowAlert(true);
    }

    dispatch(setOpenReadingModal());
    setIsBoardId(boardId);
  };

  useEffect(() => {
    return () => {
      dispatch(setCloseReadingModal());
    };
  }, []);

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
    setIsBlockBoxOpen(!isBlockBoxOpen);
    setIsMoreBoxOpen(false);
  };

  const handleRunBlock = async () => {
    // 차단하기 api
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
      setIsPullUpConfirmOpen(true);
      dispatch(setCloseReadingModal());
    }
  };

  const handlePullUpAction = async () => {
    // 게시판 끌어올리기 API
    dispatch(setCloseReadingModal());
    await setIsPullUpConfirmOpen(false);
    await pullUpPost(isBoardId);
    await dispatch(setRefresh());

    await notify({
      text: "끌어올리기가 완료되었습니다",
      icon: "👌🏼",
      type: "success",
    });
  };

  /* 게시글 수정 */
  const handleEdit = async () => {
    setIsMoreBoxOpen((prevState) => !prevState);
    if (isBoardId) {
      await dispatch(setOpenPostingModal());
      await dispatch(setCloseReadingModal());
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
      {showAlert && (
        <Alert
          icon={
            alertContent === "로그인이 필요한 서비스입니다."
              ? "exclamation"
              : "trash"
          }
          width={45}
          height={50}
          content={alertContent}
          alt={alertContent}
          onClose={() => setShowAlert(false)}
          buttonText="확인"
        />
      )}
      {isReadingModal && !isChatRoomOpen && <ReadBoard postId={isBoardId} />}

      {isChatRoomOpen && <Layout />}
      <ListWrapper>
        {content?.length > 0 ? (
          content.map((data) => (
            <Wrapper
              key={data.boardId}
              onClick={() => {
                setIsMoreBoxOpen(false);
                handlePostOpen(data.boardId);
              }}
            >
              <UserSection>
                <UserLeft>
                  <UserProfileWrapper>
                    <ProfileImage image={data.profileImage} />
                    <UserNManner>
                      <MannerLevelWrapper>
                        <MannerLevel
                          level={data.mannerLevel}
                          position="board"
                          isBubbleHide={true}
                          onClick={() => {}}
                        />
                      </MannerLevelWrapper>
                    </UserNManner>
                  </UserProfileWrapper>
                  <UserAccountWrapper>
                    <UserAccountRow>
                      <UserAccount>{data.gameName}</UserAccount>
                    </UserAccountRow>
                    {data.tag && <UserAccountTag>#{data.tag}</UserAccountTag>}
                  </UserAccountWrapper>
                </UserLeft>
                <UserRight>
                  {isUser.id ? (
                    <More>
                      <MoreBoxButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoreBoxToggle(data.boardId);
                        }}
                      />
                      {isMoreBoxOpen && isBoardId === data.boardId && (
                        <MoreBox
                          items={MoreBoxMenuItems}
                          top={30}
                          right={10}
                          onClose={() => setIsMoreBoxOpen(false)}
                        />
                      )}
                    </More>
                  ) : null}
                </UserRight>
              </UserSection>

              {gameMode !== "ARAM" && (
                <PositionSection>
                  <PositionBox
                    status="reading"
                    main={data.mainP || null}
                    sub={data.subP || null}
                    want={
                      Array.isArray(data.wantP)
                        ? data.wantP.filter((v) => v !== null)
                        : null
                    }
                  />
                </PositionSection>
              )}
              <ChampionNWinRateSection>
                <Champion
                  font="semiBold14"
                  list={data.championStatsResponseList}
                />
                <WinRate>
                  승률
                  <Rate $rate={data.winRate}>{data.winRate}%</Rate>
                </WinRate>
              </ChampionNWinRateSection>

              <MemoSection $gameType={gameMode}>
                <Memo>
                  <MemoData>{data.contents}</MemoData>
                </Memo>
                <UpdatedDate>{setDateFormatter(data.createdAt)}</UpdatedDate>
              </MemoSection>
            </Wrapper>
          ))
        ) : (
          <NoData>게시된 글이 없습니다.</NoData>
        )}
      </ListWrapper>

      {/* 차단하기 팝업 */}
      {isBlockBoxOpen && (
        <ConfirmModal
          width="540px"
          primaryButtonText="예"
          secondaryButtonText="아니요"
          onPrimaryClick={() => {
            handleRunBlock();
          }}
          onSecondaryClick={() => {
            setIsBlockBoxOpen(false);
          }}
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
      {/* 차단하기 확인 팝업 */}
      {isBlockConfirmOpen && (
        <ConfirmModal
          width="540px"
          primaryButtonText="확인"
          onPrimaryClick={() => {
            setIsBlockConfrimOpen(false);
          }}
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
          onPrimaryClick={() => {
            setIsPullUpConfirmOpen(false);
          }}
          onSecondaryClick={handlePullUpAction}
        >
          <MsgConfirm>{`본 게시글을 끌어올리시겠습니까?`}</MsgConfirm>
        </ConfirmModal>
      )}
      {/* 신고하기 팝업 */}
      {isModalType === "report" && (
        <ReportModal isPost={isPost} postId={isBoardId} />
      )}
    </>
  );
};

export default PostList;

const ListWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const NoData = styled.div`
  width: 100%;
  margin: 40px 0 300px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${theme.colors.gray700};
  ${theme.fonts.regular14}
`;

const Wrapper = styled.div`
  cursor: pointer;
  @media (max-width: 700px) {
    background: ${theme.colors.gray100};
    border-radius: 8px;
    padding: 16px;
  }
`;

const UserSection = styled.div`
  @media (max-width: 700px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    white-space: nowrap;
    margin-bottom: 24px;
  }
`;

const UserLeft = styled.div`
  @media (max-width: 700px) {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const UserProfileWrapper = styled.div`
  @media (max-width: 700px) {
    position: relative;
    z-index: 2;
  }
`;

const UserNManner = styled.div`
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
`;

const MannerLevelWrapper = styled.div`
  position: relative;
`;

const UserAccountWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserAccountRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UserAccount = styled.p`
  ${(props) => props.theme.fonts.bold20};
  color: ${theme.colors.gray700};

  @media (max-width: 700px) {
    ${(props) => props.theme.fonts.bold16};
  }
`;

const UserAccountTag = styled.p`
  ${(props) => props.theme.fonts.semiBold14};
  color: ${theme.colors.gray500};

  @media (max-width: 700px) {
    ${(props) => props.theme.fonts.semiBold12};
  }
`;

const UserTierWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  margin: 17px 0 23px;
`;
const Bar = styled.div`
  width: 1px;
  height: 12px;
  background: ${theme.colors.gray400};
`;
const UserRight = styled.div`
  position: relative;
  display: flex;
  width: 25px;
  height: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const ThreeDotsImage = styled(Image)`
  width: 15px;
  cursor: pointer;
`;
const More = styled.div`
  position: relative;
`;

const ChampionNWinRateSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

const WinRate = styled.div`
  ${theme.fonts.medium11};
  color: ${theme.colors.gray800};
`;

const Rate = styled.div<{ $rate: number }>`
  /* 승률에 따라 색상 변경 */
  color: ${({ $rate }) =>
    $rate >= 70
      ? "#CA1FCF"
      : $rate >= 50
      ? theme.colors.violet600
      : theme.colors.gray700};
  ${theme.fonts.bold16};
`;
const PositionSection = styled.div`
  margin-bottom: 16px;
`;

const MemoSection = styled.div<{ $gameType: GameMode }>`
  /* margin-top: ${({ $gameType }) =>
    $gameType !== "ARAM" ? "0px" : "46px"}; */
`;

const Memo = styled.div`
  @media (max-width: 700px) {
    width: 100%;
    height: 52px;
    padding: 11px 20px;
    border-radius: 15px;
    border: 1px solid ${theme.colors.gray400};
    overflow: hidden;

    border-radius: 6px;
    padding: 8px 10px;
  }
`;

const MemoData = styled.p`
  @media (max-width: 700px) {
    display: -webkit-box;
    word-wrap: break-word;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    overflow: hidden;
    color: ${theme.colors.gray700};
    ${(props) => props.theme.fonts.regular12};
  }
`;

const UpdatedDate = styled.p`
  ${(props) => props.theme.fonts.medium11};
  color: ${theme.colors.gray500};
  text-align: right;
  margin-top: 6px;
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

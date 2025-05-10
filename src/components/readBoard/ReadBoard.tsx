import styled from "styled-components";
import { theme } from "@/styles/theme";
import CRModal from "../crBoard/CRModal";
import Button from "../common/Button";
import PositionBox from "../crBoard/PositionBox";
import { useEffect, useRef, useState } from "react";
import ProfileImage from "./ProfileImage";
import MannerLevel from "../common/MannerLevel";
import Mic from "../common/Mic";
import MoreBoxButton from "./MoreBoxButton";
import Champion from "./Champion";
import QueueType from "./QueueType";
import WinningRate from "./WinningRate";
import MannerLevelBox from "../common/MannerLevelBox";
import GameStyle from "./GameStyle";
import { MoreBoxMenuItems } from "@/interface/moreBox";
import MoreBox from "../common/MoreBox";
import { MemberPost } from "@/interface/board";
import { deletePost, getMemberPost, getNonMemberPost } from "@/api/board/board";
import LoadingSpinner from "../common/LoadingSpinner";
import { setPostingDateFormatter } from "@/utils/custom";
import { reportMember } from "@/api/report/report";
import FormModal from "../common/FormModal";
import Input from "../common/Input";
import Checkbox from "../common/Checkbox";
import { REPORT_REASON } from "@/constants/report";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { AxiosError } from "axios";
import {
  setCloseModal,
  setCloseReadingModal,
  setOpenModal,
  setOpenPostingModal,
} from "@/redux/slices/modalSlice";
import { setCurrentPost, setPostStatus } from "@/redux/slices/postSlice";
import Alert from "../common/Alert";
import { AlertProps } from "@/interface/modal";
import { useRouter } from "next/navigation";
import {
  openChatRoom,
  setChatEnterType,
  setChatRoomUuid,
  setErrorMessage,
} from "@/redux/slices/chatSlice";
import { notify } from "@/hooks/notify";
import ConfirmModal from "../common/ConfirmModal";
import { cancelFriendRequest, sendFriendRequest } from "@/api/friend/request";
import { deleteFriend } from "@/api/friend/delete";
import { blockMember, unblockMember } from "@/api/block/block";
import { GameMode } from "@/types/game/gameMode";
import UserAccount from "../crBoard/UserAccount";
import UserTier from "../crBoard/UserTier";
import { getAccessToken } from "@/utils/storage";

interface ReadBoardProps {
  postId: number;
}

const ReadBoard = (props: ReadBoardProps) => {
  const { postId } = props;

  const dispatch = useDispatch();
  const router = useRouter();
  const mannerLevelBoxRef = useRef<HTMLDivElement>(null);

  const [isPost, setIsPost] = useState<MemberPost>();
  const [isMoreBoxOpen, setIsMoreBoxOpen] = useState(false);
  const [isMannerLevelBoxOpen, setIsMannerLevelBoxOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isBlockedStatus, setIsBlockedStatus] = useState(false);
  const [isFriendStatus, setIsFriendStatus] = useState(false);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [reportDetail, setReportDetail] = useState<string>("");
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

  const isModalType = useSelector((state: RootState) => state.modal.modalType);
  const isUser = useSelector((state: RootState) => state.user);
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

  /* 게시글 api */
  const getPostData = async () => {
    try {
      setLoading(true);

      if (!!isUser.id && postId) {
        const memberData = await getMemberPost(postId);
        setIsPost(memberData.data);
        setGameMode(memberData.data.gameMode);
        setIsBlockedStatus(memberData.data.isBlocked);
      } else if (!isUser.id && postId) {
        const nonMember = await getNonMemberPost(postId);
        setIsPost(nonMember.data);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (
        axiosError?.response?.data?.message === "해당 글은 삭제된 글입니다."
      ) {
        return showAlertWithContent(
          "trash",
          deletedMessage,
          () => {
            setShowAlert(false);
            dispatch(setCloseReadingModal());
          },
          "확인"
        );
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPostData();
  }, [isBlockedStatus, isFriendStatus, isUser, postId]);

  useEffect(() => {
    return () => {
      dispatch(setCloseReadingModal());
    };
  }, []);

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

  /* 신고하기 모달 오픈 */
  const handleReportModal = () => {
    // 신고하기 버튼 클릭 시점 토큰 만료
    if (!isUser.gameName) {
      return showAlertWithContent(
        "exclamation",
        logoutMessage,
        () => router.push("/login"),
        "로그인하기"
      );
    }

    dispatch(setOpenModal("report"));
    handleMoreBoxClose();
  };

  /* 신고하기 */
  const handleReport = async () => {
    if (!isUser.gameName) {
      return showAlertWithContent(
        "exclamation",
        logoutMessage,
        () => router.push("/login"),
        "로그인하기"
      );
    }

    if (!isPost || isUser.id === isPost?.memberId) return;

    const params = {
      memberId: isPost.memberId,
      reportCodeList: checkedItems,
      contents: reportDetail,
      pathCode: 1, // BOARD
      boardId: postId,
    };

    try {
      await reportMember(params);
      await handleModalClose();
      await getPostData();
    } catch (error) {
      console.error(error);
    }
  };

  /* 차단하기 및 차단 해제 */
  const handleBlock = async () => {
    setIsBlockBoxOpen(!isBlockBoxOpen);
    setIsMoreBoxOpen(false);
  };

  const handleRunBlock = async () => {
    if (!isUser.id) {
      return showAlertWithContent(
        "exclamation",
        logoutMessage,
        () => router.push("/login"),
        "로그인하기"
      );
    }

    if (!isPost || isUser.id === isPost?.memberId) return;

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
    if (!isUser.id) {
      return showAlertWithContent(
        "exclamation",
        logoutMessage,
        () => router.push("/login"),
        "로그인하기"
      );
    }

    if (!isPost || isUser.id === isPost?.memberId) return;

    try {
      await sendFriendRequest(isPost.memberId);
      await handleMoreBoxClose();
      await getPostData();
      setIsFriendStatus(true);
    } catch (error) {
      console.error(error);
    }

    handleMoreBoxClose();
  };

  /* 친구 요청 취소 */
  const handleCancelFriendReq = async () => {
    if (!isUser.id) {
      return showAlertWithContent(
        "exclamation",
        logoutMessage,
        () => router.push("/login"),
        "로그인하기"
      );
    }

    if (!isPost || isUser.id === isPost?.memberId) return;

    try {
      await cancelFriendRequest(isPost.memberId);
      await handleMoreBoxClose();
      await getPostData();
      setIsFriendStatus(false);
    } catch (error) {
      console.error(error);
    }

    handleMoreBoxClose();
  };

  /* 친구 삭제 */
  const handleFriendDelete = async () => {
    if (!isUser.id) {
      return showAlertWithContent(
        "exclamation",
        logoutMessage,
        () => router.push("/login"),
        "로그인하기"
      );
    }

    if (!isPost || isUser.id === isPost?.memberId) return;

    try {
      await deleteFriend(isPost.memberId);
      await handleMoreBoxClose();
      await getPostData();
      setIsFriendStatus(false);
    } catch (error) {
      console.error(error);
    }

    handleMoreBoxClose();
  };

  /* 매너레벨 박스 열기 */
  const handleMannerLevelBoxOpen = () => {
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

  /* 신고하기 사유 */
  const handleCheckboxChange = (checked: number) => {
    setCheckedItems((prev) =>
      prev.includes(checked)
        ? prev.filter((c) => c !== checked)
        : [...prev, checked]
    );
  };

  /* 게시글 수정 */
  const handleEdit = async () => {
    if (!isUser.id) {
      return showAlertWithContent(
        "exclamation",
        logoutMessage,
        () => router.push("/login"),
        "로그인하기"
      );
    }

    if (isUser?.id !== isPost?.memberId) return;

    if (isPost) {
      await dispatch(
        setCurrentPost({ currentPost: isPost, currentPostId: postId })
      );
      await dispatch(setOpenPostingModal());
      await dispatch(setCloseReadingModal());
      dispatch(setPostStatus(""));
    }
    console.log("isPostModalOpen 상태:", isPostModalOpen);
  };

  /* 게시글 삭제 */
  const handleDelete = async () => {
    if (!isUser.id) {
      return showAlertWithContent(
        "exclamation",
        logoutMessage,
        () => router.push("/login"),
        "로그인하기"
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
  const handleMoreBoxToggle = () => {
    if (!isUser.id) {
      return showAlertWithContent(
        "exclamation",
        loginRequiredMessage,
        () => setShowAlert(false),
        "확인"
      );
    }

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

  /* 신고하기 모달 닫기 */
  const handleModalClose = () => {
    setCheckedItems([]);
    setReportDetail("");
    dispatch(setCloseModal());
  };

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
    console.log("0");
    if (!isUser.id) {
      // 비회원 게스트용
      console.log("1");
      if (isPost) {
        console.log("2");
        await dispatch(
          setCurrentPost({ currentPost: isPost, currentPostId: postId })
        );
        console.log("3");
        dispatch(setChatRoomUuid(isPost.boardId));
        dispatch(setCloseReadingModal());
        dispatch(openChatRoom());
        dispatch(setChatEnterType(2));
      }
    }

    if (isPost?.isBlocked) {
      return notify({
        text: "차단한 회원과는 채팅이 불가합니다",
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
        {showAlert ? (
          <Alert {...alertProps} />
        ) : (
          isPost && (
            <>
              {isMoreBoxOpen && (
                <MoreBox
                  items={MoreBoxMenuItems}
                  top={67}
                  left={544}
                  onClose={() => setIsMoreBoxOpen(false)}
                />
              )}
              <UpdatedDate>
                게시일 : {setPostingDateFormatter(isPost.createdAt)}
              </UpdatedDate>
              <UserSection>
                <UserLeft>
                  <ProfileImage image={isPost.profileImage} />
                  <UserWapper>
                    <UserAccount account={isPost.gameName} tag={isPost.tag} />
                    <UserTierWrapper>
                      <UserTier
                        soloTier={isPost.soloTier || ""}
                        freeTier={isPost.freeTier || ""}
                        soloRank={isPost.soloRank}
                        freeRank={isPost.freeRank}
                      />
                    </UserTierWrapper>
                  </UserWapper>
                  <UserNManner>
                    <MannerLevelWrapper>
                      <MannerLevel
                        level={isPost.mannerLevel}
                        onClick={handleMannerLevelBoxOpen}
                        position="top"
                      />
                      {isMannerLevelBoxOpen && (
                        <div ref={mannerLevelBoxRef}>
                          <MannerLevelBox
                            memberId={isPost.memberId}
                            level={isPost.mannerLevel}
                            top="69%"
                            right="-400%"
                          />
                        </div>
                      )}
                    </MannerLevelWrapper>
                  </UserNManner>
                </UserLeft>
                <UserRight>
                  <Mic status={isPost.mike} />
                  <MoreBoxButton onClick={handleMoreBoxToggle} />
                </UserRight>
              </UserSection>
              <ChampionNQueueSection>
                <Champion
                  title={true}
                  font="semiBold14"
                  list={isPost?.championStatsResponseList}
                />
                <QueueType value={isPost.gameMode} />
              </ChampionNQueueSection>
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
                <Title>메모</Title>
                <Memo>
                  <MemoData>{isPost.contents}</MemoData>
                </Memo>
              </MemoSection>
              {isUser.gameName !== isPost.gameName && (
                <ButtonContent $gameType={gameMode}>
                  <Button
                    type="submit"
                    buttonType="primary"
                    text="말 걸어보기"
                    onClick={handleChatStart}
                  />
                </ButtonContent>
              )}
            </>
          )
        )}
      </CRModal>

      {isModalType === "report" && (
        <FormModal
          type="checkbox"
          title="유저 신고하기"
          width="494px"
          height="721px"
          closeButtonWidth={17}
          closeButtonHeight={17}
          borderRadius="20px"
          onClose={handleModalClose}
        >
          <div>
            <ReportLabel>신고 사유</ReportLabel>
            <ReportReasonContent>
              {REPORT_REASON.map((data) => (
                <Checkbox
                  key={data.id}
                  value={data.id}
                  label={data.text}
                  fontSize="regular18"
                  isChecked={checkedItems.includes(data.id)}
                  onArrayChange={handleCheckboxChange}
                  id={`report${data.id}`}
                />
              ))}
            </ReportReasonContent>
            <ReportLabel>상세 내용</ReportLabel>
            <ReportContent>
              <Input
                inputType="textarea"
                value={reportDetail}
                onChange={(value) => {
                  setReportDetail(value);
                }}
                placeholder="내용을 입력하세요. (선택)"
                borderRadius="8px"
                fontSize="regular16"
                height="134px"
                id="report"
                maxLeng={500}
              />
            </ReportContent>
            <ReportButton>
              <Button
                type="submit"
                onClick={handleReport}
                buttonType="primary"
                text="신고하기"
                disabled={checkedItems.length === 0}
              />
            </ReportButton>
          </div>
        </FormModal>
      )}
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
    </>
  );
};

export default ReadBoard;

const UpdatedDate = styled.p`
  ${(props) => props.theme.fonts.medium11};
  color: ${theme.colors.gray600};
  margin: 1px 0 12px;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;
`;

const UserLeft = styled.div`
  display: flex;
`;

const UserWapper = styled.div`
  position: relative;
  margin-top: 9px;
`;

const UserTierWrapper = styled.div`
  position: absolute;
  top: 30px;
  left: 0px;
`;

const UserNManner = styled.div`
  display: flex;
  margin-top: 9px;
`;

const UserRight = styled.div`
  display: flex;
`;

const Title = styled.p`
  ${(props) => props.theme.fonts.semiBold14};
  color: ${theme.colors.gray800};
  margin-bottom: 5px;
`;

const MannerLevelWrapper = styled.div`
  position: relative;
`;

const ChampionNQueueSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 89px;
  margin-top: 33px;
`;

const PositionSection = styled.div`
  margin-top: 33px;
`;

const WinningRateSection = styled.div<{ $gameType: GameMode }>`
  margin-top: ${({ $gameType }) => ($gameType !== "ARAM" ? "33px" : "46px")};
`;

const StyleSection = styled.div<{ $gameType: GameMode }>`
  margin-top: ${({ $gameType }) => ($gameType !== "ARAM" ? "33px" : "46px")};
`;

const MemoSection = styled.div<{ $gameType: GameMode }>`
  margin-top: ${({ $gameType }) => ($gameType !== "ARAM" ? "33px" : "46px")};
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
`;

const MemoData = styled.p`
  color: ${theme.colors.gray700};
  ${(props) => props.theme.fonts.regular18}
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
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.regular20};
  margin: 28px 0;
`;

const MsgConfirm = styled(Msg)`
  ${(props) => props.theme.fonts.regular20};
  margin: 80px 0;
`;

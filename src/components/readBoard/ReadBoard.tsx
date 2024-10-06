import styled from "styled-components";
import { theme } from "@/styles/theme";
import CRModal from "../crBoard/CRModal";
import Button from "../common/Button";
import PositionBox from "../crBoard/PositionBox";
import { useEffect, useRef, useState } from "react";
import ProfileImage from "./ProfileImage";
import User from "../crBoard/User";
import MannerLevel from "../common/MannerLevel";
import Mic from "./Mic";
import MoreBoxButton from "./MoreBoxButton";
import Champion from "./Champion";
import QueueType from "./QueueType";
import WinningRate from "./WinningRate";
import MannerLevelBox from "../common/MannerLevelBox";
import GameStyle from "./GameStyle";
import { MoreBoxMenuItems } from "@/interface/moreBox";
import MoreBox from "../common/MoreBox";
import { MemberPost } from "@/interface/board";
import { deletePost, getMemberPost, getNonMemberPost } from "@/api/board";
import LoadingSpinner from "../common/LoadingSpinner";
import { setPostingDateFormatter } from "@/utils/custom";
import { blockMember, reportMember, unblockMember } from "@/api/member";
import FormModal from "../common/FormModal";
import Input from "../common/Input";
import Checkbox from "../common/Checkbox";
import { REPORT_REASON } from "@/data/report";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setCloseModal, setCloseReadingModal, setOpenModal, setOpenPostingModal } from "@/redux/slices/modalSlice";
import { setCurrentPost, setPostStatus } from "@/redux/slices/postSlice";
import { cancelFriendReq, deleteFriend, reqFriend } from "@/api/friends";
import Alert from "../common/Alert";
import { AlertProps } from "@/interface/modal";
import { useRouter } from "next/navigation";
import { openChatRoom, setChatRoomUuid, setErrorMessage } from "@/redux/slices/chatSlice";
import { notify } from "@/hooks/notify";

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
  const [isMannerBalloonVisible, setIsMannerBalloonVisible] = useState(true);
  const [isMannerLevelBoxOpen, setIsMannerLevelBoxOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isBlockedStatus, setIsBlockedStatus] = useState(false);
  const [isFriendStatus, setIsFriendStatus] = useState(false);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [reportDetail, setReportDetail] = useState<string>("");
  const [type, setType] = useState<string>('wind');
  const [showAlert, setShowAlert] = useState(false);
  const [alertProps, setAlertProps] = useState<AlertProps>({
    icon: "",
    width: 0,
    height: 0,
    content: "",
    alt: "",
    onClose: () => { },
    buttonText: "",
  });

  const isModalType = useSelector((state: RootState) => state.modal.modalType);
  const isUser = useSelector((state: RootState) => state.user);
  const isErrorMessage = useSelector((state: RootState) => state.chat.errorMessage);

  /* 게시글 api */
  const getPostData = async () => {
    setLoading(true);
    if (!!isUser.gameName && postId) {
      const memberData = await getMemberPost(postId);
      setIsPost(memberData.result);
      const hasPosition = 'mainPosition' in memberData.result ? 'canyon' : 'wind';
      setType(hasPosition);
      setLoading(false);
    }

    if (!isUser.gameName && postId) {
      const nonMember = await getNonMemberPost(postId);

      setIsPost(nonMember.result);
      setLoading(false);
    }
  };

  useEffect(() => {
    getPostData();
  }, [isBlockedStatus, isFriendStatus, isUser.gameName, postId])

  /* 클릭해서 매너키워드 보기 박스 닫기 */
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMannerBalloonVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  /* MannerLevelBox 외부 클릭 시 닫힘 */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mannerLevelBoxRef.current && !mannerLevelBoxRef.current.contains(event.target as Node)) {
        setIsMannerLevelBoxOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* 로그아웃 시, 비회원 접근 시 알럿 props 설정 함수 */
  const logoutMessage = "로그아웃 되었습니다. 다시 로그인 해주세요.";
  const loginRequiredMessage = "로그인이 필요한 서비스입니다.";

  const showAlertWithContent = (content: string, handleAlertClose: () => void, btnText: string) => {
    setAlertProps({
      icon: "exclamation",
      width: 68,
      height: 58,
      content: content,
      alt: "경고",
      onClose: handleAlertClose,
      buttonText: btnText
    });
    setShowAlert(true);
  };

  /* 신고하기 모달 오픈 */
  const handleReportModal = () => {
    // 신고하기 버튼 클릭 시점 토큰 만료
    if (!isUser.gameName) {
      return showAlertWithContent(logoutMessage, () => router.push('/'), "로그인하기");
    }

    dispatch(setOpenModal('report'));
    handleMoreBoxClose();
  };

  /* 신고하기 */
  const handleReport = async () => {
    if (!isUser.gameName) {
      return showAlertWithContent(logoutMessage, () => router.push('/'), "로그인하기");
    }

    if (!isPost || isUser?.gameName === isPost?.gameName) return;

    const params = {
      targetMemberId: isPost.memberId,
      reportTypeIdList: checkedItems,
      contents: reportDetail
    };

    try {
      await reportMember(params);
      await handleModalClose();
      await getPostData();
    } catch (error) {
      console.error(error);
    }
  };

  /* 차단하기 */
  const handleBlock = async () => {
    if (!isUser.gameName) {
      return showAlertWithContent(logoutMessage, () => router.push('/'), "로그인하기");
    }

    if (!isPost || isUser?.gameName === isPost?.gameName) return;

    try {
      await blockMember(isPost.memberId);
      await handleMoreBoxClose();
      await getPostData();
      await setIsBlockedStatus(true);
    } catch (error) {
      console.error(error);
    }
  };

  /* 차단 해제 */
  const handleUnblock = async () => {
    if (!isUser.gameName) {
      return showAlertWithContent(logoutMessage, () => router.push('/'), "로그인하기");
    }

    if (!isPost || isUser?.gameName === isPost?.gameName) return;

    if (!isPost.isBlocked) return;

    try {
      await unblockMember(isPost.memberId);
      await handleMoreBoxClose();
      await getPostData();
      await setIsBlockedStatus(false);
    } catch (error) {
    }
  };

  /* 친구 추가 */
  const handleFriendAdd = async () => {
    if (!isUser.gameName) {
      return showAlertWithContent(logoutMessage, () => router.push('/'), "로그인하기");
    }

    if (!isPost || isUser?.gameName === isPost?.gameName) return;

    if (isPost?.isFriend || isPost?.friendRequestMemberId) return;

    try {
      await reqFriend(isPost.memberId);
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
    if (!isUser.gameName) {
      return showAlertWithContent(logoutMessage, () => router.push('/'), "로그인하기");
    }

    if (!isPost || isUser?.gameName === isPost?.gameName) return;

    try {
      await cancelFriendReq(isPost.memberId);
      await handleMoreBoxClose();
      await getPostData();
      setIsFriendStatus(false);
    } catch (error) {
      console.error(error);
    }

    handleMoreBoxClose();
  }

  /* 친구 삭제 */
  const handleFriendDelete = async () => {
    if (!isUser.gameName) {
      return showAlertWithContent(logoutMessage, () => router.push('/'), "로그인하기");
    }

    if (!isPost || isUser?.gameName === isPost?.gameName) return;

    if (!isPost?.isFriend) return;

    try {
      await deleteFriend(isPost.memberId);
      await handleMoreBoxClose();
      await getPostData();
      setIsFriendStatus(false);
    } catch (error) {
      console.error(error);
    }

    handleMoreBoxClose();
  }

  /* 매너레벨 박스 열기 */
  const handleMannerLevelBoxOpen = () => {
    if (!isUser.gameName) {
      return showAlertWithContent(loginRequiredMessage, () => setShowAlert(false), "확인");
    }

    setIsMannerLevelBoxOpen((prevState) => !prevState);
  };

  /* 신고하기 사유 */
  const handleCheckboxChange = (checked: number) => {
    setCheckedItems((prev) =>
      prev.includes(checked) ? prev.filter((c) => c !== checked) : [...prev, checked]
    );
  };

  /* 게시글 수정 */
  const handleEdit = async () => {
    if (!isUser.gameName) {
      return showAlertWithContent(logoutMessage, () => router.push('/'), "로그인하기");
    }

    if (isUser?.gameName !== isPost?.gameName) return;

    if (isPost) {
      dispatch(setCurrentPost({ currentPost: isPost, currentPostId: postId }));
      dispatch(setOpenPostingModal());
      dispatch(setCloseReadingModal());
    }
  };

  /* 게시글 삭제 */
  const handleDelete = async () => {
    if (!isUser.gameName) {
      return showAlertWithContent(logoutMessage, () => router.push('/'), "로그인하기");
    }

    if (isUser?.gameName !== isPost?.gameName) return;

    try {
      await deletePost(postId);
      await dispatch(setPostStatus('delete'));
      await dispatch(setCloseReadingModal());
    } catch (error) {
      console.error(error);
    }
  };

  /* 더보기 버튼 토글 */
  const handleMoreBoxToggle = () => {
    if (!isUser.gameName) {
      return showAlertWithContent(loginRequiredMessage, () => setShowAlert(false), "확인");
    }

    setIsMoreBoxOpen((prevState) => !prevState);
  };

  /* 더보기 버튼 닫기 */
  const handleMoreBoxClose = () => {
    setIsMoreBoxOpen(false);
  };

  /* 더보기 버튼 메뉴 */
  const MoreBoxMenuItems: MoreBoxMenuItems[] = [];

  if (isUser?.gameName === isPost?.gameName) {
    MoreBoxMenuItems.push(
      { text: '수정', onClick: handleEdit },
      { text: '삭제', onClick: handleDelete }
    );
  }

  //친구 삭제 - 차단되어있을 때, 친구일 때, 친구 추가 요청 중일 때
  //친구 추가(친구 요청) - 친구가 아닐 때, 차단되어있지 않을 때, 친구 추가 요청 중이 아닐 때
  //친구 요청 취소 - 친구 추가 요청 중일 떄
  //차단하기 - 친구 추가 요청 중일 때, 친구 삭제된 상태일 때, 차단되어있지 않을 때
  //차단해제 - 차단되어 있을 때, 

  if (isUser?.gameName !== isPost?.gameName) {
    let friendText = '친구 추가';
    let friendFunc = handleFriendAdd;
    let blockText = '차단하기';
    let blockFunc = handleBlock;

    if (!!isPost?.isBlocked && !!isPost?.isFriend && !!isPost?.friendRequestMemberId) {
    if (isPost?.isBlocked || isPost?.isFriend) {
      friendText = '친구 삭제';
      friendFunc = handleFriendDelete;
    }
    if (!isPost?.isBlocked || !isPost?.isFriend || !isPost?.friendRequestMemberId) {
      friendText = '친구 추가';
      friendFunc = handleFriendAdd;
    }
    if (isPost?.friendRequestMemberId) {
      friendText = '친구 요청 취소';
      friendFunc = handleCancelFriendReq;
    }

    if (isPost?.friendRequestMemberId || !isPost?.isBlocked) {
      blockText = '차단하기';
      blockFunc = handleBlock;
    }

    if (!!isPost?.isBlocked) {
      blockText = '차단 해제';
      friendText = '';
      blockFunc = handleUnblock;
    }
    }

    if (friendText) {
      MoreBoxMenuItems.push({ text: friendText, onClick: friendFunc });
    }

    MoreBoxMenuItems.push(
      { text: blockText, onClick: blockFunc },
      { text: '신고하기', onClick: handleReportModal }
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
    if (!isUser.gameName) {
      return showAlertWithContent(loginRequiredMessage, () => setShowAlert(false), "확인");
    }

    if (isPost?.isBlocked) {
      return notify({ text: '차단한 회원과는 채팅이 불가합니다', icon: '🚫', type: 'error' });
    }

    if (isErrorMessage) {
      alert(isErrorMessage);
      dispatch(setErrorMessage(null));
    } else {
      try {
        dispatch(setCloseReadingModal());
        if (!isPost) return;
        dispatch(setChatRoomUuid(isPost.boardId));
        dispatch(openChatRoom());
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <CRModal type="reading" onClose={() => dispatch(setCloseReadingModal())}>
        {showAlert && <Alert {...alertProps} />}
        {isPost && (
          <>
            {isMoreBoxOpen && (
              <MoreBox
                items={MoreBoxMenuItems}
                top={67}
                left={544}
                onClose={() => setIsMoreBoxOpen(false)} />
            )}
            <UpdatedDate>게시일 : {setPostingDateFormatter(isPost.createdAt)}</UpdatedDate>
            <UserSection>
              <UserLeft>
                <ProfileImage
                  image={isPost.profileImage} />
                <UserNManner>
                  <User
                    account={isPost.gameName}
                    tag={isPost.tag}
                    tier={isPost.tier}
                    rank={isPost.rank} />
                  <MannerLevelWrapper>
                    <MannerLevel
                      forNoData={isPost.tier}
                      level={isPost.mannerLevel}
                      onClick={handleMannerLevelBoxOpen}
                      position="top"
                      isBalloon={isMannerBalloonVisible} />
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
                <Mic
                  status={isPost.mike} />
                <MoreBoxButton onClick={handleMoreBoxToggle} />
              </UserRight>
            </UserSection>
            <ChampionNQueueSection>
              <Champion
                size={14}
                list={isPost.championResponseDTOList.map(
                  (champion) => champion.championId
                )}
              />
              <QueueType
                value={isPost.gameMode} />
            </ChampionNQueueSection>
            {type === "canyon" &&
              <PositionSection>
                <Title>포지션</Title>
                <PositionBox
                  status="reading"
                  main={isPost.mainPosition}
                  sub={isPost.subPosition}
                  want={isPost.wantPosition} />
              </PositionSection>
            }
            <WinningRateSection $gameType={type}>
              <WinningRate
                completed={isPost.winRate}
                recentGameCount={isPost.recentGameCount} />
            </WinningRateSection>
            <StyleSection $gameType={type}>
              <Title>게임 스타일</Title>
              <GameStyle styles={isPost.gameStyles} />
            </StyleSection>
            <MemoSection $gameType={type}>
              <Title>메모</Title>
              <Memo>
                <MemoData>
                  {isPost.contents}
                </MemoData>
              </Memo>
            </MemoSection>
            {isUser.gameName !== isPost.gameName && (
              <ButtonContent $gameType={type}>
                <Button
                  type="submit"
                  buttonType="primary"
                  text="말 걸어보기"
                  onClick={handleChatStart}
                />
              </ButtonContent>
            )}
          </>
        )}
      </CRModal>

      {isModalType === 'report' &&
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
                fontSize="regular18"
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
      }
    </>
  );
};

export default ReadBoard;

const UpdatedDate = styled.p`
  ${(props) => props.theme.fonts.medium11};
  color: ${theme.colors.gray200};
  margin:1px 0 12px;
`;

const UserSection = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    white-space: nowrap;
    /* gap:90px; */
`;

const UserLeft = styled.div`
    display:flex;
    align-items: center;
`;
const UserNManner = styled.div`
    display:flex;
`;
const UserRight = styled.div`
    display:flex;
`;
const Title = styled.p`
    ${(props) => props.theme.fonts.semiBold14};
    color: #222222;
    margin-bottom:5px;
`;

const MannerLevelWrapper = styled.div`
  position: relative;
`;

const ChampionNQueueSection = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap:89px;
    margin-top:33px;
`;

const PositionSection = styled.div`
    margin-top:33px;    
`;

const WinningRateSection = styled.div<{ $gameType: string }>`
    margin-top:${({ $gameType }) => ($gameType === "canyon" ? "33px" : "46px")};  
`;

const StyleSection = styled.div<{ $gameType: string }>`
    margin-top:${({ $gameType }) => ($gameType === "canyon" ? "33px" : "46px")};  
`;

const MemoSection = styled.div<{ $gameType: string }>`
    margin-top:${({ $gameType }) => ($gameType === "canyon" ? "33px" : "46px")};   
`;

const Memo = styled.div`
    width: 100%;
    min-height: 77px;
    padding: 11px 20px;
    border-radius: 15px;
    border: 1px solid ${theme.colors.purple300};  
`;

const MemoData = styled.p`
    color: #606060;
    ${(props) => props.theme.fonts.regular18}
`;

const ButtonContent = styled.p<{ $gameType: string }>`
    margin:${({ $gameType }) => ($gameType === "canyon" ? "30px" : "150px")} 0 28px;    
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
  margin-top:21px;
`;


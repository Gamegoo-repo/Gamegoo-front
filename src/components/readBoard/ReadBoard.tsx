import styled from "styled-components";
import { theme } from "@/styles/theme";
import CRModal from "../crBoard/CRModal";
import Button from "../common/Button";
import PositionBox from "../crBoard/PositionBox";
import { useEffect, useState } from "react";
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
import { MemberPost, NonMemberPost } from "@/interface/board";
import { deletePost, editPost, getMemberPost } from "@/api/board";
import LoadingSpinner from "../common/LoadingSpinner";
import { setPostingDateFormatter } from "@/utils/custom";
import { blockMember, getUserInfo, reportMember, unblockMember } from "@/api/member";
import FormModal from "../common/FormModal";
import Input from "../common/Input";
import Checkbox from "../common/Checkbox";
import { REPORT_REASON } from "@/data/report";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setCloseModal, setCloseReadingModal, setOpenModal, setOpenPostingModal } from "@/redux/slices/modalSlice";
import { setCurrentPost } from "@/redux/slices/postSlice";
import { UserInfo } from "@/interface/profile";
import { deleteFriend, reqFriend } from "@/api/friends";

interface ReadBoardProps {
  onClose: () => void;
  postId: number;
  gameType: 'canyon' | 'wind';
}

const userData = {
  image: "/assets/icons/profile_img.svg",
  account: "유니콘의 비밀",
  tag: "KR1",
  tier: "B3",
  manner_level: 5,
  mic: 1,
  champions: [
    { id: 1, value: "/assets/icons/gray_circle.svg" },
    { id: 2, value: "/assets/icons/gray_circle.svg" },
    { id: 3, value: "/assets/icons/gray_circle.svg" },
  ],
  queue: "솔로1",
  winning_rate: {
    completed: 76,
    history: 20,
  },
};

const ReadBoard = (props: ReadBoardProps) => {
  const { onClose, postId, gameType } = props;

  const dispatch = useDispatch();

  const [memberPost, setMemberPost] = useState<MemberPost>();
  const [nonMemberPost, setNonMemberPost] = useState<NonMemberPost>();
  const [textareaValue, setTextareaValue] = useState("");
  const [isMoreBoxOpen, setIsMoreBoxOpen] = useState(false);
  const [isMannerBalloonVisible, setIsMannerBalloonVisible] = useState(true);
  const [isMannerLevelBoxOpen, setIsMannerLevelBoxOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isBlockedStatus, setIsBlockedStatus] = useState(false);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [reportDetail, setReportDetail] = useState<string>("");
  const [userInfo, setUserInfo] = useState<UserInfo>();

  const isModalType = useSelector((state: RootState) => state.modal.modalType);

  console.log(checkedItems)
  /* 클릭해서 매너지워드 보기 박스 닫히 */
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMannerBalloonVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  /* 신고하기 모달 오픈 */
  const handleReportModal = () => {
    dispatch(setOpenModal('report'));
    handleMoreBoxClose();
  };

  /* 신고하기 */
  const handleReport = async () => {
    if (userInfo?.id === memberPost?.memberId || !memberPost) return;

    const params = {
      targetMemberId: memberPost.memberId,
      reportTypeIdList: checkedItems,
      contents: reportDetail
    };

    try {
      await reportMember(params);
      await handleModalClose();
    } catch (error) {
    }
  };

  /* 차단하기 */
  const handleBlock = async () => {
    if (userInfo?.id === memberPost?.memberId || !memberPost) return;

    try {
      await blockMember(memberPost.memberId);
      await handleMoreBoxClose();
      setIsBlockedStatus(true);
    } catch (error) {
    }
  };

  /* 차단 해제 */
  const handleUnblock = async () => {
    if (userInfo?.id === memberPost?.memberId || !memberPost) return;

    try {
      const data = await unblockMember(memberPost.memberId);
      await handleMoreBoxClose();
      setIsBlockedStatus(false);
    } catch (error) {
    }
  };

  /* 친구 추가 */
  const handleFriendAdd = async () => {
    if (userInfo?.id === memberPost?.memberId || !memberPost) return;

    try {
      await reqFriend(memberPost.memberId);
      await handleMoreBoxClose();
    } catch (error) {
    }

    handleMoreBoxClose();
  };

  const handleFriendDelete = async () => {
    if (userInfo?.id === memberPost?.memberId || !memberPost) return;

    try {
      await deleteFriend(memberPost.memberId);
      await handleMoreBoxClose();
    } catch (error) {
    }

    handleMoreBoxClose();
  }

  /* 매너레벨 박스 열기 */
  const handleMannerLevelBoxOpen = () => {
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
    if (userInfo?.id !== memberPost?.memberId) return;

    if (memberPost) {
      dispatch(setCurrentPost({ currentPost: memberPost, currentPostId: postId }));
      dispatch(setOpenPostingModal());
      dispatch(setCloseReadingModal());
    }
  };

  /* 게시글 삭제 */
  const handleDelete = async () => {
    if (userInfo?.id !== memberPost?.memberId) return;

    try {
      await deletePost(postId);
      await onClose();
      // 게시글 업로드 해야하나?
    } catch (error) {
    }
  };

  /* 더보기 버튼 토글 */
  const handleMoreBoxToggle = () => {
    setIsMoreBoxOpen((prevState) => !prevState);
  };

  /* 더보기 버튼 닫기 */
  const handleMoreBoxClose = () => {
    setIsMoreBoxOpen(false);
  };

  /* 더보기 버튼 메뉴 */
  const MoreBoxMenuItems: MoreBoxMenuItems[] = [];

  if (userInfo?.id === memberPost?.memberId) {
    MoreBoxMenuItems.push(
      { text: '수정', onClick: handleEdit },
      { text: '삭제', onClick: handleDelete }
    );
  }

  if (userInfo?.id !== memberPost?.memberId) {
    MoreBoxMenuItems.push(
      { text: '친구 추가', onClick: handleFriendAdd },
      { text: memberPost?.isBlocked ? '차단 해제' : '차단하기', onClick: memberPost?.isBlocked ? handleUnblock : handleBlock },
      { text: '신고하기', onClick: handleReportModal }
    );
  }

  /* 게시글 api */
  useEffect(() => {
    const getPostData = async () => {
      setLoading(true);
      const memberData = await getMemberPost(postId);
      setMemberPost(memberData.result);
      setLoading(false);
    };

    getPostData();
  }, [isBlockedStatus])


  /* 유저 정보 api */
  useEffect(() => {
    const getUserData = async () => {
      const data = await getUserInfo();
      setUserInfo(data.result);
      console.log('유저,', data.result)
    };

    getUserData();
  }, [])

  /* 신고하기 모달 닫기 */
  const handleModalClose = () => {
    setCheckedItems([]);
    setReportDetail("");
    dispatch(setCloseModal());
  };

  // 스피너 진주님과 합치기
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }


  // if(post?.memberId===)

  return (
    <>
      <CRModal type="reading" onClose={onClose}>
        {memberPost && (
          <>
            {isMoreBoxOpen && (
              <MoreBox
                items={MoreBoxMenuItems}
                top={67}
                left={776} />
            )}
            {isMannerLevelBoxOpen && <MannerLevelBox top="14%" right="22%" />}
            <UpdatedDate>게시일 : {setPostingDateFormatter(memberPost.createdAt)}</UpdatedDate>
            <UserSection>
              <UserLeft>
                <ProfileImage
                  image={memberPost.profileImage} />
                <UserNManner>
                  <User
                    account={memberPost.gameName}
                    tag={memberPost.tag}
                    tier={memberPost.tier} />
                  <MannerLevel
                    level={memberPost.mannerLevel}
                    onClick={handleMannerLevelBoxOpen}
                    position="top"
                    isBalloon={isMannerBalloonVisible} />
                </UserNManner>
              </UserLeft>
              <UserRight>
                <Mic
                  status={memberPost.mike} />
                <MoreBoxButton onClick={handleMoreBoxToggle} />
              </UserRight>
            </UserSection>
            <ChampionNQueueSection>
              <Champion
                list={memberPost.championList}
                size={14} />
              <QueueType
                value={memberPost.gameMode} />
            </ChampionNQueueSection>
            {memberPost.mainPosition &&
              memberPost.subPosition &&
              memberPost.wantPosition &&
              <PositionSection>
                <Title>포지션</Title>
                <PositionBox
                  status="reading"
                  main={memberPost.mainPosition}
                  sub={memberPost.subPosition}
                  want={memberPost.wantPosition} />
              </PositionSection>
            }
            <WinningRateSection $gameType={gameType}>
              <WinningRate
                completed={memberPost.winRate}
                history={memberPost.recentGameCount} />
            </WinningRateSection>
            <StyleSection $gameType={gameType}>
              <Title>게임 스타일</Title>
              <GameStyle styles={memberPost.gameStyles} />
            </StyleSection>
            <MemoSection $gameType={gameType}>
              <Title>메모</Title>
              <Memo>
                <MemoData>
                  {memberPost.contents}
                </MemoData>
              </Memo>
            </MemoSection>
            <ButtonContent $gameType={gameType}>
              <Button
                type="submit"
                buttonType="primary"
                text="말 걸어보기"
                onClick={onClose} />
            </ButtonContent>
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
                  isArraychecked={checkedItems.includes(data.id)}
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
    gap:90px;
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

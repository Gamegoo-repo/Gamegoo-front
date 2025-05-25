import MoreBox from "@/components/common/MoreBox";
import RankTier from "@/components/common/RankTier";

import MannerLevel from "@/components/common/MannerLevel";
import MannerLevelBox from "@/components/common/MannerLevelBox";

import PostBoard from "@/components/createBoard/PostBoard";
import Report from "@/components/readBoard/MoreBoxButton";
import { MemberPost } from "@/interface/board";
import { MoreBoxMenuItems } from "@/interface/moreBox";
import {
  setClosePostingModal,
  setCloseReadingModal,
  setOpenModal,
  setOpenPostingModal,
} from "@/redux/slices/modalSlice";
import { setPostingDateFormatter } from "@/utils/custom";

import { setUserId } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";
import { theme } from "@/styles/theme";
import {
  formatTimeAgo,
  setAbbrevTier,
  setDateFormatter,
  setChatRoomDateFormatter,
} from "@/utils/custom";
import { getProfileBgColor } from "@/utils/profile";
import { toLowerCaseString } from "@/utils/string";
import { deletePost, getMemberPost, getNonMemberPost } from "@/api/board/board";
import { setCurrentPost, setPostStatus } from "@/redux/slices/postSlice";
import { AlertProps } from "@/interface/modal";
import { GameMode } from "@/types/game/gameMode";
import React, { useState, useEffect, useRef } from "react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { User } from "@/interface/profile";
import Image from "next/image";
import PositionBox from "@/components/mypage/post/PositionBox";
import Champion from "@/components/mypage/post/Champion";
import ProfileImage from "@/components/mypage/post/ProfileImage";

export interface PostProps {
  user: User;
  boardId: number;
  memberId: number;
  profileImage: number;
  gameName: string;
  tag: string;
  tier: string;
  rank: number;
  contents: string;
  createdAt: string;
  bumpTime: string;
  boardNumber: number;
  onDeletePost?: (boardId: number) => void;
}

const MoPost: React.FC<PostProps> = ({
  user,
  boardId,
  memberId,
  profileImage,
  gameName,
  tag,
  tier,
  rank,
  contents,
  createdAt,
  boardNumber,
  onDeletePost,
}) => {
  // const { boardId } = props;

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

      if (!!isUser.id && boardId) {
        const memberData = await getMemberPost(boardId);
        setIsPost(memberData.data);
        setGameMode(memberData.data.gameMode);
        setIsBlockedStatus(memberData.data.isBlocked);
      } else if (!isUser.id && boardId) {
        const nonMember = await getNonMemberPost(boardId);
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
  }, [isBlockedStatus, isFriendStatus, isUser, boardId]);

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

  /* 게시글 수정 */
  const handleEdit = async () => {
    // Todo 게시글 수정
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
        setCurrentPost({ currentPost: isPost, currentPostId: boardId })
      );
      await dispatch(setOpenPostingModal());
      await dispatch(setCloseReadingModal());
      dispatch(setPostStatus(""));
    }
    console.log("isPostModalOpen 상태:", isPostModalOpen);
  };

  /* 게시글 삭제 */
  const handleDelete = async () => {
    // Todo 게시글 삭제
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
      await deletePost(boardId);
      await dispatch(setPostStatus("delete"));
      await dispatch(setCloseReadingModal());
      await dispatch(setPostStatus(""));
    } catch (error) {
      console.error(error);
    }
  };

  /* 더보기 버튼 메뉴 */
  const MoreBoxMenuItems: MoreBoxMenuItems[] = [];

  MoreBoxMenuItems.push(
    { text: "수정", onClick: handleEdit },
    { text: "삭제", onClick: handleDelete }
  );

  return (
    <>
      <Wrapper>
        <UserSection>
          <UserLeft>
            <UserProfileWrapper>
              <ProfileImage image={profileImage} />
              <UserNManner>
                <MannerLevelWrapper>
                  {/* TODO : mannerlevel api 에서 작업되면 추가하기 */}
                  <MannerLevel
                    level={1}
                    onClick={handleMannerLevelBoxOpen}
                    position="board"
                    isBubbleHide={true}
                  />
                  {isMannerLevelBoxOpen && (
                    <div ref={mannerLevelBoxRef}>
                      <MannerLevelBox
                        memberId={memberId}
                        level={1}
                        top="30px"
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
            <UserAccountWrapper>
              <UserAccountRow>
                <UserAccount>{user.gameName}</UserAccount>
              </UserAccountRow>
              {tag && <UserAccountTag>#{tag}</UserAccountTag>}
            </UserAccountWrapper>
          </UserLeft>
          <UserRight>
            <ThreeDotsImage
              onClick={() => setIsMoreBoxOpen((prevState) => !prevState)}
              src="/assets/icons/three_dots_button.svg"
              width={16}
              height={16}
              alt="더보기 버튼"
            />
            {isMoreBoxOpen && (
              <MoreBox
                items={MoreBoxMenuItems}
                top={30}
                right={10}
                onClose={() => setIsMoreBoxOpen(false)}
              />
            )}
          </UserRight>
        </UserSection>
        <UserTierWrapper>
          <RankTier
            type="solo"
            tier={user.soloTier || ""}
            rank={user.soloRank}
            direct="row"
            color={theme.colors.gray800}
            tierFontSize={theme.fonts.bold20}
          />
          <Bar />
          <RankTier
            type="free"
            tier={user.freeTier || ""}
            rank={user.freeRank}
            direct="row"
            color={theme.colors.gray800}
            tierFontSize={theme.fonts.bold20}
          />
        </UserTierWrapper>
        {gameMode !== "ARAM" && (
          <PositionSection>
            <PositionBox
              status="reading"
              main={user.mainP || null}
              sub={user.subP || null}
              want={
                Array.isArray(user.wantP)
                  ? user.wantP.filter((v) => v !== null)
                  : null
              }
            />
          </PositionSection>
        )}
        <ChampionNWinRateSection>
          <Champion
            font="semiBold14"
            list={isPost?.championStatsResponseList}
          />
          {/* TODO api 추가되면 승률 작업하기 */}
          <WinRate>
            승률
            <Rate>{56}%</Rate>
          </WinRate>
        </ChampionNWinRateSection>

        <MemoSection $gameType={gameMode}>
          <Memo>
            <MemoData>{contents}</MemoData>
          </Memo>
          <UpdatedDate>{setDateFormatter(createdAt)}</UpdatedDate>
        </MemoSection>
      </Wrapper>
    </>
  );
};

export default MoPost;
const Wrapper = styled.div`
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

const Rate = styled.div`
  color: ${theme.colors.violet600};
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

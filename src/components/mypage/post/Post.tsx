import { getMemberPost, pullUpPost } from "@/api/board/board";
import ConfirmModal from "@/components/common/ConfirmModal";
import MoreBox from "@/components/common/MoreBox";
import PostBoard from "@/components/createBoard/PostBoard";
import Report from "@/components/readBoard/MoreBoxButton";
import { notify } from "@/hooks/notify";
import { MemberPost } from "@/interface/board";
import { MoreBoxMenuItems } from "@/interface/moreBox";
import { setRefresh } from "@/redux/slices/boardSlice";
import {
  setClosePostingModal,
  setCloseReadingModal,
  setOpenModal,
  setOpenPostingModal,
} from "@/redux/slices/modalSlice";
import { setCurrentPost, setPostStatus } from "@/redux/slices/postSlice";
import { setUserId } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";
import { theme } from "@/styles/theme";
import { setAbbrevTier, setDateFormatter } from "@/utils/custom";
import { getProfileBgColor } from "@/utils/profile";
import { toLowerCaseString } from "@/utils/string";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

export interface PostProps {
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

const Post: React.FC<PostProps> = ({
  boardId,
  memberId,
  profileImage,
  gameName,
  tag,
  tier,
  rank,
  contents,
  createdAt,
  bumpTime,
  boardNumber,
  onDeletePost,
}) => {
  const [isMoreBoxOpen, setIsMoreBoxOpen] = useState(false);
  const [isPullUpConfirmOpen, setIsPullUpConfirmOpen] = useState(false);

  const dispatch = useDispatch();

  const handleMoreBoxOpen = () => {
    setIsMoreBoxOpen((prevState) => !prevState);
  };

  const [isPost, setIsPost] = useState<MemberPost>();

  const isPostingModal = useSelector(
    (state: RootState) => state.modal.postingModal
  );

  const isUser = useSelector((state: RootState) => state.user);

  /* 게시글 끌어올리기 */
  const handlePullUp = () => {
    handleMoreBoxOpen();
    if (boardId) {
      setIsPullUpConfirmOpen(true);
    }
  };

  const handlePullUpAction = async () => {
    // 게시판 끌어올리기 API
    await setIsPullUpConfirmOpen(false);
    await pullUpPost(boardId);
    await dispatch(setRefresh());
    await notify({
      text: "끌어올리기가 완료되었습니다",
      icon: "👌🏼",
      type: "success",
    });
  };

  const handleModify = async () => {
    handleMoreBoxOpen();
    // 수정하기 api
    dispatch(setUserId(memberId));
    const memberData = await getMemberPost(boardId);

    dispatch(
      setCurrentPost({ currentPost: memberData.data, currentPostId: boardId })
    );
    setIsPost(memberData.data);
    dispatch(setOpenPostingModal());
    dispatch(setCloseReadingModal());
    setIsMoreBoxOpen(false);
    dispatch(setPostStatus(""));
  };

  const handleDelete = async () => {
    handleMoreBoxOpen();
    // 삭제하기 api
    if (onDeletePost) {
      await onDeletePost(boardId);
    }
    setIsMoreBoxOpen(false);
  };

  // 더보기 버튼 메뉴
  const MoreBoxMenuItems: MoreBoxMenuItems[] = [
    { text: "끌어올리기", onClick: handlePullUp },
    { text: "수정", onClick: handleModify },
    { text: "삭제", onClick: handleDelete },
  ];

  const handlePostingClose = () => {
    dispatch(setClosePostingModal());
  };

  const handleModalClose = () => {
    handlePostingClose();
    dispatch(setOpenModal(""));
  };

  return (
    <>
      <Container>
        <Content>
          <Name>
            <Number>{boardNumber}</Number>
            {profileImage ? (
              <ProfileImgWrapper $bgColor={getProfileBgColor(profileImage)}>
                <ProfileImg
                  data={`/assets/images/profile/profile${profileImage}.svg`}
                  width={35}
                  height={35}
                />
              </ProfileImgWrapper>
            ) : (
              <ProfileImgWrapper $bgColor="#E2E2E2" />
            )}
            <Div>
              {gameName}
              <Tag>#{tag}</Tag>
            </Div>
          </Name>
          <Tier>
            <TierImage
              data={`/assets/images/tier/${
                toLowerCaseString(tier) || "unrank"
              }.svg`}
              width={26}
              height={26}
            />
            <span>
              {setAbbrevTier(tier)}
              {rank}
            </span>
          </Tier>
          <Memo>
            <MemoWrap>
              <MemoBox>{contents}</MemoBox>
            </MemoWrap>
          </Memo>
          <Date>{setDateFormatter(bumpTime || createdAt)}</Date>
        </Content>
        <MoreContainer>
          <More>
            <Report onClick={handleMoreBoxOpen} />
            {isMoreBoxOpen && (
              <MoreBox items={MoreBoxMenuItems} top={-10} left={45} />
            )}
          </More>
        </MoreContainer>
        {isPostingModal && boardId === isPost?.boardId && (
          <PostBoard
            onClose={handlePostingClose}
            onCompletedPostingClose={handleModalClose}
          />
        )}
      </Container>
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
    </>
  );
};

export default Post;

const Container = styled.div`
  width: 100%;
  height: 95px;
  padding: 23px 15px;
  display: flex;
  align-items: center;
  background: ${theme.colors.white};
  border-bottom: 1px solid ${theme.colors.gray300};
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.medium16};
  gap: 26px;
  position: relative;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 0.6fr 1fr 0.7fr;
  align-items: center;
`;

const Name = styled.div`
  min-width: 200px;
  display: flex;
  align-items: center;
  gap: 22px;
  ${(props) => props.theme.fonts.semiBold16};
  white-space: nowrap;

  @media (max-width: 1400px) {
    gap: 16px;
  }

  @media (max-width: 1360px) {
    gap: 10px;
  }

  @media (max-width: 1300px) {
    gap: 4px;
  }
`;

const Number = styled.span`
  color: ${theme.colors.gray800};
  ${(props) => props.theme.fonts.bold16};
  white-space: nowrap;
`;

const ProfileImgWrapper = styled.div<{ $bgColor: string }>`
  position: relative;
  width: 50px;
  height: 50px;
  background: ${(props) => props.$bgColor};
  border-radius: 50%;
`;

const ProfileImg = styled.object`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  filter: drop-shadow(-4px 10px 10px rgba(63, 53, 78, 0.582));
  pointer-events: none;
`;

const Div = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${theme.colors.gray800};
  ${(props) => props.theme.fonts.semiBold16};
`;

const Tag = styled.div`
  color: ${theme.colors.gray500};
  ${(props) => props.theme.fonts.semiBold14};
`;

const Tier = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  color: ${theme.colors.gray800};
  ${(props) => props.theme.fonts.regular14};
`;

const TierImage = styled.object`
  pointer-events: none;
`;

const Memo = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
const MemoWrap = styled.div`
  width: 156px;
  padding: 8px 10.5px;
  background: ${theme.colors.gray100};
  border: 1px solid ${theme.colors.gray400};
  border-radius: 8px;
  color: ${theme.colors.gray800};
  ${(props) => props.theme.fonts.regular13};
`;

const MemoBox = styled.div`
  display: -webkit-box;
  word-wrap: break-word;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const Date = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${theme.colors.gray500};
  ${(props) => props.theme.fonts.medium14};
`;

const MoreContainer = styled.div`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
`;

const More = styled.div`
  position: relative;
`;

const MsgConfirm = styled.div`
  text-align: center;
  color: ${theme.colors.gray800};
  ${(props) => props.theme.fonts.regular25};
  margin: 80px 0;
`;

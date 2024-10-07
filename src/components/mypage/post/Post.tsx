import { getMemberPost } from "@/api/board";
import MoreBox from "@/components/common/MoreBox";
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
import { setCurrentPost } from "@/redux/slices/postSlice";
import { setUserId } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";
import { theme } from "@/styles/theme";
import {
  formatTimeAgo,
  setAbbrevTier,
  setChatRoomDateFormatter,
} from "@/utils/custom";
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
  rank: string;
  contents: string;
  createdAt: string;
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
  onDeletePost,
}) => {
  const [isMoreBoxOpen, setIsMoreBoxOpen] = useState(false);
  const dispatch = useDispatch();

  const handleMoreBoxOpen = () => {
    setIsMoreBoxOpen((prevState) => !prevState);
  };

  const [isPost, setIsPost] = useState<MemberPost>();

  const isPostingModal = useSelector(
    (state: RootState) => state.modal.postingModal
  );

  const isUser = useSelector((state: RootState) => state.user);

  const handleModify = async () => {
    // 수정하기 api
    dispatch(setUserId(memberId));
    const memberData = await getMemberPost(boardId);

    dispatch(
      setCurrentPost({ currentPost: memberData.result, currentPostId: boardId })
    );
    setIsPost(memberData.result);
    dispatch(setOpenPostingModal());
    dispatch(setCloseReadingModal());
    setIsMoreBoxOpen(false);
  };

  const handleDelete = async () => {
    // 삭제하기 api
    if (onDeletePost) {
      await onDeletePost(boardId);
    }
    setIsMoreBoxOpen(false);
  };

  // 더보기 버튼 메뉴
  const MoreBoxMenuItems: MoreBoxMenuItems[] = [
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
console.log(profileImage)
  return (
    <Container>
      <Content>
        <Name>
          <Number>{boardId}</Number>
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
          <object
            data={`/assets/images/tier/${toLowerCaseString(tier) || "ur"}.svg`}
            width={26}
            height={26}
          />
          <span>
            {setAbbrevTier(tier)}
            {rank}
          </span>
        </Tier>
        <Memo>{contents}</Memo>
        <Date>
          {setChatRoomDateFormatter(createdAt)}{" "}
          <Minute>{formatTimeAgo(createdAt)}</Minute>
        </Date>
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
          onCompletedPosting={handleModalClose}
        />
      )}
    </Container>
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
  ${(props) => props.theme.fonts.medium16};
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
  color: ${theme.colors.gray600};
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
`;

const Div = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Tag = styled.div`
  color: ${theme.colors.gray300};
  ${(props) => props.theme.fonts.medium16};
`;

const Tier = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  ${(props) => props.theme.fonts.regular14};
`;

const Memo = styled.div`
  width: 100%;
  height: 40px;
  text-overflow: ellipsis;
  overflow: hidden;
  word-wrap: break-word;
  display: -webkit-box;
  text-align: center;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  ${(props) => props.theme.fonts.regular14};
`;

const Date = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${theme.colors.gray200};
  ${(props) => props.theme.fonts.medium11};
`;

const Minute = styled.div`
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.semiBold14};
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

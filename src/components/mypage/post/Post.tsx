import { getMemberPost, getNonMemberPost } from "@/api/board";
import MoreBox from "@/components/common/MoreBox";
import PostBoard from "@/components/createBoard/PostBoard";
import Report from "@/components/readBoard/MoreBoxButton";
import { MemberPost, NonMemberPost } from "@/interface/board";
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
import Image from "next/image";
import React, { useEffect, useState } from "react";
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
    console.log("isUser", isUser);
    dispatch(
      setCurrentPost({ currentPost: memberData.result, currentPostId: boardId })
    );
    setIsPost(memberData.result);
    dispatch(setOpenPostingModal());
    dispatch(setCloseReadingModal());
    setIsMoreBoxOpen(false);
  };

  const handleDelete = () => {
    // 삭제하기 api
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

  return (
    <Container>
      {boardId}
      <Content>
        <Name>
          <ProfileImgWrapper $bgColor={getProfileBgColor(profileImage)}>
            <ProfileImg
              src={`/assets/images/profile/profile${profileImage - 1}.svg`}
              width={35}
              height={35}
              alt="프로필"
            />
          </ProfileImgWrapper>
          <Div>
            {gameName}
            <Tag>#{tag}</Tag>
          </Div>
        </Name>
        <Tier>
          <Image
            src={`/assets/images/tier/${toLowerCaseString(tier) || "ur"}.svg`}
            width={26}
            height={26}
            alt="tier"
          />
          {setAbbrevTier(tier)}
          {rank}
        </Tier>
        <Memo>{contents}</Memo>
        <Date>
          {setChatRoomDateFormatter(createdAt)}{" "}
          <Minute>{formatTimeAgo(createdAt)}</Minute>
        </Date>
      </Content>
      <More>
        <Report onClick={handleMoreBoxOpen} />
        {isMoreBoxOpen && (
          <MoreBox items={MoreBoxMenuItems} top={-10} left={45} />
        )}
      </More>
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
  padding: 23px 15px 23px 7px;
  display: flex;
  align-items: center;
  background: ${theme.colors.white};
  border-bottom: 1px solid ${theme.colors.gray300};
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.bold16};
  gap: 26px;
`;

const Content = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 2fr 2fr 2fr 1fr;
  align-items: center;
`;

const Name = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;
  ${(props) => props.theme.fonts.medium16};
  white-space: nowrap;
`;

const ProfileImgWrapper = styled.div<{ $bgColor: string }>`
  position: relative;
  width: 50px;
  height: 50px;
  background: ${(props) => props.$bgColor};
  border-radius: 50%;
`;

const ProfileImg = styled(Image)`
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
`;

const Tier = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  ${(props) => props.theme.fonts.regular14};
`;

const Memo = styled.div`
  display: flex;
  justify-content: center;
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

const More = styled.div`
  position: relative;
`;

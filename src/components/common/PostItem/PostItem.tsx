import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { theme } from "@/styles/theme";

import Alert from "../Alert";
import ChampionSection from "./ChampionSection";
import {
  useAlert,
  useBlockActions,
  useFriendActions,
  useMoreBoxMenu,
  usePostActions,
  useUIHandlers,
} from "./hooks";
import MemoSection from "./MemoSection";
import PositionSection from "./PositionSection";
import PostItemModal from "./PostItemModal";
import UserSection from "./UserSection/UserSection";
import UserTierSection from "./UserTierSection";

import type { FC } from "react";
import type { RootState } from "@/redux/store";
import type {
  BoardDetail,
  BoardListDetail,
  MemberPost,
} from "@/types/api/board/board";

export type PostItemData = Pick<
  BoardListDetail,
  | "boardId"
  | "memberId"
  | "profileImage"
  | "gameName"
  | "tag"
  | "mannerLevel"
  | "tier"
  | "rank"
  | "gameMode"
  | "mainP"
  | "subP"
  | "championStatsResponseList"
  | "winRate"
  | "contents"
  | "createdAt"
  | "bumpTime"
  | "wantP"
> &
  Partial<Omit<BoardDetail, "wantP">>;

export interface PostItemProps {
  data: PostItemData;
  variant?: "list" | "mypage"; // PostList, MoPost 사용 컴포넌트 구분
  isClickable?: boolean;
  showTierSection?: boolean;
  showMoreButton?: boolean;
  memberPost?: MemberPost; // MoPost에서 전달받는 전체 게시글 데이터
  onPostClick?: (boardId: number) => void;
  onDeletePost?: (boardId: number) => void;
  onProfileClick?: (e: React.MouseEvent, memberId: number) => void;
}

const PostItem: FC<PostItemProps> = ({
  data,
  variant = "list",
  isClickable = true,
  showTierSection = false,
  showMoreButton = true,
  memberPost,
  onPostClick,
  onDeletePost,
  onProfileClick,
}) => {
  const isUser = useSelector((state: RootState) => state.user);
  const [isPost, setIsPost] = useState<MemberPost | undefined>(memberPost);

  // memberPost prop이 변경될 때 isPost 상태 업데이트
  useEffect(() => {
    setIsPost(memberPost);
  }, [memberPost]);

  const { showAlert, alertProps, showAlertWithContent } = useAlert();

  const {
    mannerLevelBoxRef,
    isMannerLevelBoxOpen,
    handlePostClick,
    handleProfileClick,
    handleMannerLevelBoxToggle,
  } = useUIHandlers({
    data,
    isClickable,
    onPostClick,
    onProfileClick,
    showAlertWithContent,
  });

  const {
    isPullUpConfirmOpen,
    setIsPullUpConfirmOpen,
    handlePullUp,
    handlePullUpAction,
    handleEdit,
    handleDelete,
  } = usePostActions({
    data,
    variant,
    isPost,
    onDeletePost,
    showAlertWithContent,
  });

  const { handleFriendAdd, handleCancelFriendReq, handleFriendDelete } =
    useFriendActions({
      isPost,
      onCloseMoreBox: () => setIsMoreBoxOpen(false),
    });

  const {
    isBlockedStatus,
    setIsBlockedStatus,
    isBlockBoxOpen,
    setIsBlockBoxOpen,
    isBlockConfirmOpen,
    setIsBlockConfirmOpen,
    handleBlock,
    handleRunBlock,
  } = useBlockActions({
    isPost,
    onCloseMoreBox: () => setIsMoreBoxOpen(false),
  });

  const {
    isMoreBoxOpen,
    setIsMoreBoxOpen,
    handleMoreBoxToggle,
    handleMoreBoxClose,
    MoreBoxMenuItems,
  } = useMoreBoxMenu({
    data,
    variant,
    isPost,
    setIsPost,
    setIsBlockedStatus,
    showAlertWithContent,
    handlePullUp,
    handleEdit,
    handleDelete,
    handleFriendAdd,
    handleCancelFriendReq,
    handleFriendDelete,
    handleBlock,
  });

  return (
    <>
      <Wrapper data-clickable={isClickable} onClick={handlePostClick}>
        <UserSection
          data={data}
          isMannerLevelBoxOpen={isMannerLevelBoxOpen}
          onMannerLevelBoxToggle={handleMannerLevelBoxToggle}
          onProfileClick={handleProfileClick}
          mannerLevelBoxRef={mannerLevelBoxRef}
          showMoreButton={showMoreButton && !!isUser.id}
          isMoreBoxOpen={isMoreBoxOpen}
          onMoreBoxToggle={handleMoreBoxToggle}
          onMoreBoxClose={handleMoreBoxClose}
          moreBoxMenuItems={MoreBoxMenuItems}
        />
        <UserTierSection data={data} showTierSection={showTierSection} />
        <PositionSection
          data={data}
          showPositionSection={data.gameMode !== "ARAM"}
        />
        <ChampionSection data={data} variant={variant} />
        <MemoSection data={data} />
      </Wrapper>

      <PostItemModal
        isBlockBoxOpen={isBlockBoxOpen}
        isBlockConfirmOpen={isBlockConfirmOpen}
        isBlockedStatus={isBlockedStatus}
        onBlockConfirm={handleRunBlock}
        onBlockCancel={() => setIsBlockBoxOpen(false)}
        onBlockCompleteClose={() => setIsBlockConfirmOpen(false)}
        isPullUpConfirmOpen={isPullUpConfirmOpen}
        onPullUpConfirm={handlePullUpAction}
        onPullUpCancel={() => setIsPullUpConfirmOpen(false)}
      />
    </>
  );
};

export default PostItem;

const Wrapper = styled.div`
  [data-clickable="true"] {
    cursor: pointer;
  }

  @media (max-width: 700px) {
    background: ${theme.colors.gray100};
    border-radius: 8px;
    padding: 16px;
  }
`;

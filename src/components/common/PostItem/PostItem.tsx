import { FC, useState } from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import { useSelector } from "react-redux";

import UserSection from "./UserSection/UserSection";
import UserTierSection from "./UserTierSection";
import PositionSection from "./PositionSection";
import ChampionSection from "./ChampionSection";
import MemoSection from "./MemoSection";
import ConfirmModal from "../ConfirmModal";
import Alert from "../Alert";

// 커스텀 훅 imports
import {
  useAlert,
  usePostActions,
  useFriendActions,
  useBlockActions,
  useMoreBoxMenu,
  useUIHandlers,
} from "./hooks";

import { BoardDetail, BoardListDetail, MemberPost } from "@/interface/board";
import { RootState } from "@/redux/store";

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
  onPostClick,
  onDeletePost,
  onProfileClick,
}) => {
  const isUser = useSelector((state: RootState) => state.user);
  const [isPost, setIsPost] = useState<MemberPost>();

  const { showAlert, alertProps, showAlertWithContent } =
    useAlert();

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
      {showAlert && (
        <Alert
          icon={alertProps.icon}
          width={alertProps.width}
          height={alertProps.height}
          content={alertProps.content}
          alt={alertProps.alt}
          onClose={alertProps.onClose}
          buttonText={alertProps.buttonText}
        />
      )}

      <Wrapper $isClickable={isClickable} onClick={handlePostClick}>
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

        {showTierSection && <UserTierSection data={data} />}

        {data.gameMode !== "ARAM" && <PositionSection data={data} />}

        <ChampionSection data={data} variant={variant} />

        <MemoSection data={data} />
      </Wrapper>

      {/* 차단 확인 팝업 */}
      {isBlockBoxOpen && (
        <ConfirmModal
          width="540px"
          primaryButtonText="예"
          secondaryButtonText="아니요"
          onPrimaryClick={handleRunBlock}
          onSecondaryClick={() => setIsBlockBoxOpen(false)}
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

      {/* 차단 완료 팝업 */}
      {isBlockConfirmOpen && (
        <ConfirmModal
          width="540px"
          primaryButtonText="확인"
          onPrimaryClick={() => setIsBlockConfirmOpen(false)}
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
          onPrimaryClick={() => setIsPullUpConfirmOpen(false)}
          onSecondaryClick={handlePullUpAction}
        >
          <MsgConfirm>{`본 게시글을 끌어올리시겠습니까?`}</MsgConfirm>
        </ConfirmModal>
      )}
    </>
  );
};

export default PostItem;

const Wrapper = styled.div<{ $isClickable: boolean }>`
  cursor: ${({ $isClickable }) => ($isClickable ? "pointer" : "default")};

  @media (max-width: 700px) {
    background: ${theme.colors.gray100};
    border-radius: 8px;
    padding: 16px;
  }
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

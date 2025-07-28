import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import styled from "styled-components";

import { Layout, ReadBoard, ReportModal } from "@/components";
import {
  setCloseReadingModal,
  setOpenAlertModal,
  setOpenReadingModal,
} from "@/redux/slices/modalSlice";
import { theme } from "@/styles/theme";

import { PostItem } from "../common";
import SkeletonPostItem from "../common/PostItem/SkeletonPostItem";

import type { RootState } from "@/redux/store";
import type { BoardListDetail } from "@/types/api";

interface PostListProps {
  content: BoardListDetail[];
  isLoading?: boolean;
}

const PostList = ({ content, isLoading = false }: PostListProps) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const isBoardIdRef = useRef(0);

  const isChatRoomOpen = useSelector(
    (state: RootState) => state.chat.isChatRoomOpen
  );
  const isReadingModal = useSelector(
    (state: RootState) => state.modal.readingModal
  );
  const isModalType = useSelector((state: RootState) => state.modal.modalType);

  useEffect(() => {
    return () => {
      dispatch(setCloseReadingModal());
    };
  }, [dispatch]);

  /* 게시글 열기 */
  const handlePostOpen = (boardId: number) => {
    const exists = content.some((board) => board.boardId === boardId);

    if (!exists) {
      return dispatch(
        setOpenAlertModal({
          icon: "trash",
          width: 45,
          height: 50,
          content: "해당 글은 삭제된 글입니다.",
          alt: "해당 글은 삭제된 글입니다.",
          buttonText: "확인",
        })
      );
    }

    dispatch(setOpenReadingModal());
    isBoardIdRef.current = boardId;
  };

  /* 다른 사람 프로필 이동 */
  const handleMoveProfilePage = (e: React.MouseEvent, memberId: number) => {
    e.stopPropagation();
    router.push(`/user/${memberId}`);
  };

  /* 신고 모달 열기 */
  const handleReportModalOpen = (boardId: number) => {
    isBoardIdRef.current = boardId;
  };

  return (
    <>
      {isReadingModal && !isChatRoomOpen && <ReadBoard postId={isBoardIdRef.current} />}

      {isChatRoomOpen && <Layout />}
      <ListWrapper>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <SkeletonPostItem key={index} />
          ))
        ) : content?.length > 0 ? (
          content.map((data) => (
            <PostItem
              key={data.boardId}
              data={data}
              variant="list"
              isClickable={true}
              showTierSection={false}
              showMoreButton={true}
              onPostClick={handlePostOpen}
              onProfileClick={handleMoveProfilePage}
              onReportModalOpen={handleReportModalOpen}
            />
          ))
        ) : (
          <NoData>게시된 글이 없습니다.</NoData>
        )}
      </ListWrapper>

      {/* 신고하기 팝업 */}
      {isModalType === "report" && (
        <ReportModal isPost={undefined} postId={isBoardIdRef.current} />
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

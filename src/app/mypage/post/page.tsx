"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { getProfile } from "@/@generated/api";
import { deletePost, getMyPost, getMyPostCursor } from "@/api";
import { MoPost, Pagination, Post, PostBoard } from "@/components";
import { useInfiniteScroll, useMediaQueryContext } from "@/hooks";
import { setClosePostingModal } from "@/redux/slices/modalSlice";
import { setUserProfile } from "@/redux/slices/userSlice";
import { theme } from "@/styles/theme";

import type { RootState } from "@/redux/store";
import type { MyBoardDetail } from "@/types";

const MyPostPage = () => {
  const { isMobile } = useMediaQueryContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [postList, setPostList] = useState<MyBoardDetail[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(1);
  const pageButtonCount = 5;
  const ITEMS_PER_PAGE = 10;
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const sentinelRef = useRef(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const currentPost = useSelector((state: RootState) => state.post.currentPost);
  const user = useSelector((state: RootState) => state.user);
  const isPostingModal = useSelector(
    (state: RootState) => state.modal.postingModal
  );
  const [openedBoardId, setOpenedBoardId] = useState<number | null>(null);

  // 게시판 글 새로고침
  const boardRefresh = useSelector((state: RootState) => state.board.refresh);

  const dispatch = useDispatch();

  const fetchGetMyPost = async () => {
    const response = await getMyPost(currentPage);

    const { totalPage, totalCount } = response.data;
    setPostList(response.data.myBoards);
    setTotalPage(totalPage);
    setTotalCount(totalCount);
    setHasMoreItems(response.data.myBoards.length === ITEMS_PER_PAGE);
  };

  const fetchGetMyPostCursor = async (cursor: string | null) => {
    if (isLoading || !hasNext) return;

    setIsLoading(true);

    try {
      const response = await getMyPostCursor(cursor);
      setPostList((prevPosts) => [...prevPosts, ...response.data.myBoards]);
      setCursor(response.data.nextCursor);
      setHasNext(response.data.hasNext);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(
    () => {
      if (isMobile === undefined) return;

      if (isMobile) {
        fetchGetMyPostCursor(cursor);
      } else {
        fetchGetMyPost();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPage, currentPost, boardRefresh, isMobile]
  );

  /* mobile 무한스크롤 페이지네이션 */
  useInfiniteScroll({
    cursor,
    hasNext,
    isLoading,
    sentinelRef,
    onIntersect: fetchGetMyPostCursor,
    enabled: isMobile,
    rootMargin: "100px",
  });

  useEffect(
    () => {
      const fetchProfile = async () => {
        try {
          const response = await getProfile();

          if (!response.data) {
            throw new Error("내 프로필 조회 응답 데이터가 없습니다.");
          }
          const profile = response.data;
          dispatch(setUserProfile(profile));
        } catch (error) {
          console.error(error);
        }
      };

      isMobile && fetchProfile();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMobile]
  );

  const handleDeletePost = async (boardId: number) => {
    await deletePost(boardId);
    setPostList((prevPosts) =>
      prevPosts.filter((post) => post.boardId !== boardId)
    );
  };

  const handleMoreBoxToggle = (boardId: number | null) => {
    setOpenedBoardId((prevId) => (prevId === boardId ? null : boardId));
  };

  /* 페이지네이션 이전 클릭 */
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  /* 페이지네이션 다음 클릭 */
  const handleNextPage = () => {
    if (postList.length === ITEMS_PER_PAGE) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  /* 페이지네이션 페이지 클릭 */
  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  /* PostBoard 모달 닫기 */
  const handlePostingClose = () => {
    dispatch(setClosePostingModal());
  };

  const handleModalClose = () => {
    handlePostingClose();
  };

  return (
    <Wrapper>
      <MyPostContent>
        <PostPage>
          {isMobile && postList.length === 0 ? (
            <></>
          ) : (
            <Top>내가 작성한 글</Top>
          )}

          {postList.length > 0 ? (
            !isMobile ? (
              <>
                <Columns>
                  <Left>소환사</Left>
                  <Center>티어</Center>
                  <Center>메모</Center>
                  <Center>등록일시</Center>
                </Columns>
                <PostList>
                  {postList.map((item, index) => (
                    <Post
                      key={item.boardId}
                      boardId={item.boardId}
                      openedBoardId={openedBoardId}
                      memberId={item.memberId}
                      profileImage={item.profileImage}
                      gameName={item.gameName}
                      tag={item.tag}
                      tier={item.tier || ""}
                      rank={item.rank || 0}
                      contents={item.contents}
                      createdAt={item.createdAt}
                      bumpTime={item.bumpTime}
                      boardNumber={index + 1}
                      onDeletePost={handleDeletePost}
                      onMoreBoxToggle={handleMoreBoxToggle}
                    />
                  ))}
                </PostList>

                <Pagination
                  currentPage={currentPage}
                  itemsPerPage={ITEMS_PER_PAGE}
                  hasMoreItems={hasMoreItems}
                  pageButtonCount={pageButtonCount}
                  totalItems={totalCount}
                  totalPage={totalPage}
                  onPrevPage={handlePrevPage}
                  onNextPage={handleNextPage}
                  onPageClick={handlePageClick}
                />
              </>
            ) : (
              <>
                <MoPostList>
                  {postList.map((item, index) => (
                    <MoPost
                      key={item.boardId}
                      user={user}
                      boardId={item.boardId}
                      memberId={item.memberId}
                      profileImage={item.profileImage}
                      gameName={item.gameName}
                      tag={item.tag}
                      tier={item.tier || ""}
                      rank={item.rank || 0}
                      contents={item.contents}
                      createdAt={item.createdAt}
                      bumpTime={item.bumpTime}
                      boardNumber={index + 1}
                      onDeletePost={handleDeletePost}
                    />
                  ))}
                </MoPostList>
                <div ref={sentinelRef}></div>
              </>
            )
          ) : (
            <NoData>내가 작성한 글이 없습니다.</NoData>
          )}
        </PostPage>
      </MyPostContent>

      {isPostingModal && (
        <PostBoard
          onClose={handlePostingClose}
          onCompletedPostingClose={handleModalClose}
        />
      )}
    </Wrapper>
  );
};

export default MyPostPage;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 140px;
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 30px 20px;
  }
`;

const MyPostContent = styled.div`
  max-width: 1440px;
  width: 100%;
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 0;
  }
`;

const PostPage = styled.header`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
  margin-bottom: 100px;
`;

const Top = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  color: ${theme.colors.gray700};
  ${(props) => props.theme.fonts.bold25};
  margin-bottom: 38px;
  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) => props.theme.fonts.semiBold18}
    margin-bottom: 13px;
  }
`;

const Columns = styled.div`
  width: 100%;
  height: 48px;
  border-radius: 8px;
  background: ${theme.colors.gray800};
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.bold14};
  padding: 0 15px;
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 0.6fr 1fr 0.7fr;
  flex-shrink: 0;
`;

const Left = styled.div`
  min-width: 200px;
  text-align: left;
  padding-left: 45px;
`;

const Center = styled.div`
  text-align: center;
`;

const NoData = styled.div`
  width: 100%;
  height: 100%;
  min-height: 686px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${theme.colors.gray600};
  ${theme.fonts.regular16}
`;

const PostList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 60px;
`;

const MoPostList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 60px;
  gap: 16px;
`;

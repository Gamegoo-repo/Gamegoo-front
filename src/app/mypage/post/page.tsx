"use client";

import styled from "styled-components";
import { theme } from "@/styles/theme";
import ChatButton from "@/components/common/ChatButton";
import Post, { PostProps } from "@/components/mypage/post/Post";
import { useEffect, useState } from "react";
import { getMyPost } from "@/api/user";
import Pagination from "@/components/common/Pagination";
import { deletePost } from "@/api/board";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const MyPostPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postList, setPostList] = useState<PostProps[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const pageButtonCount = 5;
  const ITEMS_PER_PAGE = 10;

  const currentPost = useSelector((state: RootState) => state.post.currentPost);

  useEffect(() => {
    const fetchGetMyPost = async () => {
      const response = await getMyPost(currentPage);
      setPostList(response.result);
      setHasMoreItems(response.result.length === ITEMS_PER_PAGE);
    };

    fetchGetMyPost();
  }, [currentPage, currentPost]);

  useEffect(() => {
    const fetchGetMyPost = async () => {
      const response = await getMyPost(currentPage);
      setPostList(response.result);
      console.log("수정내용 반영");
    };

    fetchGetMyPost();
  }, [currentPost]);

  useEffect(() => {}, [postList]);

  const handleDeletePost = async (boardId: number) => {
    await deletePost(boardId);
    setPostList((prevPosts) =>
      prevPosts.filter((post) => post.boardId !== boardId)
    );
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

  return (
    <Wrapper>
      <MyPostContent>
        <PostPage>
          <Title>내가 작성한 글</Title>
          <Columns>
            <Left>소환사명</Left>
            <Center>티어</Center>
            <Center>메모</Center>
            <Center>등록일시</Center>
          </Columns>
          {postList.length > 0 ? (
            <PostList>
              {postList.map((item) => (
                <Post
                  key={item.boardId}
                  boardId={item.boardId}
                  memberId={item.memberId}
                  profileImage={item.profileImage}
                  gameName={item.gameName}
                  tag={item.tag}
                  tier={item.tier}
                  rank={item.rank}
                  contents={item.contents}
                  createdAt={item.createdAt}
                  onDeletePost={handleDeletePost}
                />
              ))}
            </PostList>
          ) : (
            <NoData>내가 작성한 글이 없습니다.</NoData>
          )}
          <Pagination
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            hasMoreItems={hasMoreItems}
            pageButtonCount={pageButtonCount}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
            onPageClick={handlePageClick}
          />
        </PostPage>
      </MyPostContent>
      <Footer>
        <ChatBoxContent>
          <ChatButton />
        </ChatBoxContent>
      </Footer>
    </Wrapper>
  );
};

export default MyPostPage;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 140px;
`;

const MyPostContent = styled.div`
  max-width: 1440px;
  width: 100%;
  padding: 0 80px;
`;

const PostPage = styled.header`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
  margin-bottom: 100px;
`;

const Title = styled.div`
  ${(props) => props.theme.fonts.bold25};
  color: ${theme.colors.gray700};
  margin-bottom: 39px;
`;

const Columns = styled.div`
  width: 100%;
  height: 48px;
  border-radius: 8px;
  background: ${theme.colors.gray600};
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

const Footer = styled.footer`
  display: flex;
  margin-bottom: 78px;
`;

const ChatBoxContent = styled.div`
  margin-left: auto;
`;
const PostList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 60px;
`;

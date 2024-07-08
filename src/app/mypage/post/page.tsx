"use client";

import styled from "styled-components";
import { theme } from "@/styles/theme";
import Post from "@/components/mypage/post/Post";
import { EX_POST } from "@/data/mypage";

const MyPostPage = () => {
  return (
    <Wrapper>
      <MyPostContent>
        <PostPage>
          <Title>내가 작성한 글</Title>
          <Columns>
            <div>소환사명</div>
            <Center>티어</Center>
            <Center>메모</Center>
            <Center>등록일시</Center>
          </Columns>
          {EX_POST.map((item, index) => (
            <Post
              key={index}
              index={index + 1}
              profileImg={item.profileImg}
              nickname={item.nickname}
              tag={item.tag}
              tier={item.tier}
              text={item.text}
              time={item.time}
            />
          ))}
        </PostPage>
      </MyPostContent>
    </Wrapper>
  );
};

export default MyPostPage;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
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
  margin-bottom: 32px;
`;

const Title = styled.h1`
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
  padding: 13px 41px;
  display: grid;
  grid-template-columns: 2fr 1fr 2fr 1fr;
`;

const Center = styled.div`
  text-align: center;
`;

"use client";

import styled from "styled-components";
import { theme } from "@/styles/theme";

const MyPostPage = () => {
  return (
    <Wrapper>
      <MyPostContent>
        <Profile>
          <Title>내가 작성한 글</Title>
        </Profile>
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

const Profile = styled.header`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  ${(props) => props.theme.fonts.bold25};
  color: ${theme.colors.gray700};
`;

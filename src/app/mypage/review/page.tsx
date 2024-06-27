"use client";

import styled from "styled-components";
import { theme } from "@/styles/theme";

const MyReviewPage = () => {
  return (
    <Wrapper>
      <MyReviewContent>
        <Profile>
          <Title>내 평가</Title>
        </Profile>
        <Private>
          <Small>매너 키워드</Small>
        </Private>
      </MyReviewContent>
    </Wrapper>
  );
};

export default MyReviewPage;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const MyReviewContent = styled.div`
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

const Private = styled.header`
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

const Small = styled.h1`
  ${(props) => props.theme.fonts.bold11};
  color: ${theme.colors.gray800};
`;

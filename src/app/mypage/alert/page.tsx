"use client";

import styled from "styled-components";
import { theme } from "@/styles/theme";
ㄴ;
const MyAlertPage = () => {
  return (
    <Wrapper>
      <MyAlertContent>
        <Profile>
          <Small>알림 페이지</Small>
        </Profile>
      </MyAlertContent>
    </Wrapper>
  );
};

export default MyAlertPage;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const MyAlertContent = styled.div`
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

const Small = styled.h1`
  ${(props) => props.theme.fonts.bold11};
  color: ${theme.colors.gray800};
`;

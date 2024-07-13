"use client";

import styled from "styled-components";
import { theme } from "@/styles/theme";

const MyHelpPage = () => {
  return (
    <Wrapper>
      <MyHelpContent>
        <Profile>
          <Title>도움말</Title>
        </Profile>
      </MyHelpContent>
    </Wrapper>
  );
};

export default MyHelpPage;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const MyHelpContent = styled.div`
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

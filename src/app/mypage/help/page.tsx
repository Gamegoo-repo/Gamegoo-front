"use client";

import styled from "styled-components";
import { theme } from "@/styles/theme";
import ChatButton from "@/components/common/ChatButton";

const MyHelpPage = () => {
  return (
    <Wrapper>
      <MyHelpContent>
        <Profile>
          <Title>도움말</Title>
        </Profile>
      </MyHelpContent>
      <Footer>
        <ChatBoxContent>
          <ChatButton />
        </ChatBoxContent>
      </Footer>
    </Wrapper>
  );
};

export default MyHelpPage;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 140px;
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

const Title = styled.div`
  ${(props) => props.theme.fonts.bold25};
  color: ${theme.colors.gray700};
`;

const Footer = styled.footer`
  display: flex;
  margin-bottom: 78px;
`;

const ChatBoxContent = styled.div`
  margin-left: auto;
`;

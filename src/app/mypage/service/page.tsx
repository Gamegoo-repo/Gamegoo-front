"use client";

import styled from "styled-components";
import { theme } from "@/styles/theme";
import ChatButton from "@/components/common/ChatButton";

const MyServicePage = () => {
  return (
    <Wrapper>
      <MyServiceContent>
        <Profile>
          <Title>고객센터</Title>
        </Profile>
      </MyServiceContent>
      <Footer>
        <ChatBoxContent>
          <ChatButton />
        </ChatBoxContent>
      </Footer>
    </Wrapper>
  );
};

export default MyServicePage;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 140px;
`;

const MyServiceContent = styled.div`
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

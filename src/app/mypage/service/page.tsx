"use client";

import styled from "styled-components";
import { theme } from "@/styles/theme";
import ChatButton from "@/components/common/ChatButton";

const MyServicePage = () => {
  return (
    <Wrapper>
      <MyServiceContent>
        <Blocked>
          <Top>고객 센터</Top>
        </Blocked>
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

const Blocked = styled.header`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 32px;
`;

const Top = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  color: ${theme.colors.gray700};
  ${(props) => props.theme.fonts.regular25};
  padding-bottom: 13px;
  margin-bottom: 20px;
  border-bottom: 1px solid ${theme.colors.gray400};
`;

const Footer = styled.footer`
  display: flex;
  margin-bottom: 78px;
`;

const ChatBoxContent = styled.div`
  margin-left: auto;
`;

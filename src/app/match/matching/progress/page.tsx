"use client";

import ChatBox from "@/components/common/ChatBox";
import styled from "styled-components";
import HeaderTitle from "@/components/common/HeaderTitle";

const Progress = () => {
  return (
    <Wrapper>
      <MatchContent>
        <HeaderTitle title="매칭 중" />
        <Main>내용</Main>
        <Footer>
          <ChatBoxContent>
            <ChatBox count={3} />
          </ChatBoxContent>
        </Footer>
      </MatchContent>
    </Wrapper>
  );
};

export default Progress;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const MatchContent = styled.div`
  max-width: 1440px;
  width: 100%;
  padding: 0 80px;
`;

const Main = styled.main`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 27px;
  margin-bottom: 37px;
`;

const Footer = styled.footer`
  display: flex;
  margin-bottom: 78px;
`;

const ChatBoxContent = styled.div`
  margin-left: auto;
  margin-bottom: 37px;
`;

"use client";

import ChatBox from "@/components/common/ChatButton";
import styled from "styled-components";
import HeaderTitle from "@/components/common/HeaderTitle";
import SquareProfile from "@/components/match/SquareProfile";
import Image from "next/image";
import { theme } from "@/styles/theme";

const Progress = () => {
  return (
    <Wrapper>
      <MatchContent>
        <Header>
          <HeaderTitle title="매칭 중" sub="나와 꼭 맞는 상대를 찾는 중..." />
          <Time>
            <Span>2:20&nbsp;</Span>/5:00
          </Time>
        </Header>
        <Main>
          <SquareProfile />
          <Waiting>
            <Image
              src="/assets/images/wait_heart.svg"
              width={225}
              height={225}
              alt="heart"
            />
            어떤 사람이 나올까요?
          </Waiting>
        </Main>
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

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Time = styled.div`
  color: ${theme.colors.gray700};
  ${(props) => props.theme.fonts.regular28}
  margin-bottom: 32px;
`;

const Span = styled.span`
  color: ${theme.colors.purple100};
  ${(props) => props.theme.fonts.bold45}
`;

const Main = styled.main`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: flex-start;
  width: 100%;
  gap: 72px;
  margin-bottom: 37px;
`;

const Waiting = styled.div`
  width: 100%;
  height: 580px;
  border-radius: 30px;
  background: var(--12, #f7f7f9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 42px;
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.regular25};
`;

const Footer = styled.footer`
  display: flex;
  margin-bottom: 78px;
`;

const ChatBoxContent = styled.div`
  margin-left: auto;
  margin-bottom: 37px;
`;

"use client";

import ChatButton from "@/components/common/ChatButton";
import GraphicBox from "@/components/match/GraphicBox";
import { MATCH_PAGE_DATA } from "@/data/match";
import Image from "next/image";
import styled from "styled-components";

const HomePage = () => {
  return (
    <Wrapper>
      <HomeContent>
        <Header>
          <Image
            src="/assets/icons/logo_m.svg"
            width={371}
            height={117}
            priority
            alt="logo"
          />
          <SubTitle>겜구 커뮤니티에 오신 것을 환영합니다.</SubTitle>
        </Header>
        <Main>
          {MATCH_PAGE_DATA.map((box) => {
            return (
              <GraphicBox
                key={box.id}
                pathname={box.pathname}
                height={box.height}
                top={box.top}
                left={box.left}
                background={box.background}
              >
                {box.title}
              </GraphicBox>
            );
          })}
        </Main>
        <Footer>
          <ChatBoxContent>
            <ChatButton count={3} />
          </ChatBoxContent>
        </Footer>
      </HomeContent>
    </Wrapper>
  );
};

export default HomePage;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 140px;
`;

const HomeContent = styled.div`
  max-width: 1440px;
  width: 100%;
  padding: 0 80px;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: start;
  margin-bottom: 52px;
`;
const SubTitle = styled.div`
  ${(props) => props.theme.fonts.regular25};
  color: #44515c;
`;

const Main = styled.main`
  display: flex;
  align-items: center;
  gap: 59px;
  margin-bottom: 37px;

  @media (max-width: 1200px) {
    flex-direction: column;
    justify-content: center;
  }
`;
const Footer = styled.footer`
  display: flex;
  margin-bottom: 78px;
`;

const ChatBoxContent = styled.div`
  margin-left: auto;
`;

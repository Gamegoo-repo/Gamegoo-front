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
              >
                {box.title}
              </GraphicBox>
            );
          })}
        </Main>
        <ChatButton count={3} />
      </HomeContent>
    </Wrapper>
  );
};

export default HomePage;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const HomeContent = styled.div`
    max-width: 1440px;
    width: 100%;
    padding: 0 80px;
`;

const Header = styled.header`
  height: 150px;
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
  gap: 55px;
`;

'use client';

import ChatBox from "@/components/common/ChatBox";
import GraphicBox from "@/components/match/GraphicBox";
import Image from "next/image";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const GAME_MODE_DATA = [
  { id: 1, type: 'game', pathname: 'profile', height: '377px', top: '50%', left: '50%', title: '빠른 대전' },
  { id: 2, type: 'game', pathname: 'profile', height: '377px', top: '50%', left: '50%', title: '솔랭' },
  { id: 3, type: 'game', pathname: 'profile', height: '377px', top: '50%', left: '50%', title: '자랭' },
  { id: 4, type: 'game', pathname: 'profile', height: '377px', top: '50%', left: '50%', title: '칼바람' },
];

const GameModePage = () => {
  const router = useRouter();
  const [displayedData, setDisplayedData] = useState(GAME_MODE_DATA);
  const searchParams = useSearchParams();
  const params = searchParams.get('type');

  useEffect(() => {
    if (params === 'fun') {
      setDisplayedData(GAME_MODE_DATA);
      return;
    }
    if (params === 'hard') {
      setDisplayedData(GAME_MODE_DATA.slice(0, -1));
      return;
    }
  }, [params]);

  return (
    <Wrapper>
      <MatchContent>
        <Header>
          <StyledImage
            onClick={() => router.back()}
            src="/assets/icons/left_arrow.svg"
            width={20}
            height={39}
            alt="back button" />
          <Title>게임모드 선택</Title>
        </Header>
        <Main>
          {displayedData.map((box) => {
            return (
              <BoxWrapper
                key={box.id}
              >
                <GraphicBox
                  pathname={box.pathname}
                  height={box.height}
                  top={box.top}
                  left={box.left}>
                  {box.title}
                </GraphicBox>
              </BoxWrapper>
            )
          })}
        </Main>
        <Footer>
          <ChatBoxContent>
            <ChatBox count={3} />
          </ChatBoxContent>
        </Footer>
      </MatchContent>
    </Wrapper>
  )
};

export default GameModePage;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const MatchContent = styled.div`
  max-width: 1440px;
  width: 100%;;
  padding: 0 80px;
`

const Header = styled.header`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 32px;
`

const StyledImage = styled(Image)`
  margin-right:35px;
  cursor:pointer;
`

const Title = styled.h1`
  ${(props) => props.theme.fonts.bold32};
  color:#393939;
`

const Main = styled.main`
  display: flex;
  align-items: center;
  width: 100%;
  gap:27px;
  margin-bottom:37px;
`

const BoxWrapper = styled.div`
  display: contents;
`

const Footer = styled.footer`
  display: flex;
  margin-bottom:78px;
`

const ChatBoxContent = styled.div`
  margin-left: auto;
  margin-bottom: 37px;
`
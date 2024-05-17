'use client';

import ChatBox from "@/components/common/ChatBox";
import GraphicBox from "@/components/match/GraphicBox";
import Image from "next/image";
import styled from "styled-components";
import { useState } from "react";

const MATCH_MODE_DATA = [
  { id: 1, type: 'match', pathname: 'game-mode', width: '600px', height: '380px', top: '50%', left: '50%', title: '즐겜' },
  { id: 2, type: 'match', pathname: 'game-mode', width: '600px', height: '380px', top: '50%', left: '50%', title: '빡겜' },
];

const GAME_MODE_DATA = [
  { id: 1, type: 'game', pathname: 'game-mode', height: '377px', top: '50%', left: '50%', title: '빠른 대전' },
  { id: 2, type: 'game', pathname: 'game-mode', height: '377px', top: '50%', left: '50%', title: '빡솔랭겜' },
  { id: 3, type: 'game', pathname: 'game-mode', height: '377px', top: '50%', left: '50%', title: '자랭' },
  { id: 4, type: 'game', pathname: 'game-mode', height: '377px', top: '50%', left: '50%', title: '칼바람' },
];

const GameModePage = () => {
  const [isPageType, setIsPageType] = useState('match');
  const [displayedData, setDisplayedData] = useState(GAME_MODE_DATA);

  const handleType = (type: string, id: number) => {
    if (type === 'match') {
      setIsPageType('game');
    }

    if (id === 1) {
      setDisplayedData(GAME_MODE_DATA);
      return;
    }
    if (id === 2) {
      setDisplayedData(GAME_MODE_DATA.slice(0, -1));
      return;
    }
  };

  return (
    <Wrapper>
      <MatchContent>
        <Header $type={isPageType}>
          {isPageType === 'game' &&
            <StyledImage
              onClick={() => setIsPageType('match')}
              $type={isPageType}
              src="/assets/icons/left_arrow.svg"
              width={20}
              height={39}
              alt="back button" />
          }
          <Title>{isPageType === 'match' ? '바로 매칭하기' : '게임모드 선택'}</Title>
        </Header>
        {isPageType === 'match' &&
          <Main>
            {MATCH_MODE_DATA.map((box) => {
              return (
                <BoxWrapper
                  key={box.id}
                  onClick={() => handleType(box.type, box.id)}
                >
                  <GraphicBox
                    pathname={box.pathname}
                    width={box.width}
                    height={box.height}
                    top={box.top}
                    left={box.left}>
                    {box.title}
                  </GraphicBox>
                </BoxWrapper>
              )
            })}
          </Main>
        }
        {isPageType === 'game' &&
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
        }
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

const Header = styled.header<{ $type: string }>`
  display: flex;
  flex-direction: ${(props) => props.$type === 'match' ? 'column' : 'none'};
  align-items: ${(props) => props.$type === 'match' ? 'start' : 'center'};
  width: 100%;
  margin-bottom: 32px;
`

const StyledImage = styled(Image) <{ $type: string }>`
  margin-right:${(props) => props.$type === 'match' ? 'none' : '35px'};
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
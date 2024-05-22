'use client';

import styled from "styled-components";
import ChatBox from "@/components/common/ChatBox";
import GraphicBox from "@/components/match/GraphicBox";


const MATCH_MODE_DATA = [
    { id: 1, type:'fun',pathname: '/game-mode', width: '600px', height: '380px', top: '50%', left: '50%', title: '즐겜' },
    { id: 2, type:'hard',pathname: '/game-mode', width: '600px', height: '380px', top: '50%', left: '50%', title: '빡겜' },
];

const MatchTypePage = () => {

    return (
        <Wrapper>
            <MatchContent>
                <Header>
                    <Title>바로 매칭하기</Title>
                </Header>
                <Main>
                    {MATCH_MODE_DATA.map((box) => {
                        return (
                            <BoxWrapper
                                key={box.id}
                            >
                                <GraphicBox
                                    type={box.type}
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
                <Footer>
                    <ChatBoxContent>
                        <ChatBox count={3} />
                    </ChatBoxContent>
                </Footer>
            </MatchContent>
        </Wrapper>
    )
};

export default MatchTypePage;

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
  flex-direction: column;
  align-items: start;
  width: 100%;
  margin-bottom: 32px;
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
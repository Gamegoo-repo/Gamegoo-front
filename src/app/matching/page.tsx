'use client';

import GraphicBox from "@/components/matching/GraphicBox";
import styled from "styled-components";

const MatchingPage = () => {

    return (
        <Wrapper>
            <div>
                <Header>
                    <Title>바로 매칭하기</Title>
                </Header>
                <Main>
                    <GraphicBox
                        href='game-mode-fun'
                        width='600px'
                        height="380px"
                        top='50%'
                        left='50%'>
                        즐겜
                    </GraphicBox>
                    <GraphicBox
                        href='game-mode-hard'
                        width='600px'
                        height="380px"
                        top='50%'
                        left='50%'>
                        빡겜
                    </GraphicBox>
                </Main>
            </div>
        </Wrapper>
    )
};

export default MatchingPage;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const Header = styled.header`
  max-width: 1440px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  margin-bottom: 32px;
`

const Title = styled.h1`
  ${(props) => props.theme.fonts.bold32};
  color:#393939;
`

const Main = styled.main`
  display: flex;
  align-items: center;
  gap:27px;
  max-width: 1440px;
  width: 100%;

`
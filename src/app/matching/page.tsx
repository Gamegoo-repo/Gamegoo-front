'use client'

import GraphicBox from "@/components/graphicBox";
import styled from "styled-components";

const MatchingPage = () => {
    return (
        <Wrapper>
            <Content>
                <header>
                    <Title>바로 매칭하기</Title>
                </header>
                <main>
                    <GraphicBox
                        href='/'
                        width='600px'
                        top='50%'
                        left='50%'>
                        즐겜
                    </GraphicBox>
                    <GraphicBox
                        href='/'
                        width='600px'
                        top='50%'
                        left='50%'>
                        빡겜
                    </GraphicBox>
                </main>
            </Content>
        </Wrapper>
    )
};

export default MatchingPage;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const Content = styled.div`
  max-width: 1440px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Title = styled.h1`
  ${(props) => props.theme.fonts.bold32};
    color:#393939;
`
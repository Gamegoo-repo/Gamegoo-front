"use client";

import GraphicBox from "@/components/graphicBox";
import { theme } from "@/styles/theme";
import Image from "next/image";
import styled from "styled-components";

export default function Home() {
  return (
    //  <Example>Gamegoo Initial settings</Example>;
    <Wrapper>
      <Content>
      <Header>
        <Image
          src='/assets/icons/logo.svg'
          width={371}
          height={117}
          alt='logo' />
        <SubTitle>겜구 커뮤니티에 오신 것을 환영합니다.</SubTitle>
      </Header>
      <Main>
        <GraphicBox href='/'>바로 매칭하기</GraphicBox>
        <GraphicBox href='/'>매칭 게시판에서 찾기</GraphicBox>
      </Main>
      </Content>
    </Wrapper>
  )
}

const Example = styled.div`
  color: ${theme.colors.purple100};
  ${(props) => props.theme.fonts.bold32};
`;

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

const Header = styled.header`
    align-items: left;

`
const Main = styled.main`
  /* display: flex;
  align-items: center;
  justify-content: center; */
  display: block;
  margin:0 auto;
`
const SubTitle = styled.div`
  ${(props) => props.theme.fonts.regular25};
  color:#44515C;
  margin-bottom:60px;
`

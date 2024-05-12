'use client'

import GraphicBox from "@/components/graphicBox";
import Image from "next/image";
import styled from "styled-components";

const HomePage = () => {
    return (
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
                <main>
                    <GraphicBox
                        href='/'
                        width='1206px'
                        top='36px'
                        left='41px'>
                        바로 매칭하기
                    </GraphicBox>
                    <GraphicBox
                        href='/'
                        width='1206px'
                        top='36px'
                        left='41px'>
                        매칭 게시판에서 찾기
                    </GraphicBox>
                </main>
            </Content>
        </Wrapper>
    )
};

export default HomePage;

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
  margin-bottom:60px;
`
const SubTitle = styled.div`
  ${(props) => props.theme.fonts.regular25};
  color:#44515C;
`

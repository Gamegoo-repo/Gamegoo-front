'use client';

import ChatBox from "@/components/common/ChatBox";
import GraphicBox from "@/components/matching/GraphicBox";
import Image from "next/image";
import styled from "styled-components";

const HomePage = () => {
    return (
        <Wrapper>
            <HomeContent>
                <Header>
                    <Image
                        src='/assets/icons/logo.svg'
                        width={371}
                        height={117}
                        priority
                        alt='logo' />
                    <SubTitle>겜구 커뮤니티에 오신 것을 환영합니다.</SubTitle>
                </Header>
                <Main>
                    <GraphicBox
                        href='/'
                        width='1206px'
                        height='227px'
                        top='36px'
                        left='41px'>
                        바로 매칭하기
                    </GraphicBox>
                    <GraphicBox
                        href='/'
                        width='1206px'
                        height='227px'
                        top='36px'
                        left='41px'>
                        매칭 게시판에서 찾기
                    </GraphicBox>
                </Main>
                <Footer>
                    <ChatBoxContent>
                        <ChatBox count={3} />
                    </ChatBoxContent>
                </Footer>
            </HomeContent>
        </Wrapper>
    )
};

export default HomePage;

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`

const HomeContent = styled.div`
    max-width: 1206px;
    width: 100%;
`

const Header = styled.header`
    display: flex;
    flex-direction: column;
    align-items: start;
    margin-bottom:60px;
`
const SubTitle = styled.div`
    ${(props) => props.theme.fonts.regular25};
    color:#44515C;
`

const Main = styled.main`
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap:30px;
    margin-bottom:37px;
`
const Footer = styled.footer`
    display: flex;
    margin-bottom:78px;
`

const ChatBoxContent = styled.div`
    margin-left: auto;
    margin-bottom: 37px;
`


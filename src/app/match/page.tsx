'use client';

import ChatBox from "@/components/common/ChatBox";
import GraphicBox from "@/components/match/GraphicBox";
import Image from "next/image";
import styled from "styled-components";

const BOXS_DATA = [
    { id: 1, pathname: 'game-mode', width: '1206px', height: '227px', top: '36px', left: '41px', title: '바로 매칭하기' },
    { id: 2, pathname: 'board', width: '1206px', height: '227px', top: '36px', left: '41px', title: '매칭 게시판에서 찾기' },
];

const HomePage = () => {

    return (
        <Wrapper>
            <HomeContent>
                <Header>
                    <Image
                        src='/assets/icons/logo_m.svg'
                        width={371}
                        height={117}
                        priority
                        alt='logo' />
                    <SubTitle>겜구 커뮤니티에 오신 것을 환영합니다.</SubTitle>
                </Header>
                <Main>
                    {BOXS_DATA.map((box) => {
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

                        )
                    })}
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
    max-width: 1440px;
    width: 100%;
    padding: 0 80px;
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


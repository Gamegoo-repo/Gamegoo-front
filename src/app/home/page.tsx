'use client';

import ChatButton from "@/components/common/ChatButton";
import GraphicBox from "@/components/match/GraphicBox";
import { MATCH_PAGE_DATA } from "@/data/match";
import { RootState } from "@/redux/store";
import Image from "next/image";
import { useSelector } from "react-redux";
import styled from "styled-components";

const HomePage = () => {

    const isEvaluationModalOpen = useSelector((state: RootState) => state.modal.evaluationModal);

    return (
        <Wrapper>
            <HomeContent 
            $isEvaluationModalOpen={isEvaluationModalOpen}>
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

                        )
                    })}
                </Main>
                <Footer>
                    <ChatBoxContent>
                        <ChatButton count={3} />
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
`;

const HomeContent = styled.div<{ $isEvaluationModalOpen: boolean }>`
    max-width: 1440px;
    width: 100%;
    padding: 0 80px;
    &:before {
        content: '';
        position: ${({ $isEvaluationModalOpen }) => $isEvaluationModalOpen ? 'fixed' : 'unset'};
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: ${({ $isEvaluationModalOpen }) => $isEvaluationModalOpen ? '#0000009C' : 'transparent'};
        z-index: 100;
    }
`;

const Header = styled.header`
    display: flex;
    flex-direction: column;
    align-items: start;
    margin-bottom:52px;
`;
const SubTitle = styled.div`
    ${(props) => props.theme.fonts.regular25};
    color:#44515C;
`;

const Main = styled.main`
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap:30px;
    margin-bottom:37px;
`;
const Footer = styled.footer`
    display: flex;
    margin-bottom:78px;
`;

const ChatBoxContent = styled.div`
    margin-left: auto;
`;


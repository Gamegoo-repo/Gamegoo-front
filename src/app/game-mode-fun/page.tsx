'use client';

import GraphicBox from "@/components/matching/GraphicBox";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styled from "styled-components";

const GameModeFunPage = () => {
    const router = useRouter();

    const handlePrevPage = () => {
        router.back();
    }

    return (
        <Wrapper>
            <div>
                <Header>
                    <TitleContent>
                        <Image
                            onClick={handlePrevPage}
                            src='/assets/icons/icon_left_arrow.svg'
                            width={20}
                            height={39}
                            alt='back'
                        />
                        <Title>게임모드 선택</Title>
                    </TitleContent>
                </Header>
                <Main>
                    <GraphicBox
                        href='/'
                        top='50%'
                        height='377px'
                        left='50%'>
                        빠른 대전
                    </GraphicBox>
                    <GraphicBox
                        href='/'
                        top='50%'
                        height='377px'
                        left='50%'>
                        솔랭
                    </GraphicBox>
                    <GraphicBox
                        href='/'
                        top='50%'
                        height='377px'
                        left='50%'>
                        자랭
                    </GraphicBox>
                    <GraphicBox
                        href='/'
                        top='50%'
                        height='377px'
                        left='50%'>
                        칼바람
                    </GraphicBox>
                </Main>
            </div>
        </Wrapper>
    )
};

export default GameModeFunPage;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const Header = styled.header`
  max-width: 1440px;
  width: 100%;
  display: flex;
  align-items: start; 
`

const TitleContent = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 45px;
    img{
    margin-right: 32px;
    cursor: pointer;
  }
`
const Title = styled.h1`
  ${(props) => props.theme.fonts.bold32};
  color:#393939;
`

const Main = styled.main`
  display: grid;
 grid-template-columns: repeat(auto-fit, minmax(296px, auto));
  column-gap:14px;
  max-width: 1440px;
  width: 100%;
`
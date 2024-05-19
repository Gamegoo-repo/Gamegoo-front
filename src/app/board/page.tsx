"use client";

import styled from "styled-components";
import Image from "next/image";
import { theme } from "@/styles/theme";
import Button from "@/components/common/Button";
import Dropdown from "@/components/common/Dropdown";

const DROP_DATA1 = [
    { id: 1, value: '솔로1' },
    { id: 2, value: '솔로2' },
    { id: 3, value: '솔로3' },
];

const DROP_DATA2 = [
    { id: 1, value: '티어1' },
    { id: 2, value: '티어2' },
    { id: 3, value: '티어3' },
];

const BOARD_TITLE = [
    { id: 1, name: '소환사' },
    { id: 2, name: '매너 레벨' },
    { id: 3, name: '티어' },
    { id: 4, name: '주/부 포지션' },
    { id: 5, name: '찾는 포지션' },
    { id: 6, name: '최근 선호 챔피언' },
    { id: 7, name: '승률' },
    { id: 8, name: '등록일시' },
];

const BOARD_CONTENT = [
    { id: 1, image: '/assets/icons/gray_circle.svg', account: '소환사명1', manner_lev: 5, tier: 'UR', main_position: 0, sub_position: 1, hope_position: 1, champion: ['/assets/icons/gray_circle.svg', '/assets/icons/gray_circle.svg', '/assets/icons/gray_circle.svg'], odds: 32, date: '20분 전' },
    { id: 2, image: '/assets/icons/gray_circle.svg', account: '소환사명1', manner_lev: 5, tier: 'UR', main_position: 0, sub_position: 1, hope_position: 1, champion: ['/assets/icons/gray_circle.svg', '/assets/icons/gray_circle.svg', '/assets/icons/gray_circle.svg'], odds: 97, date: '20분 전' },
    { id: 3, image: '/assets/icons/gray_circle.svg', account: '소환사명1', manner_lev: 5, tier: 'UR', main_position: 0, sub_position: 1, hope_position: 1, champion: ['/assets/icons/gray_circle.svg', '/assets/icons/gray_circle.svg', '/assets/icons/gray_circle.svg'], odds: 50, date: '20분 전' },
    { id: 4, image: '/assets/icons/gray_circle.svg', account: '소환사명1', manner_lev: 5, tier: 'UR', main_position: 0, sub_position: 1, hope_position: 1, champion: ['/assets/icons/gray_circle.svg', '/assets/icons/gray_circle.svg', '/assets/icons/gray_circle.svg'], odds: 32, date: '20분 전' },
    { id: 5, image: '/assets/icons/gray_circle.svg', account: '소환사명1', manner_lev: 5, tier: 'UR', main_position: 0, sub_position: 1, hope_position: 1, champion: ['/assets/icons/gray_circle.svg', '/assets/icons/gray_circle.svg', '/assets/icons/gray_circle.svg'], odds: 60, date: '20분 전' },
    { id: 6, image: '/assets/icons/gray_circle.svg', account: '소환사명1', manner_lev: 5, tier: 'UR', main_position: 0, sub_position: 1, hope_position: 1, champion: ['/assets/icons/gray_circle.svg', '/assets/icons/gray_circle.svg', '/assets/icons/gray_circle.svg'], odds: 32, date: '20분 전' }
];

const POSITION_IMAGES = [
    { id: 1, image: '/assets/icons/position1.svg', name: 'random' },
    { id: 2, image: '/assets/icons/position2.svg', name: 'bot' },
    { id: 3, image: '/assets/icons/position3.svg', name: 'jungle' },
    { id: 4, image: '/assets/icons/position4.svg', name: 'mid' },
    { id: 5, image: '/assets/icons/position5.svg', name: 'top' },
    { id: 6, image: '/assets/icons/position6.svg', name: 'supporter' },
];

const BoardPage = () => {
    return (
        <Wrapper>
            <Header>
                <FirstRow>
                    <Title>게시판</Title>
                    <RefreshImage
                        src='/assets/icons/refresh.svg'
                        width={30}
                        height={27}
                        alt='refresh button'
                    />
                </FirstRow>
                <SecondRow>
                    <FirstBlock>
                        <Dropdown
                            type='type1'
                            width='138px'
                            name='솔로 랭크'
                            fontSize='20px'
                            bgColor="#F5F5F5"
                            list={DROP_DATA1}
                        />
                        <Dropdown
                            type='type1'
                            width='138px'
                            name='티어 선택'
                            fontSize='20px'
                            bgColor='#F5F5F5'
                            list={DROP_DATA2}
                        />
                        <PositionBox>
                            {POSITION_IMAGES.map(image => {
                                return (
                                    <PositionButton
                                        key={image.id}
                                    >
                                        <PositionImage
                                            key={image.id}
                                            src={image.image}
                                            width={17}
                                            height={17}
                                            alt={image.name}
                                            unoptimized
                                        />
                                        {/* <TierRandom /> */}
                                    </PositionButton>
                                )
                            })}
                        </PositionBox>
                        <MicButton>
                            <Image
                                src='/assets/icons/mic.svg'
                                width={21}
                                height={26}
                                alt='mic button'
                            />
                        </MicButton>
                    </FirstBlock>
                    <SecondBlock>
                        <Button
                            buttonType='primary'
                            size='large'
                            text='글 작성하기'
                        />
                    </SecondBlock>
                </SecondRow>
            </Header>
            <Main>
            </Main>
            <Footer>
                페이지네이션
            </Footer>
        </Wrapper>
    )
};

export default BoardPage;

const Wrapper = styled.div`
    width: 100%;
`

const Header = styled.header`
    max-width:1440px;
    width: 100%;
    padding:0 80px;
`

const FirstRow = styled.div`
    display: flex;
    align-items: center;
    justify-content:space-between;
    margin-bottom: 38px;
`

const Title = styled.p`
    ${(props) => props.theme.fonts.regular35};
        color:#44515C;
`

const RefreshImage = styled(Image)`
    cursor: pointer;
`

const SecondRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 25px;
`

const FirstBlock = styled.div`
    display: flex;
    align-items: center;
    gap:15px;
`

const PositionBox = styled.div`
    background: #F5F5F5;
    border-radius: 10px;
`
const PositionButton = styled.button`
    cursor: pointer;
    &:focus{
        background: ${theme.colors.purple100};
    }
`

const PositionImage = styled(Image)`
     &:focus{
        /* fill:${theme.colors.white};
        stroke:${theme.colors.white}; */
        /* color:${theme.colors.white};
        background: ${theme.colors.white}; */
        fill: white;
        stroke: white;
    }

`

// const TierRandom = styled.svg`
//   /* &:hover .path1 {
//     fill: #E5E5E5;
//   }
//   &:hover .path2 {
//     fill: #8B8B8B;
//   }
//   &:focus .rect1 {
//     fill: #E5E5E5;
//   } */
//   &:focus {
//     fill:${theme.colors.white};
//   }
// `;

const MicButton = styled.button`
    width: 56px;
    padding:15px 17px;
    border-radius: 10px;
    background: ${theme.colors.purple100};
    cursor: pointer;
`

const SecondBlock = styled.div`  `

const Main = styled.main`
    max-width:1440px;
    width: 100%;
    padding:0 80px;
    margin-bottom: 64px;
`

const Footer = styled.footer`
    max-width:1440px;
    width: 100%;
    `
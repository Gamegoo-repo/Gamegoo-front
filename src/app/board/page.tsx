"use client";

import styled from "styled-components";
import Image from "next/image";
import { theme } from "@/styles/theme";
import { useEffect, useState } from "react";
import { BOARD_TITLE } from "@/data/board";
import Button from "@/components/common/Button";
import Dropdown from "@/components/common/Dropdown";
import Table from "@/components/board/Table";
import Pagination from "@/components/common/Pagination";
import PositionFilter from "@/components/board/PositionFilter";
import WritePost from "@/components/board/Writing";

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

const BOARD_CONTENT = [
    { id: 1, image: '/assets/icons/gray_circle.svg', account: '소환사명1', manner_lev: 5, tierImg: 0, tier: 'UR', main_position: 0, sub_position: 1, hope_position: 1, champion: ['/assets/icons/gray_circle.svg', '/assets/icons/gray_circle.svg', '/assets/icons/gray_circle.svg'], odds: 32, date: '2024-05-20 02:59' },
    { id: 2, image: '/assets/icons/gray_circle.svg', account: '소환사명1', manner_lev: 5, tierImg: 1, tier: 'UR', main_position: 0, sub_position: 1, hope_position: 1, champion: ['/assets/icons/gray_circle.svg', '/assets/icons/gray_circle.svg', '/assets/icons/gray_circle.svg'], odds: 97, date: '2024-05-20 01:39' },
    { id: 3, image: '/assets/icons/gray_circle.svg', account: '소환사명1', manner_lev: 5, tierImg: 2, tier: 'UR', main_position: 0, sub_position: 1, hope_position: 1, champion: ['/assets/icons/gray_circle.svg', '/assets/icons/gray_circle.svg', '/assets/icons/gray_circle.svg'], odds: 50, date: '2024-05-19 23:27' },
    { id: 4, image: '/assets/icons/gray_circle.svg', account: '소환사명1', manner_lev: 5, tierImg: 3, tier: 'UR', main_position: 0, sub_position: 1, hope_position: 1, champion: ['/assets/icons/gray_circle.svg', '/assets/icons/gray_circle.svg', '/assets/icons/gray_circle.svg'], odds: 32, date: '2024-05-19 03:27' },
    { id: 5, image: '/assets/icons/gray_circle.svg', account: '소환사명1', manner_lev: 5, tierImg: 4, tier: 'UR', main_position: 0, sub_position: 1, hope_position: 1, champion: ['/assets/icons/gray_circle.svg', '/assets/icons/gray_circle.svg', '/assets/icons/gray_circle.svg'], odds: 60, date: '2024-05-18 12:27' },
    { id: 6, image: '/assets/icons/gray_circle.svg', account: '소환사명1', manner_lev: 5, tierImg: 5, tier: 'UR', main_position: 0, sub_position: 1, hope_position: 1, champion: ['/assets/icons/gray_circle.svg', '/assets/icons/gray_circle.svg', '/assets/icons/gray_circle.svg'], odds: 32, date: '2024-04-04 23:27' }
];

const BoardPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    //TODO: itemsPerPage 추후 수정
    const itemsPerPage = 5;
    const pageButtonCount = 5;

    const indexOfLastPost = currentPage * itemsPerPage;
    const indexOfFirstPost = indexOfLastPost - itemsPerPage;
    const currentPosts = BOARD_CONTENT.slice(indexOfFirstPost, indexOfLastPost);

    const [isPosition, setIsPosition] = useState(0);
    const [micOn, setMicOn] = useState(true);
    const [isWritingOpen, setIsWritingOpen] = useState(false);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePositionFilter = (id: number) => {
        setIsPosition(id);
    };

    const handleMic = () => {
        setMicOn((prevStatus) => !prevStatus);
    };

    const handleWritingOpen = () => {
        setIsWritingOpen(true);
    };

    const handleWritingClose = () => {
        setIsWritingOpen(false);
    };

    useEffect(() => {
        if (isWritingOpen) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = 'unset';
        }
    
        return () => {
          document.body.style.overflow = 'unset';
        };
      }, [isWritingOpen]);

    return (
        <>
            {isWritingOpen && <WritePost onClose={handleWritingClose} />}
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
                                list={DROP_DATA1}
                            />
                            <Dropdown
                                type='type1'
                                width='138px'
                                name='티어 선택'
                                list={DROP_DATA2}
                            />
                            <PositionBox>
                                <PositionFilter
                                    onPositionFilter={handlePositionFilter}
                                    isPosition={isPosition}
                                />
                            </PositionBox>
                            <MicButton
                                onClick={handleMic}
                                className={micOn ? 'clicked' : 'unClicked'}>
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
                                onClick={handleWritingOpen}
                                buttonType='primary'
                                size='large'
                                text='글 작성하기'
                            />
                        </SecondBlock>
                    </SecondRow>
                </Header>
                <Main>
                    <Table
                        title={BOARD_TITLE}
                        content={currentPosts}
                    />
                </Main>
                <Footer>
                    <Pagination
                        currentPage={currentPage}
                        totalItems={BOARD_CONTENT.length}
                        itemsPerPage={itemsPerPage}
                        pageButtonCount={pageButtonCount}
                        onPageChange={handlePageChange}
                    />
                </Footer>
            </Wrapper>
        </>
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
    &:focus{
        background: ${theme.colors.purple100};
    }
`
const MicButton = styled.button`
    padding:13px 17px;
    border-radius: 10px;
    &.clicked{
        background: ${theme.colors.purple100};
    }
    &.unClicked{
        background: ${theme.colors.gray300};
    }
`

const SecondBlock = styled.div``

const Main = styled.main`
    max-width:1440px;
    width: 100%;
    padding:0 80px;
    margin-bottom: 64px;
`

const Footer = styled.footer`
    max-width:1440px;
    width: 100%;
    margin-bottom: 123px;
    `
"use client";

import styled from "styled-components";
import Image from "next/image";
import { theme } from "@/styles/theme";
import { useEffect, useRef, useState } from "react";
import { BOARD_TITLE } from "@/data/board";
import Button from "@/components/common/Button";
import Dropdown from "@/components/common/Dropdown";
import Table from "@/components/board/Table";
import Pagination from "@/components/common/Pagination";
import PositionFilter from "@/components/board/PositionFilter";
import PostBoard from "@/components/createBoard/PostBoard";
import ChatButton from "@/components/common/ChatButton";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  setClosePostingModal,
  setOpenPostingModal,
} from "@/redux/slices/modalSlice";

const DROP_DATA1 = [
  { id: 1, value: "솔로1" },
  { id: 2, value: "솔로2" },
  { id: 3, value: "솔로3" },
];

const DROP_DATA2 = [
  { id: 1, value: "티어1" },
  { id: 2, value: "티어2" },
  { id: 3, value: "티어3" },
];

const BOARD_CONTENT = [
  {
    id: 1,
    image: "/assets/icons/gray_circle.svg",
    account: "소환사명1",
    manner_lev: 5,
    tierImg: 0,
    tier: "UR",
    main_position: 0,
    sub_position: 1,
    hope_position: 1,
    champion: [
      "/assets/icons/gray_circle.svg",
      "/assets/icons/gray_circle.svg",
      "/assets/icons/gray_circle.svg",
    ],
    odds: 32,
    date: "2024-07-06 16:59",
  },
  {
    id: 2,
    image: "/assets/icons/gray_circle.svg",
    account: "소환사명1",
    manner_lev: 5,
    tierImg: 1,
    tier: "UR",
    main_position: 0,
    sub_position: 1,
    hope_position: 1,
    champion: [
      "/assets/icons/gray_circle.svg",
      "/assets/icons/gray_circle.svg",
      "/assets/icons/gray_circle.svg",
    ],
    odds: 97,
    date: "2024-07-06 01:39",
  },
  {
    id: 3,
    image: "/assets/icons/gray_circle.svg",
    account: "소환사명1",
    manner_lev: 5,
    tierImg: 2,
    tier: "UR",
    main_position: 0,
    sub_position: 1,
    hope_position: 1,
    champion: [
      "/assets/icons/gray_circle.svg",
      "/assets/icons/gray_circle.svg",
      "/assets/icons/gray_circle.svg",
    ],
    odds: 50,
    date: "2024-07-04 23:27",
  },
  {
    id: 4,
    image: "/assets/icons/gray_circle.svg",
    account: "소환사명1",
    manner_lev: 5,
    tierImg: 3,
    tier: "UR",
    main_position: 0,
    sub_position: 1,
    hope_position: 1,
    champion: [
      "/assets/icons/gray_circle.svg",
      "/assets/icons/gray_circle.svg",
      "/assets/icons/gray_circle.svg",
    ],
    odds: 32,
    date: "2024-05-19 03:27",
  },
  {
    id: 5,
    image: "/assets/icons/gray_circle.svg",
    account: "소환사명1",
    manner_lev: 5,
    tierImg: 4,
    tier: "UR",
    main_position: 0,
    sub_position: 1,
    hope_position: 1,
    champion: [
      "/assets/icons/gray_circle.svg",
      "/assets/icons/gray_circle.svg",
      "/assets/icons/gray_circle.svg",
    ],
    odds: 60,
    date: "2024-05-18 12:27",
  },
  {
    id: 6,
    image: "/assets/icons/gray_circle.svg",
    account: "소환사명1",
    manner_lev: 5,
    tierImg: 5,
    tier: "UR",
    main_position: 0,
    sub_position: 1,
    hope_position: 1,
    champion: [
      "/assets/icons/gray_circle.svg",
      "/assets/icons/gray_circle.svg",
      "/assets/icons/gray_circle.svg",
    ],
    odds: 32,
    date: "2024-04-04 23:27",
  },
];

const BoardPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  //TODO: itemsPerPage 추후 20개로 수정
  const itemsPerPage = 5;
  const pageButtonCount = 5;

  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = BOARD_CONTENT.slice(indexOfFirstPost, indexOfLastPost);

  const [isPosition, setIsPosition] = useState(0);
  const [micOn, setMicOn] = useState(true);

  const [isDropdownOpen1, setIsDropdownOpen1] = useState(false);
  const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);
  const [selectedDropOption1, setSelectedDropOption1] = useState("솔로 랭크");
  const [selectedDropOption2, setSelectedDropOption2] = useState("티어 선택");

  const dropdownRef1 = useRef<HTMLDivElement>(null);
  const dropdownRef2 = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  const isPostingModal = useSelector(
    (state: RootState) => state.modal.postingModal
  );

  const handleFirstDropValue = (value: string) => {
    console.log(value);
    setSelectedDropOption1(value);
    setIsDropdownOpen1(false);
  };

  const handleSecondDropValue = (value: string) => {
    console.log(value);
    setSelectedDropOption2(value);
    setIsDropdownOpen2(false);
  };

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
    dispatch(setOpenPostingModal());
  };

  const handleWritingClose = () => {
    dispatch(setClosePostingModal());
    dispatchEvent;
  };

  const handleDropdownClickOutside1 = (event: MouseEvent) => {
    if (
      dropdownRef1.current &&
      !dropdownRef1.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen1(false);
    }
  };

  const handleDropdownClickOutside2 = (event: MouseEvent) => {
    if (
      dropdownRef2.current &&
      !dropdownRef2.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen2(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleDropdownClickOutside1);
    document.addEventListener("mousedown", handleDropdownClickOutside2);
    return () => {
      document.removeEventListener("mousedown", handleDropdownClickOutside1);
      document.removeEventListener("mousedown", handleDropdownClickOutside2);
    };
  }, []);

  return (
    <>
      {isPostingModal && <PostBoard onClose={handleWritingClose} />}
      <Wrapper>
        <BoardContent>
          <FirstRow>
            <Title>게시판</Title>
            <RefreshImage
              src="/assets/icons/refresh.svg"
              width={30}
              height={27}
              alt="새로고침"
            />
          </FirstRow>
          <SecondRow>
            <FirstBlock>
              <Dropdown
                type="type1"
                width="138px"
                padding="18px 21px"
                list={DROP_DATA1}
                ref={dropdownRef1}
                open={isDropdownOpen1}
                setOpen={setIsDropdownOpen1}
                onDropValue={handleFirstDropValue}
                defaultValue={selectedDropOption1}
              />
              <Dropdown
                type="type1"
                width="138px"
                padding="18px 21px"
                list={DROP_DATA2}
                ref={dropdownRef2}
                open={isDropdownOpen2}
                setOpen={setIsDropdownOpen2}
                onDropValue={handleSecondDropValue}
                defaultValue={selectedDropOption2}
              />
              <PositionBox>
                <PositionFilter
                  onPositionFilter={handlePositionFilter}
                  isPosition={isPosition}
                />
              </PositionBox>
              <MicButton
                onClick={handleMic}
                className={micOn ? "clicked" : "unClicked"}
              >
                <Image
                  src={
                    micOn
                      ? "/assets/icons/availabled_mic.svg"
                      : "/assets/icons/unavailabled_mic.svg"
                  }
                  width={21}
                  height={26}
                  alt="마이크 버튼"
                />
              </MicButton>
            </FirstBlock>
            <SecondBlock>
              <Button
                onClick={handleWritingOpen}
                buttonType="primary"
                size="large"
                text="글 작성하기"
              />
            </SecondBlock>
          </SecondRow>
          <Main>
            <Table title={BOARD_TITLE} content={currentPosts} />
          </Main>
          <Pagination
            currentPage={currentPage}
            totalItems={BOARD_CONTENT.length}
            itemsPerPage={itemsPerPage}
            pageButtonCount={pageButtonCount}
            onPageChange={handlePageChange}
          />
          <Footer>
            <ChatBoxContent>
              <ChatButton count={3} />
            </ChatBoxContent>
          </Footer>
        </BoardContent>
      </Wrapper>
    </>
  );
};

export default BoardPage;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 140px;
`;

const BoardContent = styled.div`
  max-width: 1440px;
  width: 100%;
  padding: 0 80px;
`;

const FirstRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 38px;
`;

const Title = styled.p`
  ${(props) => props.theme.fonts.regular35};
  color: #44515c;
`;

const RefreshImage = styled(Image)`
  cursor: pointer;
`;

const SecondRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
`;

const FirstBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const PositionBox = styled.div`
  background: ${theme.colors.gray500};
  border-radius: 10px;
`;

const MicButton = styled.button`
  padding: 13px 17px;
  border-radius: 10px;
  &.clicked {
    background: ${theme.colors.purple100};
  }
  &.unClicked {
    background: ${theme.colors.gray300};
  }
`;

const SecondBlock = styled.div``;

const Main = styled.main`
  width: 100%;
  margin-bottom: 64px;
`;

const Footer = styled.footer`
  right: 80px;
  bottom: 78px;
  display: flex;
`;

const ChatBoxContent = styled.div`
  margin-left: auto;
`;

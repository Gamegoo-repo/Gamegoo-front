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
import { setClosePostingModal, setOpenModal, setOpenPostingModal } from "@/redux/slices/modalSlice";
import { getBoardList } from "@/api/board";
import { BoardList } from "@/interface/board";

const DROP_DATA1 = [
  { id: 1, value: '빠른대전' },
  { id: 2, value: '솔로랭크' },
  { id: 3, value: '자유랭크' },
  { id: 4, value: '칼바람 나락' },
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

const ITEMS_PER_PAGE = 20;

const BoardPage = () => {
  const [boardList, setBoardList] = useState<BoardList[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreItems, setHasMoreItems] = useState(true);

  const [isPosition, setIsPosition] = useState(1);
  const [micOn, setMicOn] = useState(true);

  const [isDropdownOpen1, setIsDropdownOpen1] = useState(false);
  const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);
  const [selectedFirstDropOption, setSelectedDropOption1] = useState(1);
  const [selectedSecondDropOption, setSelectedDropOption2] = useState(1);

  const dropdownRef1 = useRef<HTMLDivElement>(null);
  const dropdownRef2 = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  const isPostingModal = useSelector((state: RootState) => state.modal.postingModal);
  const isCompletedPosting = useSelector((state: RootState) => state.modal.modalType);
  
  // 첫번째 드롭
  const handleFirstDropValue = (id: number) => {
    setSelectedDropOption1(id);
    setIsDropdownOpen1(false);
  };

  // 두번째 드롭
  const handleSecondDropValue = (id: number) => {
    setSelectedDropOption2(id);
    setIsDropdownOpen2(false);
  };

  // 첫번째 드롭 외부 클릭
  const handleDropdownClickOutside1 = (event: MouseEvent) => {
    if (
      dropdownRef1.current &&
      !dropdownRef1.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen1(false);
    }
  };

  // 두번째 드롭 외부 클릭
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

  // 포지션 필터
  const handlePositionFilter = (id: number) => {
    setIsPosition(id);
  };

  // 마이크 여부
  const handleMic = () => {
    setMicOn((prevStatus) => !prevStatus);
  };

  // 글쓰기 모달 오픈
  const handlePostingOpen = () => {
    dispatch(setOpenPostingModal());
  };

  // 글쓰기 모달 닫기
  const handlePostingClose = () => {
    dispatch(setClosePostingModal());
  };

  // 게시글 목록
  useEffect(() => {
    const getList = async () => {

      const params = {
        pageIdx: currentPage
      };

      const data = await getBoardList(params);
      setBoardList(data.result);
      setHasMoreItems(data.result.length === ITEMS_PER_PAGE);
    };

    getList();
  }, [
    currentPage,
    selectedFirstDropOption,
    selectedSecondDropOption,
    isPosition,
    micOn,
    isCompletedPosting
  ]);

  // 페이지네이션 이전 클릭
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // 페이지네이션 다음 클릭
  const handleNextPage = () => {
    if (boardList.length === ITEMS_PER_PAGE) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // 페이지네이션 페이지 클릭
  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handleModalClose = () => {
    // 글쓰기 모달 닫기
    handlePostingClose();
    // 글쓰기 완료 모달 닫기
    dispatch(setOpenModal(""));
  };

  return (
    <>
      {isPostingModal &&
        <PostBoard
          onClose={handlePostingClose}
          onCompletedPosting={handleModalClose}
        />}
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
                defaultValue={selectedFirstDropOption}
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
                defaultValue={selectedSecondDropOption}
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
                onClick={handlePostingOpen}
                buttonType="primary"
                size="large"
                text="글 작성하기"
              />
            </SecondBlock>
          </SecondRow>
          <Main>
            <Table title={BOARD_TITLE} content={boardList} />
          </Main>
          <Pagination
            currentPage={currentPage}
            hasMoreItems={hasMoreItems}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
            onPageClick={handlePageClick}
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
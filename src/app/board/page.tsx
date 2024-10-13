"use client";

import styled from "styled-components";
import Image from "next/image";
import { theme } from "@/styles/theme";
import { useEffect, useRef, useState } from "react";
import { BOARD_TITLE, GAME_MODE, MIC, TIER } from "@/data/board";
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
  setOpenModal,
  setOpenPostingModal,
} from "@/redux/slices/modalSlice";
import { getBoardList } from "@/api/board";
import { BoardDetail } from "@/interface/board";
import Alert from "@/components/common/Alert";
import { useRouter } from "next/navigation";
import { clearCurrentPost, setPostStatus } from "@/redux/slices/postSlice";
import { mikeBooleanToId, tierStringToId } from "@/utils/custom";
import { resetBoardFilters } from "@/redux/slices/boardSlice";

const ITEMS_PER_PAGE = 20;
const BUTTONS_PER_PAGE = 5;

const BoardPage = () => {
  const [boardList, setBoardList] = useState<BoardDetail[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isPosition, setIsPosition] = useState(0);
  const [isGameModeDropdownOpen, setIsGameModeDropdownOpen] = useState(false);
  const [isTierDropdownOpen, setIsTierDropdownOpen] = useState(false);
  const [isMicDropdownOpen, setIsMicDropdownOpen] = useState(false);
  const [selectedGameMode, setSelectedGameMode] = useState<
    string | number | null
  >(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [selectedMic, setSelectedMic] = useState<boolean | string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const gameModeRef = useRef<HTMLDivElement>(null);
  const tierRef = useRef<HTMLDivElement>(null);
  const micRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const router = useRouter();

  const isPostingModal = useSelector(
    (state: RootState) => state.modal.postingModal
  );
  const isPostStatus = useSelector((state: RootState) => state.post.postStatus);
  const isUser = useSelector((state: RootState) => state.user);

  /* redux 필터 상태 가져오기 */
  const boardFilters = useSelector((state: RootState) => state.board);

  /* 게임모드 드롭 */
  const handleGameModeDropValue = (id: number | null) => {
    dispatch(resetBoardFilters());
    setSelectedGameMode(id);
    setIsGameModeDropdownOpen(false);
  };

  /* 티어 드롭 */
  const handleTierDropValue = (id: number | null) => {
    dispatch(resetBoardFilters());
    switch (id) {
      case 1:
        setSelectedTier("IRON");
        break;
      case 2:
        setSelectedTier("BRONZE");
        break;
      case 3:
        setSelectedTier("SILVER");
        break;
      case 4:
        setSelectedTier("GOLD");
        break;
      case 5:
        setSelectedTier("PLATINUM");
        break;
      case 6:
        setSelectedTier("EMERALD");
        break;
      case 7:
        setSelectedTier("DIAMOND");
        break;
      case 8:
        setSelectedTier("MASTER");
        break;
      case 9:
        setSelectedTier("GRANDMASTER");
        break;
      case 10:
        setSelectedTier("CHALLENGER");
        break;
      default:
        setSelectedTier(null);
        break;
    }

    setIsTierDropdownOpen(false);
  };

  // useEffect(() => {
  //   if (boardFilters) {
  //     console.log(boardFilters);
  //     setSelectedGameMode(boardFilters.mode || "솔로 랭크");
  //     setSelectedTier(boardFilters.tier || "티어 선택");
  //     setIsPosition(boardFilters.mainPosition || 0);
  //     setSelectedMic(boardFilters.mike || "음성 채팅");
  //   }
  // }, [boardFilters]);

  /* 게임모드 드롭박스 외부 클릭 */
  const handleGameModeDropdownClickOutside = (event: MouseEvent) => {
    if (
      gameModeRef.current &&
      !gameModeRef.current.contains(event.target as Node)
    ) {
      setIsGameModeDropdownOpen(false);
    }
  };

  /* 티어 드롭박스 외부 클릭 */
  const handleTierDropdownClickOutside = (event: MouseEvent) => {
    if (tierRef.current && !tierRef.current.contains(event.target as Node)) {
      setIsTierDropdownOpen(false);
    }
  };

  /* 마이크 드롭박스 외부 클릭 */
  const handleMicDropdownClickOutside = (event: MouseEvent) => {
    if (micRef.current && !micRef.current.contains(event.target as Node)) {
      setIsMicDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleGameModeDropdownClickOutside);
    document.addEventListener("mousedown", handleTierDropdownClickOutside);
    document.addEventListener("mousedown", handleMicDropdownClickOutside);
    return () => {
      document.removeEventListener(
        "mousedown",
        handleGameModeDropdownClickOutside
      );
      document.removeEventListener("mousedown", handleTierDropdownClickOutside);
      document.removeEventListener("mousedown", handleMicDropdownClickOutside);
    };
  }, []);

  /* 포지션 필터 */
  const handlePositionFilter = (id: number) => {
    dispatch(resetBoardFilters());
    setIsPosition(id);
  };

  /* 마이크 드롭 */
  const handleMicDropValue = (id: number | null) => {
    dispatch(resetBoardFilters());
    switch (id) {
      case 1:
        setSelectedMic(true);
        break;
      case 2:
        setSelectedMic(false);
        break;
      default:
        setSelectedMic(null);
        break;
    }

    setIsMicDropdownOpen(false);
  };

  /* 글쓰기 모달 오픈 */
  const handlePostingOpen = () => {
    if (!isUser.gameName) {
      return setShowAlert(true);
    }

    dispatch(setOpenPostingModal());
  };

  /* 글쓰기 모달 닫기 */
  const handlePostingClose = () => {
    dispatch(setClosePostingModal());
  };

  /* 게시글 목록 */
  const getList = async () => {
    const params = {
      pageIdx: currentPage,
      mode:
        boardFilters.mode && boardFilters.mode !== null
          ? boardFilters.mode
          : selectedGameMode,
      tier:
        boardFilters.tier && boardFilters.tier !== null
          ? boardFilters.tier
          : selectedTier,
      mainPosition: boardFilters.mainPosition || isPosition,
      mike:
        boardFilters.mike && boardFilters.mike !== null
          ? boardFilters.mike
          : selectedMic,
    };

    console.log("params", params);

    try {
      const data = await getBoardList(params);
      if (data.isSuccess) {
        setBoardList(data.result.boards);
        setTotalPage(data.result.totalPage);
        setTotalItems(data.result.totalCount);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getList();
  }, [
    currentPage,
    selectedGameMode,
    selectedTier,
    isPosition,
    selectedMic,
    isPostStatus,
    refresh,
  ]);

  /* 페이지네이션 이전 클릭 */
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  /* 페이지네이션 다음 클릭 */
  const handleNextPage = () => {
    if (boardList.length === ITEMS_PER_PAGE) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  /* 페이지네이션 페이지 클릭 */
  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handleModalClose = () => {
    /* 글쓰기 모달 닫기 */
    handlePostingClose();
    /* 글쓰기 수정/완료 모달 닫기 */
    dispatch(setOpenModal(""));
    dispatch(setPostStatus(""));
    dispatch(clearCurrentPost());
  };

  const handleRefresh = () => {
    setRefresh((prevStatus) => !prevStatus);
  };

  return (
    <>
      {showAlert && (
        <Alert
          icon="exclamation"
          width={68}
          height={58}
          content="로그아웃 되었습니다. 다시 로그인 해주세요."
          alt="로그인 필요"
          onClose={() => router.push("/login")}
          buttonText="로그인하기"
        />
      )}
      {isPostingModal && (
        <PostBoard
          onClose={handlePostingClose}
          onCompletedPostingClose={handleModalClose}
        />
      )}
      {boardList && (
        <Wrapper>
          <BoardContent>
            <FirstRow>
              <Title>게시판</Title>
              <RefreshImage
                onClick={handleRefresh}
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
                  width="170px"
                  padding="18px 21px"
                  list={GAME_MODE}
                  ref={gameModeRef}
                  open={isGameModeDropdownOpen}
                  setOpen={setIsGameModeDropdownOpen}
                  onDropValue={handleGameModeDropValue}
                  defaultValue={boardFilters.mode || selectedGameMode}
                />
                <Dropdown
                  type="type1"
                  width="150px"
                  padding="18px 21px"
                  list={TIER}
                  ref={tierRef}
                  open={isTierDropdownOpen}
                  setOpen={setIsTierDropdownOpen}
                  onDropValue={handleTierDropValue}
                  defaultValue={
                    tierStringToId(boardFilters.tier) || selectedTier
                  }
                />
                <PositionBox>
                  <PositionFilter
                    onPositionFilter={handlePositionFilter}
                    isPosition={isPosition}
                    // isPosition={boardFilters.mainPosition || isPosition}
                  />
                </PositionBox>
                <Dropdown
                  type="type1"
                  width="138px"
                  padding="18px 21px"
                  list={MIC}
                  ref={micRef}
                  open={isMicDropdownOpen}
                  setOpen={setIsMicDropdownOpen}
                  onDropValue={handleMicDropValue}
                  // defaultValue={2}
                  defaultValue={
                    mikeBooleanToId(boardFilters.mike) || selectedMic
                  }
                />
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
            {boardList?.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                totalPage={totalPage}
                itemsPerPage={ITEMS_PER_PAGE}
                pageButtonCount={BUTTONS_PER_PAGE}
                hasMoreItems={currentPage < totalPage}
                onPrevPage={handlePrevPage}
                onNextPage={handleNextPage}
                onPageClick={handlePageClick}
              />
            )}
            <Footer>
              <ChatBoxContent>
                <ChatButton />
              </ChatBoxContent>
            </Footer>
          </BoardContent>
        </Wrapper>
      )}
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

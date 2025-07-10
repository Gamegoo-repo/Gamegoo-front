"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import styled from "styled-components";

import { getBoardList, getBoardListCursor, getMyPost, pullUpPost } from "@/api";
import {
  Alert,
  Button,
  ConfirmModal,
  Dropdown,
  Pagination,
  PositionFilter,
  PostBoard,
  PostList,
  Table,
} from "@/components";
import { BOARD_TITLE, GAME_MODE, MIC, TIER } from "@/constants";
import { notify, useMediaQueries } from "@/hooks";
import { resetBoardFilters, setRefresh } from "@/redux/slices/boardSlice";
import {
  setClosePostingModal,
  setOpenModal,
  setOpenPostingModal,
} from "@/redux/slices/modalSlice";
import { clearCurrentPost, setPostStatus } from "@/redux/slices/postSlice";
import { rotate } from "@/styles/animation";
import { theme } from "@/styles/theme";
import { mikeBooleanToId, tierStringToId } from "@/utils";

import type { RootState } from "@/redux/store";
import type { BoardListDetail, GameMode, Mike, Position } from "@/types";

const ITEMS_PER_PAGE = 20;
const BUTTONS_PER_PAGE = 5;

const BoardPage = () => {
  const dispatch = useDispatch();
  const [boardList, setBoardList] = useState<BoardListDetail[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isPosition, setIsPosition] = useState<Position>("ANY");
  const [isGameModeDropdownOpen, setIsGameModeDropdownOpen] = useState(false);
  const [isTierDropdownOpen, setIsTierDropdownOpen] = useState(false);
  const [isMicDropdownOpen, setIsMicDropdownOpen] = useState(false);
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode | null>(
    null
  );
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [selectedMic, setSelectedMic] = useState<Mike | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 게시판 글 새로고침
  const boardRefresh = useSelector((state: RootState) => state.board.refresh);

  const gameModeRef = useRef<HTMLDivElement>(null);
  const tierRef = useRef<HTMLDivElement>(null);
  const micRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(false);
  const isMobile = useMediaQueries({ breakpoint: 700 });

  const [isPullUpConfirmOpen, setIsPullUpConfirmOpen] = useState(false);
  const [myRecentPost, setMyRecentPost] = useState<number | null>(null);

  const isPostingModal = useSelector(
    (state: RootState) => state.modal.postingModal
  );
  const isPostStatus = useSelector((state: RootState) => state.post.postStatus);
  const isUser = useSelector((state: RootState) => state.user);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const sentinelRef = useRef(null);

  /* redux 필터 상태 가져오기 */
  const boardFilters = useSelector((state: RootState) => state.board);

  /* 게임모드 드롭 */
  const handleGameModeDropValue = (id: number | null) => {
    dispatch(resetBoardFilters());

    const selectedGameModeObj = GAME_MODE.find(
      (gameMode) => gameMode.id === id
    );
    setSelectedGameMode(selectedGameModeObj ? selectedGameModeObj.key : null);
    setIsGameModeDropdownOpen(false);
  };

  /* 티어 드롭 */
  const handleTierDropValue = (id: number | null) => {
    dispatch(resetBoardFilters());

    const selectedTierObj = TIER.find((tier) => tier.id === id);
    setSelectedTier(selectedTierObj ? selectedTierObj.key : null);
    setIsTierDropdownOpen(false);
  };

  /* 마이크 드롭 */
  const handleMicDropValue = (id: number | null) => {
    dispatch(resetBoardFilters());

    const selectedMicObj = MIC.find((mic) => mic.id === id);
    setSelectedMic(selectedMicObj ? selectedMicObj.key : null);
    setIsMicDropdownOpen(false);
  };

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
  const handlePositionFilter = (id: Position) => {
    dispatch(resetBoardFilters());
    setIsPosition(id);
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
      page: currentPage,
      gameMode:
        boardFilters.gameMode && boardFilters.gameMode !== null
          ? boardFilters.gameMode
          : selectedGameMode,
      tier:
        boardFilters.tier && boardFilters.tier !== null
          ? boardFilters.tier
          : selectedTier,
      mainP: isPosition,
      mike:
        boardFilters.mike && boardFilters.mike !== null
          ? boardFilters.mike
          : selectedMic,
    };

    setIsLoading(true);
    try {
      const data = await getBoardList(params);
      if (data.status === 200) {
        if (data.data.boards) {
          setBoardList(data.data.boards);
        }
        setTotalPage(data.data.totalPages);
        setTotalItems(data.data.totalCount);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  /* 게시글 목록 조회 init (커서 기반) */
  const getInitialListByCursor = async () => {
    if (isLoading) return;
    const params = {
      cursor: null,
      cursorId: null,
      gameMode:
        boardFilters.gameMode && boardFilters.gameMode !== null
          ? boardFilters.gameMode
          : selectedGameMode,
      tier:
        boardFilters.tier && boardFilters.tier !== null
          ? boardFilters.tier
          : selectedTier,
      position1: isPosition,
    };

    setIsLoading(true);
    try {
      const data = await getBoardListCursor(params);
      if (data.status === 200) {
        if (data.data.boards) {
          setBoardList(data.data.boards);
        }
        setCursor(data.data.nextCursor);
        setHasNext(data.data.hasNext);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  /* 게시글 목록 조회 (커서 기반) */
  const getListByCursor = async (cursor: string | null) => {
    if (isLoading || !hasNext) return;
    const params = {
      cursor,
      cursorId: null,
      gameMode:
        boardFilters.gameMode && boardFilters.gameMode !== null
          ? boardFilters.gameMode
          : selectedGameMode,
      tier:
        boardFilters.tier && boardFilters.tier !== null
          ? boardFilters.tier
          : selectedTier,
      position1: isPosition,
    };

    setIsLoading(true);
    try {
      const data = await getBoardListCursor(params);
      if (data.status === 200) {
        if (data.data.boards) {
          setBoardList((prevBoardList) => [
            ...prevBoardList,
            ...data.data.boards,
          ]);
        }
        setCursor(data.data.nextCursor);
        setHasNext(data.data.hasNext);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(
    () => {
      if (isMobile === undefined) return;
      console.log("boardRefresh", boardRefresh);

      if (isMobile) {
        getInitialListByCursor();
      } else {
        getList();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      currentPage,
      selectedGameMode,
      selectedTier,
      isPosition,
      selectedMic,
      isPostStatus,
      boardRefresh,
      isMobile,
    ]
  );

  /* mobile 무한스크롤 페이지네이션 */
  useEffect(
    () => {
      if (!isMobile || !cursor) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && hasNext && !isLoading) {
              getListByCursor(cursor);
            }
          });
        },
        {
          rootMargin: "100px", // 미리 로드
        }
      );

      if (sentinelRef.current) {
        observer.observe(sentinelRef.current);
      }

      return () => {
        observer.disconnect();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cursor, isMobile, hasNext, isLoading]
  );

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
    setIsRotating(true);
    dispatch(setRefresh());

    setTimeout(() => {
      setIsRotating(false);
    }, 1000);
  };

  /* 게시글 끌어올리기 */
  const handlePullUp = async () => {
    // 내가 쓴 글로부터 최신글 정보 조회
    const myPost = await getMyPost(1);
    if (myPost.data.totalCount > 0) {
      setMyRecentPost(myPost.data.myBoards[0].boardId);
      setIsPullUpConfirmOpen(true);
    } else {
      notify({ text: "작성한 글이 없어요", icon: "🚫", type: "error" });
    }
  };

  const handlePullUpAction = async () => {
    // 게시판 끌어올리기 API
    await setIsPullUpConfirmOpen(false);
    if (myRecentPost) {
      await pullUpPost(myRecentPost);
      await dispatch(setRefresh());
    }
    await notify({
      text: "끌어올리기가 완료되었습니다",
      icon: "👌🏼",
      type: "success",
    });
  };

  return (
    <>
      {showAlert && (
        <Alert
          icon="exclamation"
          width={68}
          height={58}
          content="로그인이 필요한 서비스입니다."
          alt="로그인 필요"
          onClose={() => setShowAlert(false)}
          buttonText="확인"
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
            {!isMobile ? (
              <>
                {/* PC */}
                <FirstRow>
                  <Title>게시판</Title>
                  <RefreshButton onClick={handleRefresh}>
                    <RefreshImage
                      onClick={handleRefresh}
                      src="/assets/icons/redo.svg"
                      width={20}
                      height={20}
                      alt="새로고침"
                      $isrotating={isRotating}
                    />
                  </RefreshButton>
                </FirstRow>
                <SecondRow>
                  <FirstBlock>
                    <Dropdown
                      type="type1"
                      width="138px"
                      padding="18px 21px"
                      list={GAME_MODE}
                      ref={gameModeRef}
                      open={isGameModeDropdownOpen}
                      setOpen={setIsGameModeDropdownOpen}
                      onDropValue={handleGameModeDropValue}
                      defaultValue={boardFilters.gameMode || selectedGameMode}
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
                    <PositionBox>
                      <PositionFilter
                        onPositionFilter={handlePositionFilter}
                        isPosition={isPosition}
                        // isPosition={boardFilters.mainPosition || isPosition}
                      />
                    </PositionBox>
                  </FirstBlock>
                  <SecondBlock>
                    {boardList?.length > 0 && isUser?.id ? (
                      <PullUpButton onClick={handlePullUp}>
                        <Image
                          src="/assets/icons/chevron_double_up.svg"
                          width={15}
                          height={15}
                          alt=""
                        />
                        최근 글 끌어올리기
                      </PullUpButton>
                    ) : null}
                    <Button
                      onClick={handlePostingOpen}
                      buttonType="primary"
                      size="large"
                      text="글 작성하기"
                      borderRadius="12px"
                      width="248px"
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
              </>
            ) : (
              <>
                {/* MOBILE */}
                <FirstRow>
                  <Title>게시판</Title>

                  <FirstRowRight>
                    {boardList?.length > 0 && isUser?.id ? (
                      <PullUpButton onClick={handlePullUp}>
                        <Image
                          src={"/assets/icons/chevron_double_up_white.svg"}
                          width={15}
                          height={15}
                          alt=""
                        />
                      </PullUpButton>
                    ) : null}

                    <Button
                      width="104px"
                      height="38px"
                      onClick={handlePostingOpen}
                      buttonType="primary"
                      size="large"
                      text="글 작성하기"
                    />
                  </FirstRowRight>
                </FirstRow>
                <SecondRow>
                  <PositionBox>
                    <PositionFilter
                      onPositionFilter={handlePositionFilter}
                      isPosition={isPosition}
                      // isPosition={boardFilters.mainPosition || isPosition}
                    />
                  </PositionBox>
                  <RefreshImageWrap>
                    <RefreshImage
                      onClick={handleRefresh}
                      src="/assets/icons/redo.svg"
                      width={20}
                      height={20}
                      alt="새로고침"
                      $isrotating={isRotating}
                    />
                  </RefreshImageWrap>
                </SecondRow>
                <ThirdRow>
                  <Dropdown
                    type="type1"
                    width="114px"
                    padding="8px 8px 8px 12px"
                    list={GAME_MODE}
                    ref={gameModeRef}
                    open={isGameModeDropdownOpen}
                    setOpen={setIsGameModeDropdownOpen}
                    onDropValue={handleGameModeDropValue}
                    defaultValue={boardFilters.gameMode || selectedGameMode}
                  />
                  <Dropdown
                    type="type1"
                    width="100px"
                    padding="8px 8px 8px 12px"
                    list={TIER}
                    ref={tierRef}
                    open={isTierDropdownOpen}
                    setOpen={setIsTierDropdownOpen}
                    onDropValue={handleTierDropValue}
                    defaultValue={
                      tierStringToId(boardFilters.tier) || selectedTier
                    }
                  />
                  <Dropdown
                    type="type1"
                    width="89px"
                    padding="8px 8px 8px 12px"
                    list={MIC}
                    ref={micRef}
                    open={isMicDropdownOpen}
                    setOpen={setIsMicDropdownOpen}
                    onDropValue={handleMicDropValue}
                    defaultValue={
                      mikeBooleanToId(boardFilters.mike) || selectedMic
                    }
                  />
                </ThirdRow>
                <Main>
                  <PostList content={boardList}></PostList>
                </Main>
                <div ref={sentinelRef}></div>
                {/* IntersectionObserver 를 위한 감지용 element */}
              </>
            )}
          </BoardContent>
        </Wrapper>
      )}
      {/* 끌어올리기 확인 팝업 */}
      {isPullUpConfirmOpen && (
        <ConfirmModal
          width="540px"
          primaryButtonText="아니요"
          secondaryButtonText="예"
          onPrimaryClick={() => {
            setMyRecentPost(null);
            setIsPullUpConfirmOpen(false);
          }}
          onSecondaryClick={handlePullUpAction}
        >
          <MsgConfirm>{`최근 게시글을 끌어올리시겠습니까?`}</MsgConfirm>
        </ConfirmModal>
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
  @media (max-width: 700px) {
    padding-top: 12px;
  }
`;

const BoardContent = styled.div`
  max-width: 1440px;
  width: 100%;
  padding: 0 80px;
  @media (max-width: 700px) {
    padding: 0 20px;
  }
`;

const FirstRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 38px;
  @media (max-width: 700px) {
    margin-bottom: 12px;
  }
`;

const Title = styled.p`
  color: ${theme.colors.gray700};
  ${theme.fonts.bold32};
  @media (max-width: 700px) {
    ${theme.fonts.bold20};
  }
`;

const FirstRowRight = styled.div`
  display: flex;
  gap: 8px;
`;

const RefreshButton = styled.button`
  width: 44px;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${theme.colors.violet200};
  background: ${theme.colors.violet100};
`;

const RefreshImageWrap = styled.button`
  position: relative;
  width: 44px;
  height: 44px;
  background: ${theme.colors.violet100};
  border-radius: 8px;
  border: 1px solid ${theme.colors.violet200};
`;

// const RefreshImage = styled(Image)<RefreshImageProps>`
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   /* cursor: pointer; */
//   /* animation: ${(props) =>
//     props.$isrotating ? rotate : "none"} 1s linear; */
const RefreshImage = styled(Image)<{ $isrotating: boolean }>`
  cursor: pointer;
  animation: ${(props) => (props.$isrotating ? rotate : "none")} 1s linear;
`;

const SecondRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
  gap: 30px;
  @media (max-width: 700px) {
    margin-bottom: 8px;
    gap: 0px;
  }
`;

const ThirdRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

const FirstBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const PositionBox = styled.div`
  background: ${theme.colors.gray200};
  border-radius: 10px;
`;

const SecondBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const PullUpButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4.5px;
  background: ${theme.colors.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  white-space: nowrap;
  ${theme.fonts.bold14};
  @media (max-width: 700px) {
    justify-content: center;
    background: ${theme.colors.gradientMobile};
    width: 38px;
    height: 38px;
    border-radius: 6px;
  }
`;

const Main = styled.main`
  width: 100%;
  margin-bottom: 64px;
`;

const MsgConfirm = styled.div`
  text-align: center;
  color: ${theme.colors.gray800};
  ${(props) => props.theme.fonts.regular25};
  margin: 80px 0;

  @media (max-width: 700px) {
    ${(props) => props.theme.fonts.medium14};
    margin: 32px 0;
  }
`;

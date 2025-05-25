"use client";

import styled from "styled-components";
import Image, { ImageProps } from "next/image";
import { theme } from "@/styles/theme";
import { useEffect, useRef, useState } from "react";
import { BOARD_TITLE, GAME_MODE, MIC, TIER } from "@/constants/board";
import Button from "@/components/common/Button";
import Dropdown from "@/components/common/Dropdown";
import Table from "@/components/board/Table";
import Pagination from "@/components/common/Pagination";
import PositionFilter from "@/components/board/PositionFilter";
import PostBoard from "@/components/createBoard/PostBoard";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  setClosePostingModal,
  setOpenModal,
  setOpenPostingModal,
} from "@/redux/slices/modalSlice";
import { getBoardList } from "@/api/board/board";
import { BoardListDetail } from "@/interface/board";
import Alert from "@/components/common/Alert";
import { useRouter } from "next/navigation";
import { clearCurrentPost, setPostStatus } from "@/redux/slices/postSlice";
import { mikeBooleanToId, tierStringToId } from "@/utils/custom";
import { resetBoardFilters } from "@/redux/slices/boardSlice";
import { rotate } from "@/styles/animation";
import { Position } from "@/types/position/position";
import { Mike } from "@/types/user/mike";
import { GameMode } from "@/types/game/gameMode";
import useMediaQueries from "@/hooks/useMediaQueries";
import MoPost from "@/components/board/MoPost";

const ITEMS_PER_PAGE = 20;
const BUTTONS_PER_PAGE = 5;

const BoardPage = () => {
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
  const [refresh, setRefresh] = useState(false);

  const gameModeRef = useRef<HTMLDivElement>(null);
  const tierRef = useRef<HTMLDivElement>(null);
  const micRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(false);
  const isMobile = useMediaQueries({ breakpoint: 700 });

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

    try {
      const data = await getBoardList(params);
      if (data.status === 200) {
        if (data.data.boards) {
          setBoardList(data.data.boards);
        }
        setTotalPage(data.data.totalPage);
        setTotalItems(data.data.totalCount);
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
    setIsRotating(true);
    setRefresh((prevStatus) => !prevStatus);

    setTimeout(() => {
      setIsRotating(false);
    }, 1000);
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
                  <RefreshImageWrap>
                    <RefreshImage
                      onClick={handleRefresh}
                      src="/assets/icons/refresh.svg"
                      width={20}
                      height={20}
                      alt="새로고침"
                      $isrotating={isRotating}
                    />
                  </RefreshImageWrap>
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
                      />
                    </PositionBox>
                  </FirstBlock>
                  <SecondBlock>
                    <Button
                      width="248px"
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
              </>
            ) : (
              <>
                {/* MOBILE */}
                <FirstRow>
                  <Title>게시판</Title>
                  <Button
                    width="104px"
                    onClick={handlePostingOpen}
                    buttonType="primary"
                    size="large"
                    text="글 작성하기"
                  />
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
                      src="/assets/icons/refresh.svg"
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
                    width="89px"
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

                {boardList?.length > 0 ? (
                  <MoPostList>
                    {boardList.map((item, index) => (
                      <MoPost
                        key={item.boardId}
                        boardId={item.boardId}
                        tag={item.tag}
                        memberId={item.memberId}
                        profileImage={item.profileImage}
                        gameName={item.gameName}
                        tier={item.tier || ""}
                        contents={item.contents}
                        createdAt={item.createdAt}
                        mainP={item.mainP}
                        subP={item.subP}
                        wantP={item.wantP}
                        winRate={item.winRate}
                      />
                    ))}
                  </MoPostList>
                ) : (
                  <NoData>게시된 글이 없습니다.</NoData>
                )}
              </>
            )}
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

interface RefreshImageProps extends ImageProps {
  $isrotating: boolean;
}

const RefreshImageWrap = styled.button`
  position: relative;
  width: 44px;
  height: 44px;
  background: ${theme.colors.violet100};
  border-radius: 8px;
  border: 1px solid ${theme.colors.violet200};
`;

const RefreshImage = styled(Image)<RefreshImageProps>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* cursor: pointer; */
  /* animation: ${(props) =>
    props.$isrotating ? rotate : "none"} 1s linear; */
`;

const SecondRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
  @media (max-width: 700px) {
    margin-bottom: 8px;
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

const SecondBlock = styled.div``;

const Main = styled.main`
  width: 100%;
  margin-bottom: 64px;
`;

const MoPostList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 60px;
  gap: 16px;
`;

const NoData = styled.div`
  width: 100%;
  margin: 40px 0 300px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${theme.colors.gray700};
  ${theme.fonts.regular14}
`;

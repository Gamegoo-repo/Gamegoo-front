"use client";

import styled from "styled-components";
import Image from "next/image";
import { theme } from "@/styles/theme";
import { useEffect, useRef, useState } from "react";
import { BOARD_TITLE, GAME_MODE, TIER } from "@/data/board";
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
import { BoardList } from "@/interface/board";
import { getUserInfo } from "@/api/member";
import { UserInfo } from "@/interface/profile";
import Alert from "@/components/common/Alert";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 20;

const BoardPage = () => {
  const [boardList, setBoardList] = useState<BoardList[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [isPosition, setIsPosition] = useState(0);
  const [micStatus, setMicStatus] = useState(true);
  const [isGameModeDropdownOpen, setIsGameModeDropdownOpen] = useState(false);
  const [isTierDropdownOpen, setIsTierDropdownOpen] = useState(false);
  const [selectedGameMode, setSelectedGameMode] = useState<
    string | number | null
  >("솔로 랭크");
  const [selectedTier, setSelectedTier] = useState<string | null>("티어 선택");
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [showAlert, setShowAlert] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const gameModeRef = useRef<HTMLDivElement>(null);
  const tierRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const router = useRouter();

  const isPostingModal = useSelector(
    (state: RootState) => state.modal.postingModal
  );
  const isCompletedPosting = useSelector(
    (state: RootState) => state.modal.modalType
  );

  // 게임모드 드롭
  const handleGameModeDropValue = (id: number | null) => {
    setSelectedGameMode(id);
    setIsGameModeDropdownOpen(false);
  };

  // 티어 드롭
  const handleTierDropValue = (id: number | null) => {
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

  // 첫번째 드롭 외부 클릭
  const handleGameModeDropdownClickOutside = (event: MouseEvent) => {
    if (
      gameModeRef.current &&
      !gameModeRef.current.contains(event.target as Node)
    ) {
      setIsGameModeDropdownOpen(false);
    }
  };

  // 두번째 드롭 외부 클릭
  const handleTierDropdownClickOutside = (event: MouseEvent) => {
    if (tierRef.current && !tierRef.current.contains(event.target as Node)) {
      setIsTierDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleGameModeDropdownClickOutside);
    document.addEventListener("mousedown", handleTierDropdownClickOutside);
    return () => {
      document.removeEventListener(
        "mousedown",
        handleGameModeDropdownClickOutside
      );
      document.removeEventListener("mousedown", handleTierDropdownClickOutside);
    };
  }, []);

  /* 포지션 필터 */
  const handlePositionFilter = (id: number) => {
    setIsPosition(id);
  };

  /* 마이크 여부 */
  const handleMic = () => {
    setMicStatus((prevStatus) => !prevStatus);
  };

  /* 글쓰기 모달 오픈 */
  const handlePostingOpen = () => {
    if (!userInfo) {
      return setShowAlert(true);
    }
    dispatch(setOpenPostingModal());
  };

  /* 글쓰기 모달 닫기 */
  const handlePostingClose = () => {
    dispatch(setClosePostingModal());
  };

  /* 게시글 목록 */
  useEffect(() => {
    const getList = async () => {
      const params = {
        pageIdx: currentPage,
        mode:
          selectedGameMode === "솔로 랭크"
            ? setSelectedGameMode(null)
            : selectedGameMode,
        tier:
          selectedTier === "티어 선택" ? setSelectedTier(null) : selectedTier,
        mainPosition: isPosition,
        mike: micStatus,
      };

      const data = await getBoardList(params);
      setBoardList(data.result);
      setHasMoreItems(data.result.length === ITEMS_PER_PAGE);
    };

    getList();
  }, [
    currentPage,
    selectedGameMode,
    selectedTier,
    isPosition,
    micStatus,
    isCompletedPosting,
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
    /* 글쓰기 완료 모달 닫기 */
    dispatch(setOpenModal(""));
  };

  /* 유저 정보 api */
  useEffect(() => {
    const getUserData = async () => {
      const data = await getUserInfo();
      await setUserInfo(data);
    };

    getUserData();
  }, []);

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
        />
      )}
      {isPostingModal && (
        <PostBoard
          onClose={handlePostingClose}
          onCompletedPosting={handleModalClose}
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
                  width="138px"
                  padding="18px 21px"
                  list={GAME_MODE}
                  ref={gameModeRef}
                  open={isGameModeDropdownOpen}
                  setOpen={setIsGameModeDropdownOpen}
                  onDropValue={handleGameModeDropValue}
                  defaultValue={selectedGameMode}
                />
                <Dropdown
                  type="type1"
                  width="138px"
                  padding="18px 21px"
                  list={TIER}
                  ref={tierRef}
                  open={isTierDropdownOpen}
                  setOpen={setIsTierDropdownOpen}
                  onDropValue={handleTierDropValue}
                  defaultValue={selectedTier}
                />
                <PositionBox>
                  <PositionFilter
                    onPositionFilter={handlePositionFilter}
                    isPosition={isPosition}
                  />
                </PositionBox>
                <MicButton
                  onClick={handleMic}
                  className={micStatus ? "clicked" : "unClicked"}
                >
                  <Image
                    src={
                      micStatus
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
              {boardList?.length > 0 ? (
                <Table title={BOARD_TITLE} content={boardList} />
              ) : (
                <p>데이터가 없습니다.</p>
              )}
            </Main>
            {boardList?.length > 0 && (
              <Pagination
                currentPage={currentPage}
                hasMoreItems={hasMoreItems}
                onPrevPage={handlePrevPage}
                onNextPage={handleNextPage}
                onPageClick={handlePageClick}
              />
            )}
            <Footer>
              <ChatBoxContent>
                <ChatButton user={userInfo} count={3} />
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

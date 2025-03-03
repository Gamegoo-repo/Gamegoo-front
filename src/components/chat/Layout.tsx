import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  closeChat,
  closeChatRoom,
  openChatRoom,
  setChatRoomUuid,
} from "@/redux/slices/chatSlice";
import SearchBar from "./SearchBar";
import ChatRoomList from "./ChatRoomList";
import { RootState } from "@/redux/store";
import ChatLayout from "./ChatLayout";
import { ChatroomList } from "@/interface/chat";
import { Mannerstatus } from "@/interface/manner";
import {
  editManners,
  getBadMannerValues,
  getMannerValues,
  postBadMannerValue,
  postMannerValue,
} from "@/api/manner/manner";
import ConfirmModal from "../common/ConfirmModal";
import { leaveChatroom } from "@/api/chat/chat";
import { setCloseModal, setOpenModal } from "@/redux/slices/modalSlice";
import { socket } from "@/socket";
import { BAD_MANNER_TYPES, MANNER_TYPES } from "@/constants/mannerLevel";
import Button from "../common/Button";
import FormModal from "../common/FormModal";
import Checkbox from "../common/Checkbox";
import Input from "../common/Input";
import { REPORT_REASON } from "@/constants/report";
import { reportMember } from "@/api/report/report";
import { notify } from "@/hooks/notify";
import { FriendList } from "@/types/friend/friendList";
import { getFriendsList } from "@/api/friend/get";
import ChatFriendList from "./ChatFriendList";
import { patchFriendStar } from "@/api/friend/star";
import { blockMember } from "@/api/block/block";
import Tabs from "./Tabs";
import { resetPosition, setPosition } from "@/redux/slices/chatPositionSlice";
import { getAccessToken } from "@/utils/storage";

const Layout = () => {
  const dispatch = useDispatch();
  /* 채팅창 위치 관련 상태 */
  const position = useSelector((state: RootState) => state.chatPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const [activeTab, setActiveTab] = useState(0);
  const [friends, setFriends] = useState<FriendList[]>([]);
  const [favoriteFriends, setFavoriteFriends] = useState<FriendList[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const tabs = ["친구 목록", "대화방"];
  const [isMoreBoxOpen, setIsMoreBoxOpen] = useState<number | null>(null);
  const [isUuid, setIsUuid] = useState("");
  const [selectedChatroom, setSelectedChatroom] = useState<ChatroomList | null>(
    null
  );
  const [checkedReportItems, setCheckedReportItems] = useState<number[]>([]);
  const [checkedMannerItems, setCheckedMannerItems] = useState<number[]>([]);
  const [checkedBadMannerItems, setCheckedBadMannerItems] = useState<number[]>(
    []
  );
  const [reportDetail, setReportDetail] = useState<string>("");
  const [isMannerValue, setIsMannerValue] = useState<Mannerstatus>();
  const [isBadMannerValue, setIsBadMannerValue] = useState<Mannerstatus>();
  const [isEditMode, setIsEditMode] = useState(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isChatRoomOpen = useSelector(
    (state: RootState) => state.chat.isChatRoomOpen
  );
  const isChatUuid = useSelector(
    (state: RootState) => state.chat.isChatRoomUuid
  );
  const isModalType = useSelector((state: RootState) => state.modal.modalType);

  /* 채팅창 위치 관련 함수 */
  // 드래그 시작
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const overlay = e.currentTarget.parentElement;
    if (overlay) {
      const rect = overlay.getBoundingClientRect();
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  // 드래그 이동
  const handleDrag = (e: MouseEvent) => {
    if (!isDragging) return;

    const left = `${e.clientX - offset.x}px`;
    const top = `${e.clientY - offset.y}px`;
    const adjustedPosition = adjustPosition({ top, left });
    setPosition(adjustedPosition);

    dispatch(setPosition(adjustedPosition));
  };

  // 드래그 종료
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // 경계 제한 로직
  const adjustPosition = ({ top, left }: { top: string; left: string }) => {
    const overlayWidth = 420;
    const overlayHeight = 687;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let topValue = parseInt(top, 10);
    let leftValue = parseInt(left, 10);

    if (topValue < 0) topValue = 0;
    if (topValue + overlayHeight > viewportHeight)
      topValue = viewportHeight - overlayHeight;

    if (leftValue < 0) leftValue = 0;
    if (viewportWidth - leftValue < overlayWidth)
      leftValue = viewportWidth - overlayWidth;

    return { top: `${topValue}px`, left: `${leftValue}px` };
  };

  // 마우스 이동 이벤트 등록 및 해제
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDrag);
      window.addEventListener("mouseup", handleDragEnd);
    } else {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", handleDragEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", handleDragEnd);
    };
  }, [isDragging]);

  useEffect(() => {
    console.log(position.left, position.top);
  }, [position]);

  /* 채팅창이 닫힐 때 store에서 채팅창 닫힘 처리 */
  useEffect(() => {
    return () => {
      dispatch(closeChat());
    };
  }, []);

  /* 채팅방 입장 */
  const handleGoToChatRoom = (id: string | number) => {
    dispatch(setChatRoomUuid(id));
    dispatch(openChatRoom());
  };

  /* 친구 목록 가져오기 */
  const handleFetchFriendsList = async () => {
    setIsLoading(true);
    const accessToken = getAccessToken();
    if (!accessToken) return;

    try {
      const response = await getFriendsList();
      const friendsList = response.data.friendInfoList;

      if (Array.isArray(friendsList)) {
        setFriends(friendsList);
        const likedFriends = friendsList.filter((friend) => friend.liked);
        setFavoriteFriends(likedFriends);
      } else {
        setFriends([]);
        setFavoriteFriends([]);
      }
    } catch (error) {
      console.error(error);
      setFriends([]);
      setFavoriteFriends([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const likedFriends = friends.filter((friend) => friend.liked);
    setFavoriteFriends(likedFriends);
  }, [friends]);

  useEffect(() => {
    const likedFriends = friends.filter((friend) => friend.liked);
    setFavoriteFriends(likedFriends);
  }, [friends]);

  /* 검색 중이 아닐 때만 전체 목록을 가져오기. */
  useEffect(() => {
    if (!isSearching) {
      handleFetchFriendsList();
    }
  }, [activeTab, isSearching]);

  /* 친구 검색 */
  const handleSearch = (searchResults: FriendList[] | null) => {
    if (searchResults === null) {
      // 검색어 결과 없을 경우 전체 친구 목록 보여주기
      setIsSearching(false);
      handleFetchFriendsList();
    } else {
      // 검색 결과 업데이트
      setIsSearching(true);
      setFriends(searchResults);

      const likedFriends = searchResults.filter((friend) => friend.liked);
      setFavoriteFriends(likedFriends);
    }
  };

  /* 즐겨찾기 상태 변경 */
  const handleFavoriteToggle = async (
    event: React.MouseEvent,
    friendId: number
  ) => {
    event.stopPropagation();

    // friends 배열과 검색된 친구 목록에서 해당 친구 찾기
    const friend = friends.find((f) => f.memberId === friendId);
    if (friend) {
      const newLikedStatus = !friend.liked;

      // friends 상태 업데이트
      setFriends((prevFriends) =>
        prevFriends.map((f) =>
          f.memberId === friendId ? { ...f, isLiked: newLikedStatus } : f
        )
      );

      // favoriteFriends 상태 업데이트
      setFavoriteFriends((prevFavorites) =>
        newLikedStatus
          ? [...prevFavorites, { ...friend, isLiked: newLikedStatus }]
          : prevFavorites.filter((f) => f.memberId !== friendId)
      );

      try {
        await patchFriendStar(friendId);
      } catch (error) {
        console.error(error);
      }
    }
  };

  /* 매너평가 조회 */
  const handleMannerValuesGet = async (memberId: number) => {
    try {
      const response = await getMannerValues(memberId);
      await setIsMannerValue(response.data);
      await setCheckedMannerItems(response.data.mannerKeywordIdList);
    } catch (error) {
      console.error(error);
    }
  };

  /* 비매너평가 조회 */
  const handleBadMannerValuesGet = async (memberId: number) => {
    try {
      const response = await getBadMannerValues(memberId);
      await setIsBadMannerValue(response.data);
      await setCheckedBadMannerItems(response.data.mannerKeywordIdList);
    } catch (error) {
      console.error(error);
    }
  };

  /* 더보기 버튼 토글 */
  const handleMoreBoxOpen = (
    chatId: number,
    uuid: string,
    room: ChatroomList,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (isMoreBoxOpen === chatId) {
      setIsMoreBoxOpen(null);
    } else {
      setIsUuid(uuid);
      setIsMoreBoxOpen(chatId);
      setSelectedChatroom(room);
    }

    if (!!room.blind) return;
    handleMannerValuesGet(room.targetMemberId);
    handleBadMannerValuesGet(room.targetMemberId);
  };

  /* 외부 클릭 시 MoreBox 닫기 */
  const handleOutsideModalClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (isMoreBoxOpen) {
      setIsMoreBoxOpen(null);
    }
    setIsEditMode(false);
  };

  /* 모달 닫기 */
  const handleModalClose = () => {
    setCheckedReportItems([]);
    setCheckedMannerItems([]);
    setCheckedBadMannerItems([]);
    setReportDetail("");
    setIsEditMode(false);
    dispatch(setCloseModal());
    dispatch(closeChat());
  };

  /* 채팅방 나가기 */
  const handleChatLeave = async () => {
    if (!selectedChatroom) return;

    try {
      const response = await leaveChatroom({ uuid: selectedChatroom.uuid });
      if (response.status === 200 && socket) {
        socket.emit("exit-chatroom", { uuid: selectedChatroom.uuid });
      }
      await dispatch(setCloseModal());
    } catch (error) {
      console.error(error);
    } finally {
      handleModalClose();
      dispatch(closeChatRoom());
    }
  };

  /* 차단하기 */
  const handleChatBlock = async () => {
    if (!selectedChatroom) return;

    try {
      const response = await blockMember(selectedChatroom.targetMemberId);
      if (response.data && socket) {
        socket.emit("exit-chatroom", { uuid: selectedChatroom.uuid });
        await dispatch(setOpenModal("doneBlock"));
      }
    } catch (error) {
      console.error(error);
    }
  };

  /* 신고하기 */
  const handleReport = async () => {
    if (!selectedChatroom) return;

    const params = {
      memberId: selectedChatroom.targetMemberId,
      reportCodeList: checkedReportItems,
      contents: reportDetail,
      pathCode: 2, // CHAT
    };

    try {
      await reportMember(params);
      await handleModalClose();
    } catch (error) {
      console.error(error);
    }
  };

  /* 신고하기 체크박스 */
  const handleReportCheckboxChange = (checked: number) => {
    setCheckedReportItems((prev) =>
      prev.includes(checked)
        ? prev.filter((c) => c !== checked)
        : [...prev, checked]
    );
  };

  /* 매너평가 등록 */
  const handleMannerPost = async () => {
    const mannerId = isMannerValue?.mannerRatingId;
    if (!selectedChatroom || mannerId !== null) return;

    const params = {
      memberId: selectedChatroom.targetMemberId,
      mannerKeywordIdList: checkedMannerItems,
    };

    try {
      await postMannerValue(params);
      await notify({
        text: "매너 평가가 완료되었습니다",
        icon: "👌🏼",
        type: "success",
      });
      await handleModalClose();
      setIsEditMode(false);
    } catch (error) {
      console.error(error);
    }
  };

  /* 비매너평가 등록 */
  const handleBadMannerPost = async () => {
    const badMannerId = isBadMannerValue?.mannerRatingId;
    if (!selectedChatroom || badMannerId !== null) return;

    const params = {
      memberId: selectedChatroom.targetMemberId,
      mannerKeywordIdList: checkedBadMannerItems,
    };

    try {
      await postBadMannerValue(params);
      await notify({
        text: "비매너 평가가 완료되었습니다",
        icon: "👌🏼",
        type: "success",
      });
      await handleModalClose();
      setIsEditMode(false);
    } catch (error) {
      console.error(error);
    }
  };

  /* 매너 평가 체크박스 */
  const handleMannerCheckboxChange = (checked: number) => {
    setCheckedMannerItems((prev) =>
      prev.includes(checked)
        ? prev.filter((c) => c !== checked)
        : [...prev, checked]
    );
  };

  /* 비매너 평가 체크박스 */
  const handleBadMannerCheckboxChange = (checked: number) => {
    setCheckedBadMannerItems((prev) =>
      prev.includes(checked)
        ? prev.filter((c) => c !== checked)
        : [...prev, checked]
    );
  };

  /* 매너, 비매너 평가 수정 */
  const handleMannerEdit = async (type: string) => {
    const params = {
      mannerKeywordIdList:
        type === "manner" ? checkedMannerItems : checkedBadMannerItems,
    };

    try {
      if (
        type === "manner" &&
        isMannerValue &&
        isMannerValue.mannerRatingId !== null
      ) {
        await editManners({
          mannerId: isMannerValue.mannerRatingId,
          mannerKeywordIdList: params.mannerKeywordIdList,
        });
        await notify({
          text: "매너 평가 수정이 완료되었습니다",
          icon: "👌🏼",
          type: "success",
        });
      } else if (
        type === "badManner" &&
        isBadMannerValue &&
        isBadMannerValue.mannerRatingId !== null
      ) {
        await editManners({
          mannerId: isBadMannerValue.mannerRatingId,
          mannerKeywordIdList: params.mannerKeywordIdList,
        });
        await notify({
          text: "비매너 평가 수정이 완료되었습니다",
          icon: "👌🏼",
          type: "success",
        });
      }
      await handleModalClose();
      setIsEditMode(false);
    } catch (error) {
      console.error(error);
    }
  };

  const isMannerEditable =
    (isMannerValue?.mannerKeywordIdList?.length as number) > 0 &&
    !isEditMode &&
    isMannerValue?.mannerKeywordIdList.length !== 0;
  const isBadMannerEditable =
    (isBadMannerValue?.mannerKeywordIdList?.length as number) > 0 &&
    !isEditMode &&
    isBadMannerValue?.mannerKeywordIdList.length !== 0;

  return (
    <>
      <Overlay $top={position.top} $left={position.left}>
        <Wrapper onClick={handleOutsideModalClick}>
          {isChatRoomOpen && isChatUuid !== null ? (
            <ChatLayout apiType={activeTab} onDragStart={handleDragStart} />
          ) : (
            <>
              <Header onMouseDown={handleDragStart}>
                <HeaderTitle>메신저</HeaderTitle>
                <CloseButton
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(closeChat());
                    dispatch(resetPosition());
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <CloseImage
                    src="/assets/icons/close.svg"
                    width={12}
                    height={12}
                    alt="닫기"
                  />
                </CloseButton>
              </Header>
              <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onTabClick={setActiveTab}
              />
              {activeTab === 0 && <SearchBar onSearch={handleSearch} />}
              <ChatMain className={activeTab === 0 ? "friend" : "chat"}>
                <Content className={activeTab === 0 ? "friend" : "chat"}>
                  {activeTab === 0 ? (
                    <div>
                      <ChatFriendList
                        onChatRoom={handleGoToChatRoom}
                        friends={friends}
                        favoriteFriends={favoriteFriends}
                        onFavoriteToggle={handleFavoriteToggle}
                        handleFetchFriendsList={handleFetchFriendsList}
                        isSearching={isSearching}
                      />
                    </div>
                  ) : (
                    <ChatRoomList
                      onChatRoom={handleGoToChatRoom}
                      activeTab={activeTab}
                      isMoreBoxOpen={isMoreBoxOpen}
                      setIsMoreBoxOpen={setIsMoreBoxOpen}
                      handleMoreBoxOpen={handleMoreBoxOpen}
                    />
                  )}
                </Content>
              </ChatMain>
            </>
          )}
        </Wrapper>
      </Overlay>

      {/* 채팅창 나가기 팝업 */}
      {!isChatRoomOpen && isModalType === "leave" && selectedChatroom && (
        <ConfirmModal
          width="540px"
          primaryButtonText="취소"
          secondaryButtonText="나가기"
          onPrimaryClick={handleModalClose}
          onSecondaryClick={handleChatLeave}
        >
          {selectedChatroom?.friend || selectedChatroom?.blind ? (
            <Text>{`채팅방을 나가시겠어요?`}</Text>
          ) : (
            <Text>
              {`친구 추가 하지 않은 상대방입니다\n채팅방을 나가시겠어요?`}
            </Text>
          )}
        </ConfirmModal>
      )}

      {/* 차단하기 팝업 */}
      {!isChatRoomOpen && isModalType === "block" && (
        <ConfirmModal
          width="540px"
          primaryButtonText="취소"
          secondaryButtonText="차단"
          onPrimaryClick={handleModalClose}
          onSecondaryClick={handleChatBlock}
        >
          <div>
            <Text>
              {`차단한 상대에게는 메시지를 받을 수 없으며\n매칭이 이루어지지 않습니다. 차단하시겠습니까?`}
            </Text>
            <SmallText>{` 차단 해제는 마이페이지에서 가능합니다.`}</SmallText>
          </div>
        </ConfirmModal>
      )}

      {/* 차단 완료 팝업 */}
      {!isChatRoomOpen && isModalType === "doneBlock" && (
        <ConfirmModal
          width="540px"
          primaryButtonText="확인"
          onPrimaryClick={handleChatLeave}
        >
          <MsgConfirm>{`차단이 완료되었습니다.`}</MsgConfirm>
        </ConfirmModal>
      )}

      {/* 신고하기 팝업 */}
      {!isChatRoomOpen && isModalType === "report" && (
        <FormModal
          type="checkbox"
          title="유저 신고하기"
          width="494px"
          height="721px"
          closeButtonWidth={17}
          closeButtonHeight={17}
          borderRadius="20px"
          onClose={handleModalClose}
        >
          <div>
            <ReportLabel>신고 사유</ReportLabel>
            <ReportReasonContent>
              {REPORT_REASON.map((data) => (
                <Checkbox
                  key={data.id}
                  value={data.id}
                  label={data.text}
                  fontSize="regular18"
                  isChecked={checkedReportItems.includes(data.id)}
                  onArrayChange={handleReportCheckboxChange}
                />
              ))}
            </ReportReasonContent>
            <ReportLabel>상세 내용</ReportLabel>
            <ReportContent>
              <Input
                inputType="textarea"
                value={reportDetail}
                onChange={(value) => {
                  setReportDetail(value);
                }}
                placeholder="내용을 입력하세요. (선택)"
                borderRadius="8px"
                fontSize="regular18"
                height="134px"
              />
            </ReportContent>
            <ReportButton>
              <Button
                onClick={handleReport}
                buttonType="primary"
                text="신고하기"
                disabled={checkedReportItems.length === 0}
              />
            </ReportButton>
          </div>
        </FormModal>
      )}

      {/* 매너평가 팝업 */}
      {!isChatRoomOpen && isModalType === "manner" && isMannerValue && (
        <FormModal
          type="checkbox"
          title={isMannerEditable ? "내가 남긴 매너 평가" : "매너 평가하기"}
          width="418px"
          closeButtonWidth={17}
          closeButtonHeight={17}
          borderRadius="10px"
          onClose={handleModalClose}
        >
          <CheckContent>
            {MANNER_TYPES.map((data) => (
              <Checkbox
                key={data.id}
                value={data.id}
                label={data.text}
                fontSize="semiBold16"
                isChecked={checkedMannerItems.includes(data.id)}
                disabled={isMannerEditable}
                onArrayChange={handleMannerCheckboxChange}
              />
            ))}
          </CheckContent>
          <ModalSubmitBtn>
            {isMannerEditable ? (
              <Button
                onClick={() => setIsEditMode(true)}
                buttonType="primary"
                text="수정하기"
              />
            ) : (
              <Button
                onClick={() =>
                  isMannerValue.mannerKeywordIdList.length > 0
                    ? handleMannerEdit("manner")
                    : handleMannerPost()
                }
                buttonType="primary"
                text="완료"
                disabled={!isEditMode && checkedMannerItems.length === 0}
              />
            )}
          </ModalSubmitBtn>
        </FormModal>
      )}

      {/* 비매너 평가 팝업 */}
      {!isChatRoomOpen && isModalType === "badManner" && isBadMannerValue && (
        <FormModal
          type="checkbox"
          title={
            isBadMannerEditable ? "내가 남긴 비매너 평가" : "비매너 평가하기"
          }
          width="418px"
          closeButtonWidth={17}
          closeButtonHeight={17}
          borderRadius="10px"
          onClose={handleModalClose}
        >
          <CheckContent>
            {BAD_MANNER_TYPES.map((data) => (
              <Checkbox
                key={data.id}
                value={data.id}
                label={data.text}
                fontSize="semiBold16"
                isChecked={checkedBadMannerItems.includes(data.id)}
                disabled={isBadMannerEditable}
                onArrayChange={handleBadMannerCheckboxChange}
              />
            ))}
          </CheckContent>
          <ModalSubmitBtn>
            {isBadMannerEditable ? (
              <Button
                onClick={() => setIsEditMode(true)}
                buttonType="primary"
                text="수정하기"
              />
            ) : (
              <Button
                onClick={() =>
                  isBadMannerValue.mannerKeywordIdList.length > 0
                    ? handleMannerEdit("badManner")
                    : handleBadMannerPost()
                }
                buttonType="primary"
                text="완료"
                disabled={!isEditMode && checkedBadMannerItems.length === 0}
              />
            )}
          </ModalSubmitBtn>
        </FormModal>
      )}
    </>
  );
};

export default Layout;

const Overlay = styled.div<{ $top: string; $left: string }>`
  position: fixed;
  z-index: 100;

  top: calc(${(props) => props.$top});
  left: calc(${(props) => props.$left});
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 420px;
  box-shadow: 0 4px 46.7px 0 #0000001a;
  background: ${theme.colors.white};
  border-radius: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  margin-bottom: 10px;
  user-select: auto;
  cursor: move;
`;

const HeaderTitle = styled.p`
  ${(props) => props.theme.fonts.bold20};
  color: ${theme.colors.gray600};
`;

const CloseButton = styled.button`
  display: flex;
  width: 12px;
  height: 12px;
`;

const CloseImage = styled(Image)`
  margin-left: auto;
`;

const ChatMain = styled.div`
  border-radius: 0 0 20px 20px;
  background: ${theme.colors.white};
  &.friend {
    box-shadow: none;
    padding-right: 6px;
  }
  &.chat {
    box-shadow: inset 0 0 4.7px 0 #00000026;
  }
`;

const Content = styled.main`
  &.friend {
    height: 508px;
  }
  &.chat {
    height: 590px;
  }

  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 66px;
    background: ${theme.colors.gray500};
  }
  &::-webkit-scrollbar-track {
    border-radius: 66px;
    background: transparent;
  }
`;

const CheckContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

const ModalSubmitBtn = styled.div`
  margin-top: 52px;
`;

const ReportLabel = styled.p`
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.semiBold18};
  margin-bottom: 12px;
`;

const ReportContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

const ReportReasonContent = styled(ReportContent)`
  margin-bottom: 38px;
`;

const ReportButton = styled.div`
  margin-top: 21px;
`;

const Text = styled.div`
  text-align: center;
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.regular20};
  margin: 28px 0;
`;

const SmallText = styled.div`
  text-align: center;
  color: ${theme.colors.gray200};
  ${(props) => props.theme.fonts.regular14};
  margin-top: 13px;
`;

const MsgConfirm = styled(Text)`
  ${(props) => props.theme.fonts.regular25};
  margin: 80px 0;
`;

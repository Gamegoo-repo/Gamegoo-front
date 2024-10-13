import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeChat, closeChatRoom, openChatRoom, setChatRoomUuid } from "@/redux/slices/chatSlice";
import Header from "./Header";
import SearchBar from "./SearchBar";
import FriendList from "./FriendList";
import ChatRoomList from "./ChatRoomList";
import { RootState } from "@/redux/store";
import ChatLayout from "./ChatLayout";
import { FriendListInterface } from "@/interface/friends";
import { getFriendsList, likeFriend, unLikeFriend } from "@/api/friends";
import { ChatroomList } from "@/interface/chat";
import { Mannerstatus } from "@/interface/manner";
import { editManners, getBadMannerValues, getMannerValues, postBadMannerValue, postMannerValue } from "@/api/manner";
import ConfirmModal from "../common/ConfirmModal";
import { leaveChatroom } from "@/api/chat";
import { setCloseModal, setOpenModal } from "@/redux/slices/modalSlice";
import { socket } from "@/socket";
import { BAD_MANNER_TYPES, MANNER_TYPES } from "@/data/mannerLevel";
import Button from "../common/Button";
import FormModal from "../common/FormModal";
import Checkbox from "../common/Checkbox";
import Input from "../common/Input";
import { REPORT_REASON } from "@/data/report";
import { blockMember, reportMember } from "@/api/member";

const Layout = () => {
    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState(0);
    const [friends, setFriends] = useState<FriendListInterface[]>([]);
    const [favoriteFriends, setFavoriteFriends] = useState<FriendListInterface[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const tabs = ['친구 목록', '대화방'];
    const [isMoreBoxOpen, setIsMoreBoxOpen] = useState<number | null>(null); // MoreBox 열림 상태
    const [isUuid, setIsUuid] = useState("");
    const [selectedChatroom, setSelectedChatroom] = useState<ChatroomList | null>(null);
    const [checkedReportItems, setCheckedReportItems] = useState<number[]>([]);
    const [checkedMannerItems, setCheckedMannerItems] = useState<number[]>([]);
    const [checkedBadMannerItems, setCheckedBadMannerItems] = useState<number[]>([]);
    const [reportDetail, setReportDetail] = useState<string>("");
    const [isMannerValue, setIsMannerValue] = useState<Mannerstatus | undefined>();
    const [isBadMannerValue, setIsBadMannerValue] = useState<Mannerstatus | undefined>();
    const [isEditMode, setIsEditMode] = useState(false);
    const [cursor, setCursor] = useState<number | null>(null);
    const [hasNext, setHasNext] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const isChatRoomOpen = useSelector((state: RootState) => state.chat.isChatRoomOpen);
    const isChatUuid = useSelector((state: RootState) => state.chat.isChatRoomUuid);
    const isModalType = useSelector((state: RootState) => state.modal.modalType);

    /* 채팅방 입장 */
    const handleGoToChatRoom = (id: string | number) => {
        dispatch(setChatRoomUuid(id));
        dispatch(openChatRoom());
        // TODO
        // if (typeof id === 'string') {
        // setChatRoomUuid(id);
        // }
    };

    /* 친구 목록 가져오기 */
    const handleFetchFriendsList = async (cursor?: number) => {
        setIsLoading(true);
        try {
            const data = await getFriendsList(cursor);
            const friendsList = data?.result?.friendInfoDTOList;

            if (Array.isArray(friendsList)) {
                setFriends(friendsList);
                const likedFriends = friendsList.filter(friend => friend.isLiked);
                setFavoriteFriends(likedFriends);
                setHasNext(data.result.has_next);
                setCursor(data.result.next_cursor);
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

    /* 친구 목록 페이지 - 스크롤이 끝에 도달하면 다음 페이지 가져오기 */
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (!cursor) return;
        const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight;
        if (hasNext && bottom && !isLoading) {
            handleFetchFriendsList(cursor);
        }
    };

    useEffect(() => {
        const likedFriends = friends.filter(friend => friend.isLiked);
        setFavoriteFriends(likedFriends);
    }, [friends]);

    /* 검색 중이 아닐 때만 전체 목록을 가져오기. */
    useEffect(() => {
        if (!isSearching) {
            handleFetchFriendsList();
        }
    }, [activeTab, isSearching]);

    /* 친구 검색 */
    const handleSearch = (searchResults: FriendListInterface[] | null) => {
        if (searchResults === null) {
            // 검색어 결과 없을 경우 전체 친구 목록 보여주기
            setIsSearching(false);
            handleFetchFriendsList();
        } else {
            // 검색 결과 업데이트
            setIsSearching(true);
            setFriends(searchResults);

            const likedFriends = searchResults.filter(friend => friend.isLiked);
            setFavoriteFriends(likedFriends);
        }
    };

    /* 즐겨찾기 상태 변경 */
    const handleFavoriteToggle = async (event: React.MouseEvent, friendId: number) => {
        event.stopPropagation();

        // friends 배열과 검색된 친구 목록에서 해당 친구 찾기
        const friend = friends.find((f) => f.memberId === friendId);
        if (friend) {
            const newLikedStatus = !friend.isLiked;

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
                if (newLikedStatus) {
                    await likeFriend(friendId);
                } else {
                    await unLikeFriend(friendId);
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    /* 매너평가 조회 */
    const handleMannerValuesGet = async (memberId: number) => {
        try {
            const response = await getMannerValues(memberId);
            await setIsMannerValue(response.result);
            await setCheckedMannerItems(response.result.mannerRatingKeywordList)
        } catch (error) {
            console.error(error);
        }
    };

    /* 비매너평가 조회 */
    const handleBadMannerValuesGet = async (memberId: number) => {
        try {
            const response = await getBadMannerValues(memberId);
            await setIsBadMannerValue(response.result);
            await setCheckedBadMannerItems(response.result.mannerRatingKeywordList)
        } catch (error) {
            console.error(error);
        }
    };

    /* 더보기 버튼 토글 */
    const handleMoreBoxOpen = (chatId: number, uuid: string, room: ChatroomList, e: React.MouseEvent) => {
        e.stopPropagation();
        if (isMoreBoxOpen === chatId) {
            setIsMoreBoxOpen(null);
        } else {
            setIsUuid(uuid);
            setIsMoreBoxOpen(chatId);
            setSelectedChatroom(room);
        };

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
    };

    /* 채팅방 나가기 */
    const handleChatLeave = async () => {
        if (!selectedChatroom) return;

        try {
            const response = await leaveChatroom(selectedChatroom.uuid);
            if (response.isSuccess && socket) {
                socket.emit('exit-chatroom', { uuid: selectedChatroom.uuid });
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
            if (response.isSuccess && socket) {
                socket.emit('exit-chatroom', { uuid: selectedChatroom.uuid });
                await dispatch(setOpenModal('doneBlock'));
            }
        } catch (error) {
            console.error(error);
        }
    };

    /* 신고하기 */
    const handleReport = async () => {
        if (!selectedChatroom) return;

        const params = {
            targetMemberId: selectedChatroom.targetMemberId,
            reportTypeIdList: checkedReportItems,
            contents: reportDetail
        };

        try {
            await reportMember(params)
            await handleModalClose();
        } catch (error) {
            console.error(error);
        }
    };

    /* 신고하기 체크박스 */
    const handleReportCheckboxChange = (checked: number) => {
        setCheckedReportItems((prev) =>
            prev.includes(checked) ? prev.filter((c) => c !== checked) : [...prev, checked]
        );
    };

    /* 매너평가 등록 */
    const handleMannerPost = async () => {
        const mannerId = isMannerValue?.mannerId;
        if (!selectedChatroom || mannerId !== null) return;

        const params = {
            toMemberId: selectedChatroom.targetMemberId,
            mannerRatingKeywordList: checkedMannerItems,
        };

        try {
            await postMannerValue(params)
            await handleModalClose();
            setIsEditMode(false);
        } catch (error) {
            console.error(error);
        }
    };

    /* 비매너평가 등록 */
    const handleBadMannerPost = async () => {
        const badMannerId = isBadMannerValue?.mannerId;
        if (!selectedChatroom || badMannerId !== null) return;

        const params = {
            toMemberId: selectedChatroom.targetMemberId,
            mannerRatingKeywordList: checkedBadMannerItems,
        };

        try {
            await postBadMannerValue(params)
            await handleModalClose();
            setIsEditMode(false);
        } catch (error) {
            console.error(error);
        }
    };

    /* 매너 평가 체크박스 */
    const handleMannerCheckboxChange = (checked: number) => {
        setCheckedMannerItems((prev) =>
            prev.includes(checked) ? prev.filter((c) => c !== checked) : [...prev, checked]
        );
    };

    /* 비매너 평가 체크박스 */
    const handleBadMannerCheckboxChange = (checked: number) => {
        setCheckedBadMannerItems((prev) =>
            prev.includes(checked) ? prev.filter((c) => c !== checked) : [...prev, checked]
        );
    };

    /* 매너, 비매너 평가 수정 */
    const handleMannerEdit = async (type: string) => {
        const params = {
            mannerRatingKeywordList: type === 'manner' ? checkedMannerItems : checkedBadMannerItems,
        };

        try {
            if (type === 'manner' && isMannerValue && isMannerValue.mannerId !== null) {
                await editManners(isMannerValue.mannerId, params);
            } else if (type === 'badManner' && isBadMannerValue && isBadMannerValue.mannerId !== null) {
                await editManners(isBadMannerValue.mannerId, params);
            }
            await handleModalClose();
            setIsEditMode(false);
        } catch (error) {
            console.error(error);
        }
    };

    const isMannerEditable = isMannerValue?.isExist && !isEditMode && isMannerValue?.mannerRatingKeywordList.length !== 0;
    const isBadMannerEditable = isBadMannerValue?.isExist && !isEditMode && isBadMannerValue?.mannerRatingKeywordList.length !== 0;

    return (
        <>
            {isChatRoomOpen && isChatUuid !== null ? (
                <ChatLayout
                    apiType={activeTab}
                />
            ) : (
                <Overlay>
                    <Wrapper onClick={handleOutsideModalClick}>
                        <CloseButton>
                            <CloseImage
                                onClick={() => dispatch(closeChat())}
                                src='/assets/icons/close.svg'
                                width={11}
                                height={11}
                                alt='닫기' />
                        </CloseButton>
                        <Header
                            title="메신저"
                            tabs={tabs}
                            activeTab={activeTab}
                            onTabClick={setActiveTab}
                        />
                        {activeTab === 0 && <SearchBar onSearch={handleSearch} />}
                        <ChatMain className={activeTab === 0 ? 'friend' : 'chat'}>
                            <Content className={activeTab === 0 ? 'friend' : 'chat'}>
                                {activeTab === 0 ?
                                    <div onScroll={handleScroll}>
                                        <FriendList
                                            onChatRoom={handleGoToChatRoom}
                                            friends={friends}
                                            favoriteFriends={favoriteFriends}
                                            onFavoriteToggle={handleFavoriteToggle}
                                            handleFetchFriendsList={handleFetchFriendsList}
                                            isSearching={isSearching}
                                        />
                                    </div>
                                    :
                                    <ChatRoomList
                                        onChatRoom={handleGoToChatRoom}
                                        activeTab={activeTab}
                                        isMoreBoxOpen={isMoreBoxOpen}
                                        setIsMoreBoxOpen={setIsMoreBoxOpen}
                                        handleMoreBoxOpen={handleMoreBoxOpen}
                                    />}
                            </Content>
                        </ChatMain>
                    </Wrapper>
                </Overlay>
            )}

            {/* 채팅창 나가기 팝업 */}
            {!isChatRoomOpen && isModalType === 'leave' && selectedChatroom &&
                <ConfirmModal
                    width="540px"
                    primaryButtonText="취소"
                    secondaryButtonText="나가기"
                    onPrimaryClick={handleModalClose}
                    onSecondaryClick={handleChatLeave}
                >
                    {selectedChatroom?.friend || selectedChatroom?.blind ? (
                        <Text>
                            {`채팅방을 나가시겠어요?`}
                        </Text>
                    ) : (
                        <Text>
                            {`친구 추가 하지 않은 상대방입니다\n채팅방을 나가시겠어요?`}
                        </Text>
                    )}
                </ConfirmModal>
            }

            {/* 차단하기 팝업 */}
            {!isChatRoomOpen && isModalType === 'block' &&
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
                        <SmallText>
                            {` 차단 해제는 마이페이지에서 가능합니다.`}
                        </SmallText>
                    </div>
                </ConfirmModal>
            }

            {/* 차단 완료 팝업 */}
            {!isChatRoomOpen && isModalType === 'doneBlock' && (
                <ConfirmModal
                    width="540px"
                    primaryButtonText="확인"
                    onPrimaryClick={handleChatLeave}
                >
                    <MsgConfirm>{`차단이 완료되었습니다.`}</MsgConfirm>
                </ConfirmModal>
            )}

            {/* 신고하기 팝업 */}
            {!isChatRoomOpen && isModalType === 'report' &&
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
            }

            {/* 매너평가 팝업 */}
            {!isChatRoomOpen && isModalType === 'manner' && isMannerValue && (
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
                                onClick={() => isMannerValue.isExist ? handleMannerEdit('manner') : handleMannerPost()}
                                buttonType="primary"
                                text="완료"
                                disabled={!isEditMode && checkedMannerItems.length === 0}
                            />
                        )}
                    </ModalSubmitBtn>
                </FormModal>
            )}

            {/* 비매너 평가 팝업 */}
            {!isChatRoomOpen && isModalType === 'badManner' && isBadMannerValue && (
                <FormModal
                    type="checkbox"
                    title={isBadMannerEditable ? "내가 남긴 비매너 평가" : "비매너 평가하기"}
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
                                onClick={() => isBadMannerValue.isExist ? handleMannerEdit('badManner') : handleBadMannerPost()}
                                buttonType="primary"
                                text="완료"
                                disabled={!isEditMode && checkedBadMannerItems.length === 0}
                            />
                        )}
                    </ModalSubmitBtn>
                </FormModal>
            )}
        </>
    )
};

export default Layout;

const Overlay = styled.div`
    position:fixed;
    top: 50%;
    right: 8%;
    transform: translate(0, -50%);
    z-index: 1;
`;

const Wrapper = styled.div`
    background: ${theme.colors.white};
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    width: 418px;
    box-shadow: 0 4px 46.7px 0 #0000001A;
`;

const CloseButton = styled.p`
    display:flex;
    margin-bottom:1px;
    padding:12px 13px 0 0;
`;

const CloseImage = styled(Image)`
    margin-left:auto;
    cursor: pointer;
`;

const ChatMain = styled.div`
    border-radius: 0 0 20px 20px;
    background:${theme.colors.white};
    &.friend{
        box-shadow: none;
        padding-right: 6px;
    }
    &.chat{
        box-shadow: inset 0 0 4.7px 0 #00000026;
    }
`;

const Content = styled.main`
    &.friend{
        height: 508px; 
    }
    &.chat{
        height: 590px; 
    }

    overflow-y: auto; 
    &::-webkit-scrollbar {
        width: 5px;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 66px;
        background: ${theme.colors.gray300};
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
  margin-top:52px;
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
  margin-top:21px;
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

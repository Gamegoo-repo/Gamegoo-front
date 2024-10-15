import styled from "styled-components";
import { theme } from "@/styles/theme";
import MessageHeader from "./MessageHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { closeChatRoom, setCurrentChatUuid, setErrorMessage, setUnreadUuid } from "@/redux/slices/chatSlice";
import { Chat, DesignedSystemMessage } from "@/interface/chat";
import { enterUsingBoardId, enterUsingMemberId, enterUsingUuid, leaveChatroom } from "@/api/chat";
import { RootState } from "@/redux/store";
import { socket } from "@/socket";
import { editManners, getBadMannerValues, getMannerValues, postBadMannerValue, postMannerValue } from "@/api/manner";
import { Mannerstatus } from "@/interface/manner";
import ConfirmModal from "../common/ConfirmModal";
import FormModal from "../common/FormModal";
import Input from "../common/Input";
import Button from "../common/Button";
import Checkbox from "../common/Checkbox";
import { setCloseModal, setOpenModal } from "@/redux/slices/modalSlice";
import { blockMember, reportMember } from "@/api/member";
import { BAD_MANNER_TYPES, MANNER_TYPES } from "@/data/mannerLevel";
import { REPORT_REASON } from "@/data/report";
import { MoreBoxMenuItems } from "@/interface/moreBox";
import { cancelFriendReq, deleteFriend, reqFriend } from "@/api/friends";

interface System {
    flag: number;
    boardId: number;
}

interface ChatLayoutProps {
    apiType: number;
}

const ChatLayout = (props: ChatLayoutProps) => {
    const { apiType } = props;
    const dispatch = useDispatch();

    const [isMoreBoxOpen, setIsMoreBoxOpen] = useState(false);
    const [chatEnterData, setChatEnterData] = useState<Chat>();
    const [systemMessage, setSystemMessage] = useState<DesignedSystemMessage>();
    const [isSystemMsg, setIsSystemMsg] = useState<System>();
    const [isSystemMsgSent, setIsSystemMsgSent] = useState(false); // 첫번째 메시지 이후 systemMsg 보내지 않기 위한 상태변경
    const [message, setMessage] = useState("");
    const [checkedReportItems, setCheckedReportItems] = useState<number[]>([]);
    const [checkedMannerItems, setCheckedMannerItems] = useState<number[]>([]);
    const [checkedBadMannerItems, setCheckedBadMannerItems] = useState<number[]>([]);
    const [reportDetail, setReportDetail] = useState<string>("");
    const [isEditMode, setIsEditMode] = useState(false);
    const [isMannerValue, setIsMannerValue] = useState<Mannerstatus | undefined>();
    const [isBadMannerValue, setIsBadMannerValue] = useState<Mannerstatus | undefined>();

    const isChatRoomOpen = useSelector((state: RootState) => state.chat.isChatRoomOpen);
    const isChatUuid = useSelector((state: RootState) => state.chat.isChatRoomUuid);
    const isModalType = useSelector((state: RootState) => state.modal.modalType);
    const isUser = useSelector((state: RootState) => state.user);


    /* 채팅창이 닫힐 때 store에서 채팅창 닫힘 처리 */
    useEffect(() => {
        return () => {
            dispatch(closeChatRoom());
        }
    }, [])

    /* 채팅방 입장 */
    const handleChatEnter = async () => {
        if (!isChatUuid) return;

        try {
            // 친구목록에서 채팅방 입장
            if (apiType === 0 && typeof isChatUuid === "number") {
                const data = await enterUsingMemberId(isChatUuid);
                setChatEnterData(data.result);
                dispatch(setCurrentChatUuid(data.result.uuid));
                removeUnreadUuid(data.result.uuid);
            }

            // 대화방에서 채팅방 입장
            if (apiType === 1 && typeof isChatUuid === "string") {
                const data = await enterUsingUuid(isChatUuid);
                setChatEnterData(data.result);
                dispatch(setCurrentChatUuid(data.result.uuid));
                removeUnreadUuid(data.result.uuid);
            }

            // 게시글에서 채팅방 입장
            if (apiType === 2 && typeof isChatUuid === "number") {
                const data = await enterUsingBoardId(isChatUuid);
                setChatEnterData(data.result);
                dispatch(setCurrentChatUuid(data.result.uuid));
                setIsSystemMsg(data.result.system);
                removeUnreadUuid(data.result.uuid);
                // 실시간으로 시스템 메시지 보여주기 위함
                let systemMessage: DesignedSystemMessage;
                if (data.result.system.flag === 1) {
                    systemMessage = {
                        senderId: 0,
                        senderName: null,
                        senderProfileImg: null,
                        message: "상대방이 게시한 글을 보고 말을 걸었어요. 대화를 시작해보세요~",
                        createdAt: null,
                        timestamp: null,
                        systemType: 0,
                        boardId: data.result.system.boardId,
                    };
                } else {
                    systemMessage = {
                        senderId: 0,
                        senderName: null,
                        senderProfileImg: null,
                        message: "상대방이 게시한 글을 보고 말을 걸었어요.",
                        createdAt: null,
                        timestamp: null,
                        systemType: 0,
                        boardId: data.result.system.boardId,
                    };
                }
                setSystemMessage(systemMessage);
            }
        } catch (err) {
            const error = err as AxiosError<ErrorResponse>;
            console.error(error.message);
            dispatch(setErrorMessage(error.message || "알 수 없는 오류가 발생했습니다."));
        }
    };

    useEffect(() => {
        if (isChatUuid) {
            handleChatEnter();
        }
    }, [isChatUuid]);

    /* 읽은 채팅 채팅 버튼에 실시간으로 반영 */
    const removeUnreadUuid = (uuidToRemove: string) => {
        const unreadUuids = sessionStorage.getItem('unreadChatUuids');

        if (unreadUuids) {
            let unreadUuidsArray: string[] = JSON.parse(unreadUuids);
            unreadUuidsArray = unreadUuidsArray.filter(uuid => uuid !== uuidToRemove);

            sessionStorage.setItem('unreadChatUuids', JSON.stringify(unreadUuidsArray));

            // 채팅 버튼에 실시간 반영 위함
            dispatch(setUnreadUuid(unreadUuidsArray));
        }
    };

    /* 채팅방 나가기 */
    const handleChatLeave = async () => {
        if (!chatEnterData) return;

        try {
            const response = await leaveChatroom(chatEnterData.uuid);
            if (response.isSuccess && socket) {
                socket.emit('exit-chatroom', { uuid: chatEnterData.uuid });
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
        if (!chatEnterData) return;

        try {
            const response = await blockMember(chatEnterData.memberId);
            if (response.isSuccess && socket) {
                socket.emit('exit-chatroom', { uuid: chatEnterData.uuid });
                await dispatch(setOpenModal('doneBlock'));
            }
        } catch (error) {
            console.error(error);
        }
    };

    /* 매너평가 등록 */
    const handleMannerPost = async () => {
        const mannerId = isMannerValue?.mannerId;
        if (!chatEnterData || mannerId !== null) return;

        const params = {
            toMemberId: chatEnterData.memberId,
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
        if (!chatEnterData || badMannerId !== null) return;

        const params = {
            toMemberId: chatEnterData.memberId,
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

    /* 매너평가 조회 */
    const handleMannerValuesGet = async (memberId: number) => {
        try {
            const response = await getMannerValues(memberId);
            await setIsMannerValue(response.result);
            await setCheckedMannerItems(response.result.mannerRatingKeywordList);
        } catch (error) {
            console.error(error);
        }
    };

    /* 비매너평가 조회 */
    const handleBadMannerValuesGet = async (memberId: number) => {
        try {
            const response = await getBadMannerValues(memberId);
            await setIsBadMannerValue(response.result);
            await setCheckedBadMannerItems(response.result.mannerRatingKeywordList);
        } catch (error) {
            console.error(error);
        }
    }

    /* 더보기 버튼 열기 */
    const handleMoreBoxOpen = () => {
        if (!chatEnterData || !chatEnterData.memberId) return;

        setIsMoreBoxOpen(prevState => !prevState);

        if (!!chatEnterData.blind) return;
        handleMannerValuesGet(chatEnterData.memberId);
        handleBadMannerValuesGet(chatEnterData.memberId);
    };

    /* 메시지 보내기 */
    const sendMessage = (event: any) => {
        event.preventDefault();
        if (message.trim()) {
            let emitData;

            if (chatEnterData?.system) {
                // chatEnterData.system이 있는 경우
                if (!isSystemMsgSent) {
                    // 첫 번째 메시지일 경우, system 값을 포함
                    emitData = {
                        uuid: chatEnterData.uuid,
                        message: message,
                        system: isSystemMsg,
                    };
                    setIsSystemMsgSent(true);
                } else {
                    // 이후 메시지에는 system 값을 포함시키지 않음
                    emitData = {
                        uuid: chatEnterData.uuid,
                        message: message,
                    };
                }
            } else {
                // chatEnterData.system이 없는 경우
                emitData = {
                    uuid: chatEnterData?.uuid,
                    message: message,
                };
            }

            if (socket) {
                socket.emit("chat-message", emitData);
            } else {
                console.error("소켓이 연결되지 않았습니다.");
            }

            setMessage("");
        }
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

    /* 신고하기 */
    const handleReport = async () => {
        if (!chatEnterData) return;

        const params = {
            targetMemberId: chatEnterData.memberId,
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

    /* 친구 추가 */
    const handleFriendAdd = async () => {
        if (!chatEnterData) return;
        try {
            await reqFriend(chatEnterData.memberId);
            await handleChatEnter();
        } catch (error) {
            console.error(error);
        }
    };

    /* 친구 요청 취소 */
    const handleCancelFriendReq = async () => {
        if (!chatEnterData) return;

        try {
            await cancelFriendReq(chatEnterData.memberId);
            await handleChatEnter();
        } catch (error) {
            console.error(error);
        }
    };

    /* 친구 삭제 */
    const handleFriendDelete = async () => {
        if (!chatEnterData) return;

        try {
            await deleteFriend(chatEnterData.memberId);
            await handleChatEnter();
        } catch (error) {
            console.error(error);
        }
    };

    /* 모달 타입 변경 */
    const handleModalChange = (e: React.MouseEvent, modalType: string) => {
        if (modalType) {
            e.stopPropagation();
        }

        dispatch(setOpenModal(modalType));
        setIsMoreBoxOpen(false);
    };

    /* 신고하기 */
    const handleReportClick = (e: React.MouseEvent) => {
        if (chatEnterData?.memberId) {
            handleModalChange(e, 'report');
        }
    };

    /* 매너 평가하기 */
    const handleMannerClick = (e: React.MouseEvent) => {
        if (chatEnterData?.memberId) {
            handleModalChange(e, 'manner');
        }
    };

    /* 비매너 평가하기 */
    const handleBadMannerClick = (e: React.MouseEvent) => {
        if (chatEnterData?.memberId) {
            handleModalChange(e, 'badManner');
        }
    };

    /* 더보기 버튼 */
    const menuItems: MoreBoxMenuItems[] = chatEnterData?.blind
        ? [{ text: '채팅방 나가기', onClick: (e: React.MouseEvent) => handleModalChange(e, 'leave') }]
        : [
            { text: '채팅방 나가기', onClick: (e: React.MouseEvent) => handleModalChange(e, 'leave') },
            // 친구 추가 조건: 친구가 아니고, 친구 요청도 하지 않은 경우
            !chatEnterData?.friend && chatEnterData?.friendRequestMemberId !== isUser.id &&
            { text: '친구 추가', onClick: handleFriendAdd },
            // 친구 취소 조건: 친구인 경우
            chatEnterData?.friend &&
            { text: '친구 삭제', onClick: handleFriendDelete },
            // 친구 요청 취소 조건: 친구가 아니고, 친구 요청을 이미 한 경우
            !chatEnterData?.friend && chatEnterData?.friendRequestMemberId === isUser.id &&
            { text: '친구 요청 취소', onClick: handleCancelFriendReq },

            { text: '차단하기', onClick: (e: React.MouseEvent) => handleModalChange(e, 'block') },
            { text: '신고하기', onClick: () => chatEnterData?.memberId && handleReportClick },
            { text: '매너 평가', onClick: () => chatEnterData?.memberId && handleMannerClick },
            { text: '비매너 평가', onClick: () => chatEnterData?.memberId && handleBadMannerClick },
        ].filter(item => item) as MoreBoxMenuItems[];

    /* 더보기 버튼 외부 클릭 시 닫힘 */
    const handleOutsideModalClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        if (isMoreBoxOpen) {
            setIsMoreBoxOpen(false);
        }
        setIsEditMode(false);
    };

    const isMannerEditable = isMannerValue?.isExist && !isEditMode && isMannerValue?.mannerRatingKeywordList.length !== 0;
    const isBadMannerEditable = isBadMannerValue?.isExist && !isEditMode && isBadMannerValue?.mannerRatingKeywordList.length !== 0;

    return (
        <>
            <Overlay>
                {isChatRoomOpen && chatEnterData && isChatUuid !== null &&
                    <Wrapper onClick={handleOutsideModalClick}>
                        <MessageHeader
                            isMoreBoxOpen={isMoreBoxOpen}
                            chatEnterData={chatEnterData}
                            onMoreBoxOpen={handleMoreBoxOpen}
                            menuItems={menuItems} />
                        <MessageList
                            chatEnterData={chatEnterData}
                            systemMessage={systemMessage}
                            onMannerValuesGet={handleMannerValuesGet}
                            onBadMannerValuesGet={handleBadMannerValuesGet}
                        />
                        <MessageInput
                            message={message}
                            setMessage={setMessage}
                            sendMessage={sendMessage}
                            chatEnterData={chatEnterData}
                        />
                    </Wrapper>
                }
            </Overlay>

            {/* 채팅창 나가기 팝업 */}
            {isModalType === 'leave' && chatEnterData &&
                <ConfirmModal
                    width="540px"
                    primaryButtonText="취소"
                    secondaryButtonText="나가기"
                    onPrimaryClick={handleModalClose}
                    onSecondaryClick={handleChatLeave}
                >
                    {!!chatEnterData.friend || !!chatEnterData.blind ? (
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
            {isModalType === 'block' &&
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
            {isModalType === 'doneBlock' && (
                <ConfirmModal
                    width="540px"
                    primaryButtonText="확인"
                    onPrimaryClick={handleChatLeave}
                >
                    <MsgConfirm>{`차단이 완료되었습니다.`}</MsgConfirm>
                </ConfirmModal>
            )}

            {/* 신고하기 팝업 */}
            {isModalType === 'report' &&
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
            {isModalType === 'manner' && isMannerValue && (
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
                                isChecked={checkedMannerItems?.includes(data.id)}
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
            {isModalType === 'badManner' && isBadMannerValue && (
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
                                isChecked={checkedBadMannerItems?.includes(data.id)}
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

export default ChatLayout;

const Overlay = styled.div`
    position:fixed;
    top: 50%;
    right: 8%;
    transform: translate(0, -50%);
    z-index: 1;
`;

const Wrapper = styled.div`
    position: relative;
    background: ${theme.colors.purple400};
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    width: 418px;
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

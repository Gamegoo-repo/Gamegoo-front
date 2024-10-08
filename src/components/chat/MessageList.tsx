import styled, { keyframes } from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Chat, DesignedSystemMessage, ChatMessageDto } from "@/interface/chat";
import { useDispatch, useSelector } from "react-redux";
import { setCloseMannerStatusModal, setOpenMannerStatusModal, setOpenReadingModal } from "@/redux/slices/modalSlice";
import { RootState } from "@/redux/store";
import ReadBoard from "../readBoard/ReadBoard";
import { getChatList } from "@/api/chat";
import useChatMessage from "@/hooks/useChatMessage";
import dayjs from 'dayjs';
import { setChatDateFormatter, setChatTimeFormatter } from "@/utils/custom";
import { getProfileBgColor } from "@/utils/profile";
import ConfirmModal from "../common/ConfirmModal";
import { socket } from "@/socket";
import { useRouter } from "next/navigation";
import { closeChat } from "@/redux/slices/chatSlice";

interface MessageListProps {
    chatEnterData: Chat;
    systemMessage: DesignedSystemMessage | undefined;
    onMannerValuesGet: (memberId: number) => void;
    onBadMannerValuesGet: (memberId: number) => void;
}

interface SystemMessageProps {
    message: string;
    onClick?: () => void;
}

const MessageList = (props: MessageListProps) => {
    const { chatEnterData, systemMessage, onMannerValuesGet, onBadMannerValuesGet } = props;

    const dispatch = useDispatch();

    const [messageList, setMessageList] = useState<ChatMessageDto[]>(chatEnterData?.chatMessageList.chatMessageDtoList || []);
    const [isLoading, setIsLoading] = useState(false);
    const [cursor, setCursor] = useState<number | null>(chatEnterData?.chatMessageList.has_next ? chatEnterData.chatMessageList.next_cursor : null);
    const [hasMore, setHasMore] = useState<boolean>(chatEnterData?.chatMessageList.has_next);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isBoardId, setIsBoardId] = useState(0);
    const [isSystemMessageShown, setIsSystemMessageShown] = useState(false);
    const [isUnregisterAlert, setIsUnregisterAlert] = useState(false);
    const [isBlockedAlert, setIsBlockedAlert] = useState(false);
    const [mannerSystemMessage, setMannerSystemMessage] = useState(false);
    const [isFeedbackDateVisible, setIsFeedbackDateVisible] = useState(false);
    const [isFeedbackDate, setIsFeedbackDate] = useState<string>("");

    const chatRef = useRef<HTMLDivElement>(null);
    const isReadingModal = useSelector((state: RootState) => state.modal.readingModal);
    const isFeedbackModalOpen = useSelector((state: RootState) => state.modal.isOpen);

    const router = useRouter();

    const { newMessage } = useChatMessage();

    /* 매너 시스템 소켓 이벤트 리스닝 */
    useEffect(() => {
        const handleMannerSystemMessage = () => {
            setMannerSystemMessage(true);
        };

        if (socket) {
            socket.on('manner-system-message', handleMannerSystemMessage);
        }

        return () => {
            if (socket) {
                socket.off('manner-system-message', handleMannerSystemMessage);
            }
        };
    }, []);

    /* 시스템 메시지 클릭 시 다음 스텝 */
    const handlePostOpen = (boardId: number) => {
        if (chatEnterData.blind || chatEnterData.blocked) {
            setIsUnregisterAlert(true);
            setIsBlockedAlert(true);
        } else {
            dispatch(setOpenReadingModal());
            setIsBoardId(boardId);
        }
    };

    /* 게시글 이동 클릭시 탈퇴회원, 차단회원 알럿 3초후 사라짐 */
    useEffect(() => {
        let timer: any;
        if (isUnregisterAlert || isBlockedAlert) {
            timer = setTimeout(() => {
                setIsUnregisterAlert(false);
                setIsBlockedAlert(false);
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [isUnregisterAlert, isBlockedAlert]);

    /* 새로운 메시지 전에 시스템 메시지 보여주기 */
    useEffect(() => {
        if (newMessage) {
            setMessageList((prevMessages) => {
                let updatedMessages = [...prevMessages];

                if (systemMessage && !isSystemMessageShown) {
                    // 기존 시스템 메시지와, 새로운 시스템 메시지 타입이 달라서, 타입 같게 변경
                    const systemMessageAsChatMessage: ChatMessageDto = {
                        ...systemMessage,
                        createdAt: new Date().toISOString(),
                        timestamp: new Date().getTime(),
                    };
                    updatedMessages.push(systemMessageAsChatMessage);
                }

                return updatedMessages;
            });

            if (!isSystemMessageShown) {
                setIsSystemMessageShown(true);
            }
        }
    }, [newMessage, systemMessage]);

    /* 처음 채팅방 들어올 때 마지막 메시지로 스크롤 이동 */
    useEffect(() => {
        if (chatRef.current && isInitialLoading) {
            const chatElement = chatRef.current;
            chatElement.scrollTop = chatElement.scrollHeight;
            setIsInitialLoading(false);
        }
    }, [chatRef, messageList, isInitialLoading]);

    const handleScroll = useCallback(() => {
        if (chatRef.current && !isInitialLoading) {
            const { scrollTop } = chatRef.current;
            if (scrollTop === 0 && hasMore && !isLoading) {
                getMoreMessages();
            }
        }
    }, [chatRef, hasMore, isLoading, isInitialLoading]);

    useEffect(() => {
        const chatElement = chatRef.current;
        if (chatElement) {
            chatElement.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (chatElement) {
                chatElement.removeEventListener('scroll', handleScroll);
            }
        };
    }, [chatRef, handleScroll]);

    /* 새로운 메시지 입력 또는 새로운 메시지 입력 시 스크롤을 맨 아래로 이동시키는 함수 */
    const scrollToBottom = useCallback(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [chatRef]);

    useEffect(() => {
        if (newMessage) {
            setMessageList((prevMessages) => [...prevMessages, newMessage]);

            requestAnimationFrame(() => {
                scrollToBottom();
            });
        }
    }, [newMessage, scrollToBottom]);

    /* 남은 메시지 보여주기(페이징) */
    const getMoreMessages = useCallback(async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        try {
            const chatElement = chatRef.current;
            if (!chatElement) return;

            // 현재 스크롤 위치와 전체 높이 저장
            const previousScrollTop = chatElement.scrollTop;
            const previousScrollHeight = chatElement.scrollHeight;

            const data = await getChatList(chatEnterData.uuid, cursor);
            const { chatMessageDtoList, next_cursor, has_next } = data.result;

            // 기존 메시지 목록에 새로운 메시지 추가
            setMessageList((prevMessages) => [
                ...chatMessageDtoList,
                ...prevMessages
            ]);

            setCursor(next_cursor);
            setHasMore(has_next);

            requestAnimationFrame(() => {
                // 새로운 메시지가 추가된 후의 스크롤 높이 차이 계산
                const newScrollHeight = chatElement.scrollHeight;
                const scrollDifference = newScrollHeight - previousScrollHeight;

                // 스크롤 위치를 기존 위치에서 중간 지점으로 이동 (새로운 메시지가 들어올 때 자연스럽게 스크롤 이동하기 위해서)
                chatElement.scrollTop = previousScrollTop + scrollDifference;
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, hasMore, cursor, chatEnterData]);

    /* 채팅 날짜 표시 */
    const handleDisplayDate = (messages: ChatMessageDto[], index: number): boolean => {
        if (index === 0) return true;

        const currentDate = dayjs(messages[index].createdAt).format('YYYY-M-D');
        const previousDate = dayjs(messages[index - 1].createdAt).format('YYYY-M-D');

        return currentDate !== previousDate;
    };

    /* 프로필 이미지 표시 (상대방만 보여주기, 같은 시간에 온 경우 첫번째 메시지만 이미지 표시F) */
    const handleDisplayProfileImage = (messages: ChatMessageDto[], index: number): boolean => {
        if (index === 0) return true;

        const currentSenderId = messages[index].senderId;
        const previousSenderId = messages[index - 1].senderId;

        const currentTime = dayjs(messages[index].createdAt).format('A hh:mm');
        const previousTime = dayjs(messages[index - 1].createdAt).format('A hh:mm');

        // 보낸 사람이 다르거나, 시간이 다르면 프로필 이미지를 표시
        if (currentSenderId !== previousSenderId || currentTime !== previousTime) {
            return true;
        }

        return false;
    };

    /* 메시지 시간 표시 (마지막 메시지에만 시간 표시, 상대방 메시지 중간에 오면 다시 표시) */
    const handleDisplayTime = (messages: ChatMessageDto[], index: number): boolean => {
        if (index === messages.length - 1) return true;

        const currentTime = dayjs(messages[index].createdAt).format('A hh:mm');
        const nextTime = dayjs(messages[index + 1].createdAt).format('A hh:mm');

        const isSameTime = currentTime === nextTime;
        const isSameSender = messages[index].senderId === messages[index + 1].senderId;

        // 시간이 같고, 보낸 사람도 같으면 마지막 메시지에만 시간 표시
        if (isSameTime && isSameSender) {
            return false;
        }

        return true;
    };

    /* 마지막 채팅을 보낸 후 1시간이 지난 시점에서 피드백 요청 표시 */
    useEffect(() => {
        const lastMessage = chatEnterData?.chatMessageList.chatMessageDtoList[chatEnterData.chatMessageList.chatMessageDtoList.length - 1];
        const feedbackTimestamp = dayjs(lastMessage?.createdAt).add(1, 'hour');
        const feedbackFullDate = dayjs(feedbackTimestamp).format('YYYY-MM-DDTHH:mm:ss');

        const feedbackDate = dayjs(feedbackTimestamp).format('YYYY-M-D');
        const lastMessageDate = dayjs(lastMessage?.createdAt).format('YYYY-M-D');

        setIsFeedbackDate(feedbackFullDate);

        if (feedbackDate !== lastMessageDate) {
            setIsFeedbackDateVisible(true);
        }
    }, [messageList]);

    /* 매칭 성공후 매너/비매너 평가 버튼 클릭 시, 기존 매너/비매너 평가 내역 조회하기 */
    const handleMannerEvaluate = () => {
        if (chatEnterData) {
            dispatch(setOpenMannerStatusModal());
            onMannerValuesGet(chatEnterData.memberId);
            onBadMannerValuesGet(chatEnterData.memberId);
        }
    };

    const handleMoveProfile = (memberId: number) => {
        router.push(`/user/${memberId}`);
        // dispatch(closeChat());
    };

    /* 시스템 메시지를 처리하는 컴포넌트 */
    const SystemMessage = (props: SystemMessageProps) => {
        const { message, onClick } = props;

        const highlightedText = "게시한 글";
        const parts = message.split(highlightedText);

        return (
            <SystemMessageContainer>
                {parts.length > 1 ? (
                    <>
                        {parts[0]}
                        <UnderlinedText onClick={onClick}>{highlightedText}</UnderlinedText>
                        {parts[1]}
                    </>
                ) : (
                    message
                )}
            </SystemMessageContainer>
        );
    };

    return (
        <>
            {isReadingModal && <ReadBoard postId={isBoardId} />}
            {isUnregisterAlert || isBlockedAlert && (
                <ErrorBox>
                    {isUnregisterAlert ? '탈퇴한 회원의 글입니다.' : '차단한 회원의 글입니다.'}
                </ErrorBox>
            )}
            <ChatBorder>
                <ChatMain ref={chatRef}>
                    {messageList.map((message, index) => {
                        const showProfileImage = handleDisplayProfileImage(messageList, index);
                        const showTime = handleDisplayTime(messageList, index);

                        return (
                            <MsgContainer key={index}>
                                {handleDisplayDate(messageList, index) && <Timestamp>{setChatDateFormatter(message.createdAt)}</Timestamp>}
                                {message.systemType === 0 ? (
                                    <SystemMessage
                                        message={message.message}
                                        onClick={() => handlePostOpen(message.boardId as number)}
                                    />
                                ) : message.systemType === 1 ? (
                                    <>
                                        <FeedbackDiv>
                                            <FeedbackContainer>
                                                <Feedback>
                                                    <Text>매칭은 어떠셨나요?</Text>
                                                    <Text>상대방의 매너를 평가해주세요!</Text>
                                                    <SmileImage
                                                        src="/assets/icons/clicked_smile.svg"
                                                        width={22}
                                                        height={22}
                                                        alt="스마일 이모티콘" />
                                                    <StyledButton onClick={handleMannerEvaluate}>
                                                        매너평가 하기
                                                    </StyledButton>
                                                </Feedback>
                                            </FeedbackContainer>
                                        </FeedbackDiv>
                                    </>
                                ) : message.senderId === chatEnterData?.memberId ? (
                                    <YourMessageContainer>
                                        {showProfileImage && message.senderProfileImg && (
                                            <ImageWrapper $bgColor={getProfileBgColor(message.senderProfileImg)}>
                                                <ProfileImage
                                                onClick={()=>router.push(`/user/${chatEnterData.memberId}`)}
                                                    // onClick={() => handleMoveProfile(chatEnterData.memberId)}
                                                    data={`/assets/images/profile/profile${message.senderProfileImg}.svg`}
                                                    width={38}
                                                    height={38}
                                                />
                                            </ImageWrapper>
                                        )}
                                        <YourDiv $hasProfileImage={showProfileImage}>
                                            <YourMessage>{message.message}</YourMessage>
                                            {showTime ? <YourDate>{setChatTimeFormatter(message.createdAt)}</YourDate> : null}
                                        </YourDiv>
                                    </YourMessageContainer>
                                ) : (
                                    <MyMessageContainer>
                                        <MyDiv>
                                            {showTime ? <MyDate>{setChatTimeFormatter(message.createdAt)}</MyDate> : null}
                                            <MyMessage>{message.message}</MyMessage>
                                        </MyDiv>
                                    </MyMessageContainer>
                                )}
                            </MsgContainer>
                        )
                    })}
                    {isLoading && (
                        <LoadingContainer>
                            <LoadingSpinner />
                        </LoadingContainer>
                    )}
                    {isFeedbackModalOpen &&
                        <ConfirmModal
                            type="manner"
                            width="315px"
                            primaryButtonText="확인"
                            onPrimaryClick={() => dispatch(setCloseMannerStatusModal())} />
                    }
                </ChatMain>
            </ChatBorder >
        </>
    );
};

export default MessageList;

const ChatBorder = styled.div`
    padding: 0 12px;
`;

const ChatMain = styled.main`
    border-top: 1px solid #C1B7FF;
    padding: 10px 8px;
    height: 471px;
    overflow-y: auto;
    -ms-overflow-style: none;
    ::-webkit-scrollbar {
        display: none;
    }
    scrollbar-width: none;
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoadingSpinner = styled.div`
  border: 4px solid ${theme.colors.gray200};
  border-top: 4px solid ${theme.colors.purple100};
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
`;

const MsgContainer = styled.div``;

const Timestamp = styled.p`
    max-width: 79px;
    margin: 0 auto 10px;
    text-align: center;
    background: #000000A3;
    border-radius: 14px;
    padding: 4px 10px;
    ${(props) => props.theme.fonts.regular8};
    color: ${theme.colors.white}; 
`;

const YourMessageContainer = styled.div`
  display: flex;
  align-items: start;
  justify-content: flex-start;
  margin-bottom: 10px;
`;

const ImageWrapper = styled.div<{ $bgColor: string }>`
    position: relative;
    width: 47px;
    height: 47px;
    background: ${(props) => props.$bgColor};
    border-radius: 50%;
`;

const ProfileImage = styled.object`
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
`;

const YourDiv = styled.div<{ $hasProfileImage: boolean }>`
  display: flex;
  align-items: end;
  margin-left: ${(props) =>
        props.$hasProfileImage ? "11px" : "58.43px"};
`;

const YourMessage = styled.div`
  ${(props) => props.theme.fonts.regular14};
  color: ${theme.colors.gray600}; 
  background: ${theme.colors.white}; 
  border-radius: 13px;
  padding: 5px 13px;
  max-width: 229px;
  word-break:keep-all;
  overflow-wrap: break-word;
`;

const YourDate = styled.p`
  margin-left:9px;
  ${(props) => props.theme.fonts.regular8};
  color: ${theme.colors.gray700}; 
`;

const MyMessageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 10px;
`;

const MyDiv = styled.div`
  display: flex;
  align-items: end;
`;

const MyMessage = styled.div`
  ${(props) => props.theme.fonts.regular14};
  color: ${theme.colors.gray600}; 
  background: ${theme.colors.purple300}; 
  border-radius: 13px;
  padding: 5px 13px;
  max-width: 196px;
  word-break:keep-all;
  overflow-wrap: break-word;
`;

const MyDate = styled.p`
  margin-right:5px;
  ${(props) => props.theme.fonts.regular8};
  color: ${theme.colors.gray700}; 
`;

const SystemMessageContainer = styled.div`
    width: 100%;
    text-align: center;
    padding:11px 0px;
    background: #000000A3;
    ${(props) => props.theme.fonts.regular12};
    color: ${theme.colors.white}; 
    border-radius: 14px;
    margin-bottom: 11px;
`;

const UnderlinedText = styled.span`
  text-decoration: underline;
  cursor: pointer;
`;

const FeedbackDiv = styled.div`
  margin: 35px 0;
`;

const FeedbackContainer = styled.div``;

const Feedback = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 18px 15px 10px;
  background: ${theme.colors.white}; 
  border-radius: 13px;
`;

const SmileImage = styled(Image)`
  margin-top: 12px;
`;

const Text = styled.p`
  ${(props) => props.theme.fonts.regular14};
  color: ${theme.colors.gray600}; 
  &:first-child {
    margin-bottom: 5px;
    }
`;

const StyledButton = styled.button`
  width: 100%;
  border-radius: 53px;
  margin-top:12px;
  ${(props) => props.theme.fonts.semiBold12};
  background: ${theme.colors.purple100}; 
  color: ${theme.colors.white}; 
  padding: 10px 0;
`;

const ErrorBox = styled.div`
  position: absolute;
  top:50%;
  left:50%;
  transform: translate(-50%, -50%);
  padding: 10px 28px;
  ${(props) => props.theme.fonts.regular14};
  background: ${theme.colors.white};
  color: rgba(45, 45, 45, 1);
  box-shadow: 0px 0px 25.3px 0px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  white-space: nowrap;
`

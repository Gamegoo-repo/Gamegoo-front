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

interface MessageListProps {
    chatEnterData: Chat | undefined;
    systemMessage: DesignedSystemMessage | undefined;
}

interface SystemMessageProps {
    message: string;
    onClick?: () => void;
}

const MessageList = (props: MessageListProps) => {
    const { chatEnterData, systemMessage } = props;

    const dispatch = useDispatch();

    const [messageList, setMessageList] = useState<ChatMessageDto[]>(chatEnterData?.chatMessageList.chatMessageDtoList || []);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [cursor, setCursor] = useState<number | null>(chatEnterData?.chatMessageList.has_next ? chatEnterData.chatMessageList.next_cursor : null);
    const [hasNext, setHasNext] = useState<boolean>(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isBoardId, setIsBoardId] = useState(0);
    const [isSystemMessageShown, setIsSystemMessageShown] = useState(false);
    const [isFeedbackDateVisible, setIsFeedbackDateVisible] = useState(false);
    const [isFeedbackDate, setIsFeedbackDate] = useState<string>("");

    const chatRef = useRef<HTMLDivElement>(null);
    const isReadingModal = useSelector((state: RootState) => state.modal.readingModal);
    const isFeedbackModalOpen = useSelector((state: RootState) => state.modal.isOpen);

    const { newMessage } = useChatMessage();

    /* 새로운 메시지 전에 시스템 메시지 보여주기 */
    useEffect(() => {
        if (newMessage) {
            setMessageList((prevMessages) => {
                let updatedMessages = [...prevMessages];

                if (systemMessage && !isSystemMessageShown) {
                    // systemMessage가 있을 때만 처리
                    const systemMessageAsChatMessage: ChatMessageDto = {
                        ...systemMessage,
                        createdAt: new Date().toISOString(),
                        timestamp: new Date().getTime(),
                    };
                    updatedMessages.push(systemMessageAsChatMessage);
                }

                // 새로운 메시지 추가
                updatedMessages.push(newMessage);

                return updatedMessages;
            });

            if (!isSystemMessageShown) {
                setIsSystemMessageShown(true);
            }
        }
    }, [newMessage, systemMessage]);

    /* 채팅 데이터 로딩 처리 */
    useEffect(() => {
        if (chatEnterData) {
            const chatMessages = chatEnterData.chatMessageList.chatMessageDtoList;

            if (chatMessages.length > 0) {
                // 메시지 있는 경우
                setMessageList(chatMessages);
                setIsLoading(false);
            } else {
                // 메시지 없는 경우, 로딩을 멈추고 빈 화면을 보여줌
                setIsLoading(false);
            }
        } else {
            // 아직 데이터가 없을 경우 로딩 중
            setIsLoading(true);
        }
    }, [chatEnterData]);

    /* 게시글 열기 */
    const handlePostOpen = (id: number) => {
        dispatch(setOpenReadingModal());
        setIsBoardId(id);
    };

    /* 마지막 메시지로 스크롤 */
    useEffect(() => {
        if (chatRef.current && isInitialLoading) {
            const chatElement = chatRef.current;
            chatElement.scrollTop = chatElement.scrollHeight;
            setIsInitialLoading(false);
        }
    }, [chatRef, messageList, isInitialLoading]);

    /* 스크롤 시 메시지 추가로 보여주기 */
    const getMoreMessages = useCallback(async () => {
        if (!hasNext || !cursor || !chatEnterData?.uuid) return;

        setIsLoading(true);
        try {
            const data = await getChatList(chatEnterData.uuid, cursor);
            const { chatMessageDtoList, next_cursor, has_next } = data.result;

            // 메시지를 기존 목록에 추가
            setMessageList((prevMessages) => [...chatMessageDtoList, ...prevMessages]);
            setCursor(next_cursor);
            setHasNext(has_next);
        } catch (error) {
            console.error("메시지 조회 실패:", error);
        } finally {
            setIsLoading(false);
        }
    }, [cursor, hasNext, chatEnterData?.uuid]);

    /* 스크롤 이벤트 처리 */
    const handleScroll = useCallback(() => {
        if (chatRef.current && chatRef.current.scrollTop === 0 && hasNext && !isLoading) {
            getMoreMessages();
        }
    }, [chatRef, hasNext, isLoading, getMoreMessages]);

    useEffect(() => {
        const chatElement = chatRef.current;
        if (chatElement) {
            chatElement.addEventListener("scroll", handleScroll);
        }
        return () => {
            if (chatElement) {
                chatElement.removeEventListener("scroll", handleScroll);
            }
        };
    }, [handleScroll]);

    /* 채팅 날짜 표시 */
    const handleDisplayDate = (messages: ChatMessageDto[], index: number): boolean => {
        if (index === 0) return true;

        const currentDate = dayjs(messages[index].createdAt).format('YYYY-M-D');
        const previousDate = dayjs(messages[index - 1].createdAt).format('YYYY-M-D');

        return currentDate !== previousDate;
    };

    /* 프로필 이미지 표시 (상대방만 보여주기) */
    const handleDisplayProfileImage = (messages: ChatMessageDto[], index: number): boolean => {
        if (index === 0) return true;

        return messages[index].senderId === chatEnterData?.memberId;
    };

    /* 채팅 시간 */
    const handleDisplayTime = (messages: ChatMessageDto[], index: number): boolean => {
        if (index === messages.length - 1) return true;

        const currentTime = dayjs(messages[index].createdAt).format('A hh:mm');
        const nextTime = dayjs(messages[index + 1].createdAt).format('A hh:mm');

        const isSameTime = currentTime === nextTime;
        const isSameSender = messages[index].senderId === messages[index + 1].senderId;

        // 시간이 같고, 보낸 사람도 같으면 마지막 메시지에만 시간 표시
        if (isSameTime && isSameSender) {
            return false; // 시간을 표시하지 않음
        }

        // 시간이 다르거나, 보낸 사람이 다르면 현재 메시지에 시간을 표시
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
            <ChatBorder>
                <ChatMain ref={chatRef}>
                    {/* {isLoading ? (
                        <LoadingContainer>
                            <LoadingSpinner />
                        </LoadingContainer>
                    ) : (
                        messageList?.map((message, index) => (
                            <MessageItem
                                key={index}
                                message={message}
                                messageList={messageList}
                                index={index}
                                chatRef={chatRef}
                                chatEnterData={chatEnterData}
                                onPostOpen={handlePostOpen}
                                showDate={handleDisplayDate(messageList, index)}
                                showProfileImage={handleDisplayProfileImage(messageList, index)}
                                showTime={handleDisplayTime(messageList, index)}
                            />
                           
                        ))
                    )} */}
                    {messageList.map((message, index) => {
                        const hasProfileImage = handleDisplayProfileImage(messageList, index);
                        const showTime = handleDisplayTime(messageList, index);
                        return (
                            <MsgContainer key={index}>
                                {handleDisplayDate(messageList, index) && <Timestamp>{setChatDateFormatter(message.createdAt)}</Timestamp>}
                                {message.systemType === 0 ? (
                                    <SystemMessage
                                        message={message.message}
                                        onClick={message.boardId ? () => handlePostOpen(message.boardId as number) : undefined}
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
                                                    <StyledButton onClick={() => dispatch(setOpenMannerStatusModal())}>
                                                        매너평가 하기
                                                    </StyledButton>
                                                </Feedback>
                                            </FeedbackContainer>
                                            {/* <FeedbackTime>{setChatTimeFormatter(isFeedbackDate)}</FeedbackTime> */}
                                        </FeedbackDiv>
                                    </>
                                ) : message.senderId === chatEnterData?.memberId ? (
                                    <YourMessageContainer>
                                        {handleDisplayProfileImage(messageList, index) && message.senderProfileImg && (
                                            <ImageWrapper $bgColor={getProfileBgColor(message.senderProfileImg)}>
                                                <ProfileImage
                                                    src={`/assets/images/profile/profile${message.senderProfileImg}.svg`}
                                                    width={38}
                                                    height={38}
                                                    alt="프로필 이미지"
                                                />
                                            </ImageWrapper>
                                        )}
                                        <YourDiv $hasProfileImage={hasProfileImage}>
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
            </ChatBorder>
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
  align-items: center;
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

const ProfileImage = styled(Image)`
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
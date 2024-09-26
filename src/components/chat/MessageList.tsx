import styled, { keyframes } from "styled-components";
import { theme } from "@/styles/theme";
import { useCallback, useEffect, useRef, useState } from "react";
import { Chat, DesignedSystemMessage, ChatMessageDto } from "@/interface/chat";
import MessageItem from "./MessageItem";
import { useDispatch, useSelector } from "react-redux";
import { setOpenReadingModal } from "@/redux/slices/modalSlice";
import { RootState } from "@/redux/store";
import ReadBoard from "../readBoard/ReadBoard";
import { getChatList } from "@/api/chat";
import useChatMessage from "@/hooks/useChatMessage";
import dayjs from 'dayjs';

interface MessageListProps {
    chatEnterData: Chat | undefined;
    systemMessage: DesignedSystemMessage | undefined;
}

const MessageList = (props: MessageListProps) => {
    const { chatEnterData, systemMessage } = props;

    const dispatch = useDispatch();

    const [messageList, setMessageList] = useState<ChatMessageDto[]>(chatEnterData?.chatMessageList.chatMessageDtoList || []);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [cursor, setCursor] = useState<number | null>(chatEnterData?.chatMessageList.has_next ? chatEnterData.chatMessageList.next_cursor : null);
    const [hasMore, setHasMore] = useState<boolean>(chatEnterData?.chatMessageList.has_next || false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isBoardId, setIsBoardId] = useState(0);
    const [isSystemMessageShown, setIsSystemMessageShown] = useState(false);
    const [isFeedbackDateVisible, setIsFeedbackDateVisible] = useState(false);
    const [isFeedbackDate, setIsFeedbackDate] = useState<string>("");

    const chatRef = useRef<HTMLDivElement>(null);
    const isReadingModal = useSelector((state: RootState) => state.modal.readingModal);

    const { newMessage } = useChatMessage();

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

                // 새로운 메시지 추가
                updatedMessages.push(newMessage);

                return updatedMessages;
            });

            if (!isSystemMessageShown) {
                setIsSystemMessageShown(true);
            }
        }
    }, [newMessage, systemMessage]);

    /* 채팅 데이터를 로딩 처리 */
    useEffect(() => {
        if (chatEnterData) {
            const chatMessages = chatEnterData.chatMessageList.chatMessageDtoList;

            if (chatMessages.length > 0) {
                // 메시지가 있는 경우
                setMessageList(chatMessages);
                setIsLoading(false);  // 데이터가 들어오면 로딩을 멈춤
            } else {
                // 메시지가 없는 경우, 로딩을 멈추고 빈 화면을 보여줌
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

    /* 남은 메시지 보여주기 */
    const getMoreMessages = useCallback(async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        try {
            const chatElement = chatRef.current;
            if (!chatElement || !chatEnterData) return;

            const previousScrollTop = chatElement.scrollTop;
            const previousScrollHeight = chatElement.scrollHeight;

            const data = await getChatList(chatEnterData.uuid, cursor);
            const { chatMessageDtoList, next_cursor, has_next } = data.result;

            setMessageList((prevMessages) => [...chatMessageDtoList, ...prevMessages]);
            setCursor(next_cursor);
            setHasMore(has_next);

            requestAnimationFrame(() => {
                const newScrollHeight = chatElement.scrollHeight;
                const scrollDifference = newScrollHeight - previousScrollHeight;
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

    return (
        <>
            {isReadingModal && <ReadBoard postId={isBoardId} />}
            <ChatBorder>
                <ChatMain ref={chatRef}>
                    {isLoading ? (
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
                                showDate={handleDisplayDate(messageList, index)}  // 날짜 표시 함수 호출
                                showProfileImage={handleDisplayProfileImage(messageList, index)}  // 프로필 이미지 표시
                                showTime={handleDisplayTime(messageList, index)}  // 시간 표시
                            />
                        ))
                    )}
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
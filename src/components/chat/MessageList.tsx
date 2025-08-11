import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import styled, { keyframes } from "styled-components";

import { getChatList, markChatAsRead } from "@/api";
import { useChatMessage, useConfirmModalContext } from "@/hooks";
import { closeChat, closeChatRoom } from "@/redux/slices/chatSlice";
import {
  setCloseMannerStatusModal,
  setOpenMannerStatusModal,
  setOpenReadingModal,
} from "@/redux/slices/modalSlice";
import { theme } from "@/styles/theme";
import { setChatDateFormatter } from "@/utils";

import DateSeparator from "../common/MessageList/DateSeparator";
import ErrorAlert from "../common/MessageList/ErrorAlert";
import FeedbackMessage from "../common/MessageList/FeedbackMessage";
import { useDisplayHelpers } from "../common/MessageList/hooks/useDisplayHelpers";
import { useScrollToBottomOnInit } from "../common/MessageList/hooks/useScrollToBottomOnInit";
import { useInfiniteScrollTop } from "../common/MessageList/hooks/useScrollToTopPagination";
import MyMessage from "../common/MessageList/MyMessage";
import SystemMessage from "../common/MessageList/SystemMessage";
import YourMessage from "../common/MessageList/YourMessage";
import { ReadBoard } from "../readBoard";

import type { RootState } from "@/redux/store";
import type { Chat, ChatMessageDto, DesignedSystemMessage } from "@/types";

interface MessageListProps {
  chatEnterData: Chat;
  systemMessage: DesignedSystemMessage | undefined;
  onMannerValuesGet: (memberId: number) => void;
  onBadMannerValuesGet: (memberId: number) => void;
}

const MessageList = (props: MessageListProps) => {
  const {
    chatEnterData,
    systemMessage,
    onMannerValuesGet,
    onBadMannerValuesGet,
  } = props;

  const { handleDisplayDate, handleDisplayTime, handleDisplayProfileImage } =
    useDisplayHelpers();
  const dispatch = useDispatch();
  const { openConfirmModal } = useConfirmModalContext();

  const [messageList, setMessageList] = useState<ChatMessageDto[]>(
    chatEnterData?.chatMessageListResponse.chatMessageList || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [cursor, setCursor] = useState<number | null>(
    chatEnterData?.chatMessageListResponse.hasNext
      ? chatEnterData.chatMessageListResponse.nextCursor
      : null
  );
  const [hasMore, setHasMore] = useState<boolean>(
    chatEnterData?.chatMessageListResponse.hasNext
  );
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isBoardId, setIsBoardId] = useState(0);
  const [isSystemMessageShown, setIsSystemMessageShown] = useState(false);
  const [isUnregisterAlert, setIsUnregisterAlert] = useState(false);
  const [isBlockedAlert, setIsBlockedAlert] = useState(false);
  const [isMyMsgSent, setIsMyMsgSent] = useState(false);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);

  const chatRef = useRef<HTMLDivElement>(null);
  const isReadingModal = useSelector(
    (state: RootState) => state.modal.readingModal
  );
  const isFeedbackModalOpen = useSelector(
    (state: RootState) => state.modal.mannerStatusModal
  );
  const currentChatUuid = useSelector(
    (state: RootState) => state.chat.currentChatUuid
  );

  const router = useRouter();
  const { newMessage, mannerSystemMessage } = useChatMessage();

  /* 매너 시스템 소켓 이벤트 리스닝 */
  useEffect(
    () => {
      if (chatEnterData.uuid !== currentChatUuid) return;

      if (mannerSystemMessage) {
        const chatroomUuid = mannerSystemMessage?.chatroomUuid;
        const newChatTimestamp = mannerSystemMessage.timestamp;
        setMessageList((prevMessages) => {
          const feedbackMessage: ChatMessageDto = {
            senderId: 0,
            senderName: null,
            message: "",
            createdAt: new Date().toISOString(),
            systemType: 1,
            timestamp: new Date().getTime(),
            boardId: null,
            senderProfileImg: null,
          };

          return [...prevMessages, feedbackMessage];
        });

        /* 현재 보고 있는 채팅방 읽음 처리 */
        if (currentChatUuid && chatroomUuid === currentChatUuid) {
          markChatAsRead({
            uuid: currentChatUuid,
            timestamp: newChatTimestamp,
          });
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mannerSystemMessage]
  );

  /* 새로운 메시지 전에 시스템 메시지 보여주기 */
  useEffect(
    () => {
      if (chatEnterData.uuid !== currentChatUuid) return;

      if (chatEnterData.uuid === "guest") {
        setMessageList((prevMessages) => {
          if (systemMessage && !isSystemMessageShown) {
            const systemMessageAsChatMessage: ChatMessageDto = {
              ...systemMessage,
              createdAt: new Date().toISOString(),
              timestamp: new Date().getTime(),
            };
            // 시스템 메시지를 맨 앞에, 그 뒤에 이전 메시지들을 추가
            return [systemMessageAsChatMessage, ...prevMessages];
          }
          return prevMessages;
        });
      } else if (newMessage) {
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [newMessage, systemMessage]
  );

  /* 처음 채팅방 들어올 때 마지막 메시지로 스크롤 이동 */
  useScrollToBottomOnInit(chatRef, messageList, isInitialLoading, () => {
    setIsInitialLoading(false);
  });

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

      const data = await getChatList({ uuid: chatEnterData.uuid, cursor });

      const { chatMessageList, nextCursor, hasNext } = data.data;

      // 기존 메시지 목록에 새로운 메시지 추가
      setMessageList((prevMessages) => [...chatMessageList, ...prevMessages]);

      setCursor(nextCursor);
      setHasMore(hasNext);

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

  /* 무한 스크롤(위로) */
  useInfiniteScrollTop(
    chatRef,
    getMoreMessages,
    hasMore && !isLoading && !isInitialLoading
  );

  /* 새로운 메시지 입력 또는 새로운 메시지 입력 시 스크롤을 맨 아래로 이동시키는 함수 */
  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  /* newMessage가 업데이트 될 때마다 DOM 렌더링 후 스크롤 이동 */
  useLayoutEffect(() => {
    scrollToBottom();
  }, [messageList]);

  useEffect(() => {
    if (newMessage) {
      setMessageList((prevMessages) => [...prevMessages, newMessage]);
      setIsMyMsgSent(true);
    }
  }, [newMessage]);

  useEffect(() => {
    const handleResize = () => {
      setInnerHeight(window.innerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [innerHeight]);

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

  useEffect(
    () => {
      if (isFeedbackModalOpen) {
        openConfirmModal({
          type: "manner",
          width: "315px",
          primaryButtonText: "확인",
          onPrimaryClick: () => dispatch(setCloseMannerStatusModal()),
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isFeedbackModalOpen]
  );

  const handleMoveProfile = async (memberId: number) => {
    await router.push(`/user/${memberId}`);
    await dispatch(closeChat());
    await dispatch(closeChatRoom());
  };

  /* 매칭 성공후 매너/비매너 평가 버튼 클릭 시, 기존 매너/비매너 평가 내역 조회하기 */
  const handleMannerEvaluate = () => {
    if (chatEnterData) {
      dispatch(setOpenMannerStatusModal());
      onMannerValuesGet(chatEnterData.memberId);
      onBadMannerValuesGet(chatEnterData.memberId);
    }
  };

  return (
    <>
      {isReadingModal && !!isBoardId && <ReadBoard postId={isBoardId} />}
      {(isUnregisterAlert || isBlockedAlert) && (
        <ErrorAlert isUnregister={isUnregisterAlert} />
      )}
      <ChatBorder>
        {chatEnterData.uuid === currentChatUuid && (
          <ChatMain $innerHeight={innerHeight} ref={chatRef}>
            {messageList.map((message, index) => {
              const showProfileImage = handleDisplayProfileImage(
                messageList,
                index
              );
              const showTime = handleDisplayTime(messageList, index);
              const isLast = index === messageList.length - 1;

              return (
                <MsgContainer key={index}>
                  {handleDisplayDate(messageList, index) && (
                    <DateSeparator
                      date={setChatDateFormatter(message.createdAt)}
                    />
                  )}

                  {message.systemType === 5 && (
                    <FeedbackMessage onEvaluate={handleMannerEvaluate} />
                  )}

                  {message.systemType !== null && message.systemType !== 5 && (
                    <SystemMessage
                      message={message.message}
                      onClick={() => handlePostOpen(message.boardId as number)}
                    />
                  )}

                  {message.senderId === chatEnterData.memberId && (
                    <YourMessage
                      message={message}
                      showTime={showTime}
                      showProfileImage={showProfileImage}
                      onProfileClick={() =>
                        handleMoveProfile(chatEnterData.memberId)
                      }
                      isBlind={chatEnterData.blind}
                    />
                  )}

                  {message.senderId !== chatEnterData.memberId &&
                    message.senderId !== 0 && (
                      <MyMessage
                        message={message}
                        showTime={showTime}
                        isLast={isLast}
                        isAnimated={isMyMsgSent}
                      />
                    )}
                </MsgContainer>
              );
            })}

            {isLoading && (
              <LoadingContainer>
                <LoadingSpinner />
              </LoadingContainer>
            )}
          </ChatMain>
        )}
      </ChatBorder>
    </>
  );
};

export default MessageList;

const ChatBorder = styled.div`
  padding: 0 12px;
`;

const ChatMain = styled.main<{ $innerHeight: number }>`
  border-top: 1px solid ${theme.colors.violet300};
  padding: 10px 8px;
  height: 471px;
  overflow-y: auto;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 10px 8px 138px;
    height: calc(${(props) => props.$innerHeight}px - 54px - 71px);
    border-top: none;
  }
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
  border-top: 4px solid ${theme.colors.violet600};
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

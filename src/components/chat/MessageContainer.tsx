import styled, { keyframes } from 'styled-components';
import { theme } from "@/styles/theme";
import Image from 'next/image';
import dayjs from 'dayjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { setChatDateFormatter, setChatTimeFormatter } from '@/utils/custom';
import ConfirmModal from '../common/ConfirmModal';
import { useDispatch, useSelector } from 'react-redux';
import { setCloseMannerStatusModal, setOpenMannerStatusModal, setOpenReadingModal } from '@/redux/slices/modalSlice';
import { RootState } from '@/redux/store';
import { Chat, ChatMessageDto, DesignedSystemMessage } from '@/interface/chat';
import ReadBoard from '../readBoard/ReadBoard';
import { useRouter } from 'next/navigation';
import { getProfileBgColor } from '@/utils/profile';
import { getChatList } from '@/api/chat';
import useChatMessage from '@/hooks/useChatMessage';

interface MessageContainerProps {
  chatEnterData: Chat;
  chatRef: React.RefObject<HTMLDivElement>;
  systemMessage: DesignedSystemMessage;
}

interface SystemMessageProps {
  message: string;
  onClick?: () => void;
}

const MessageContainer = (props: MessageContainerProps) => {
  const { chatEnterData, chatRef, systemMessage } = props;

  const dispatch = useDispatch();
  const router = useRouter();

  const isFeedbackModalOpen = useSelector((state: RootState) => state.modal.isOpen);
  const isReadingModal = useSelector((state: RootState) => state.modal.readingModal);

  const [isFeedbackDateVisible, setIsFeedbackDateVisible] = useState(false);
  const [isFeedbackDate, setIsFeedbackDate] = useState("");
  const [isBoardId, setIsBoardId] = useState(0);
  const [messageList, setMessageList] = useState<ChatMessageDto[]>(chatEnterData.chatMessageList.chatMessageDtoList || []);
  const [cursor, setCursor] = useState<number | null>(chatEnterData.chatMessageList.has_next ? chatEnterData.chatMessageList.next_cursor : null);
  const [hasMore, setHasMore] = useState<boolean>(chatEnterData.chatMessageList.has_next);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSystemMessageShown, setIsSystemMessageShown] = useState(false);

  /* 새로운 메시지 실시간으로 받아옴 */
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
  }, [newMessage, systemMessage, isSystemMessageShown]);

  const handleMannerTypeClose = () => {
    dispatch(setCloseMannerStatusModal());
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
  }, [isLoading, hasMore, cursor, chatEnterData.uuid]);

  /* 채팅 날짜 */
  const handleDisplayDate = (messages: ChatMessageDto[], index: number): boolean => {
    if (index === 0) return true;

    const currentDate = dayjs(messages[index].createdAt).format('YYYY-M-D');
    const previousDate = dayjs(messages[index - 1].createdAt).format('YYYY-M-D');

    return currentDate !== previousDate;
  };

  /* 채팅 프로필 (상대방만 보여주기) */
  const handleDisplayProfileImage = (messages: ChatMessageDto[], index: number): boolean => {
    if (index === 0) return true;

    return messages[index].senderId === chatEnterData.memberId;
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

  /* 마지막 채팅을 보낸 날짜에서 1시간을 더했을 때, 마지막 보낸 채팅 날짜랑 피드백 날짜가 다를 때만 보여주기 */
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
  }, [messageList, chatEnterData.chatMessageList.chatMessageDtoList])

  /* 게시글 열기 */
  const handlePostOpen = (id: number) => {
    dispatch(setOpenReadingModal());
    setIsBoardId(id);
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
      {isReadingModal &&
        <ReadBoard postId={isBoardId} />
      }
      {messageList.map((data, index) => {
        const hasProfileImage = handleDisplayProfileImage(messageList, index);
        const showTime = handleDisplayTime(messageList, index);

        return (
          <MsgContainer
            key={index}>
            {handleDisplayDate(messageList, index) && (
              <Timestamp>{setChatDateFormatter(data.createdAt)}</Timestamp>
            )}
            {data.senderName === "SYSTEM" ? (
              <SystemMessage
                onClick={data.boardId ? () => handlePostOpen(data.boardId as number) : undefined}
                message={data.message} />
            ) :
              data.senderId === chatEnterData.memberId ? (
                <YourMessageContainer>
                  {handleDisplayProfileImage(messageList, index) && (
                    <>
                      <ImageWrapper $bgColor={getProfileBgColor(data.senderProfileImg)}>
                        <ProfileImage
                          onClick={() => router.push(`/user/${data.senderId}`)}
                          src={`/assets/images/profile/profile${data.senderProfileImg}.svg`}
                          width={38}
                          height={38}
                          alt="프로필 이미지" />
                      </ImageWrapper>
                    </>
                  )}
                  <YourDiv $hasProfileImage={hasProfileImage}>
                    <YourMessage>{data.message}</YourMessage>
                    {showTime ? <YourDate>{setChatTimeFormatter(data.createdAt)}</YourDate> : null}
                  </YourDiv>
                </YourMessageContainer>
              ) : (
                <MyMessageContainer>
                  <MyDiv>
                    {showTime ? <MyDate>{setChatTimeFormatter(data.createdAt)}</MyDate> : null}
                    <MyMessage>{data.message}</MyMessage>
                  </MyDiv>
                </MyMessageContainer>
              )
            }
          </MsgContainer>
        )
      })}

      {isLoading && (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      )}

      {/* {isFeedbackDateVisible &&
        <FeedbackDate className={isFeedbackDateVisible ? 'visibleDate' : 'invisibleDate'}>
          <Timestamp>{setChatDateFormatter(isFeedbackDate)}</Timestamp>
        </FeedbackDate>
      } */}
      <FeedbackDiv className={isFeedbackDateVisible ? 'visibleDate' : 'invisibleDate'}>
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

      {isFeedbackModalOpen &&
        <ConfirmModal
          type="manner"
          width="315px"
          primaryButtonText="확인"
          onPrimaryClick={handleMannerTypeClose} />
      }
    </>
  )
};

export default MessageContainer;

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

const FeedbackDate = styled.div`
    &.visibleDate{
    margin-top: 35px;
  }
  &.invisibleDate{
    margin-top: unset;
  }

`;
const FeedbackDiv = styled.div`
  margin-top: 35px;
  /* &.visibleDate{
    margin-top: 10px;
  }
  &.invisibleDate{
    margin-top: 35px;
  } */
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

const FeedbackTime = styled.p`
  margin-left:9px;
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
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// 로딩 스피너 스타일드 컴포넌트
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

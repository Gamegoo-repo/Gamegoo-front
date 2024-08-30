import styled from 'styled-components';
import { theme } from "@/styles/theme";
import Image from 'next/image';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { setChatDateFormatter, setChatTimeFormatter } from '@/utils/custom';
import ConfirmModal from '../common/ConfirmModal';
import { useDispatch, useSelector } from 'react-redux';
import { setCloseMannerStatusModal, setCloseModal, setCloseReadingModal, setOpenMannerStatusModal, setOpenReadingModal } from '@/redux/slices/modalSlice';
import { RootState } from '@/redux/store';
import { Chat, ChatMessageDto, ChatMessageList } from '@/interface/chat';
import ReadBoard from '../readBoard/ReadBoard';
import { useRouter } from 'next/navigation';
import { getProfileBgColor } from '@/utils/profile';
import { getChatList } from '@/api/chat';
import { socket } from '@/socket';

interface MessageContainerProps {
  chatEnterData: Chat;
}

interface SystemMessageProps {
  message: string;
  onClick?: () => void;
}

const MessageContainer = (props: MessageContainerProps) => {
  const { chatEnterData } = props;

  const dispatch = useDispatch();
  const router = useRouter();
  const chatRef = useRef<HTMLDivElement>(null);

  const isFeedbackModalOpen = useSelector((state: RootState) => state.modal.isOpen);
  const isReadingModal = useSelector((state: RootState) => state.modal.readingModal);

  const [messageList, setMessageList] = useState<ChatMessageDto[]>([]);
  const [messageData, setMessageData] = useState<ChatMessageList>();
  const [isFeedbackDateVisible, setIsFeedbackDateVisible] = useState(false);
  const [isFeedbackDate, setIsFeedbackDate] = useState("");
  const [isBoardId, setIsBoardId] = useState(0);
  const [cursor, setCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isAtBottom, setIsAtBottom] = useState<boolean>(false);

  const handleMannerTypeClose = () => {
    dispatch(setCloseMannerStatusModal());
  };

  useEffect(() => {
    const handleFetchChatData = async (cursor: number | null) => {
      const params = {
        uuid: chatEnterData.uuid,
        cursor: cursor
      };

      try {
        const data = await getChatList(params);
        const { chatMessageDtoList, next_cursor, has_next } = data.result;
        setMessageList((prevNotiList) => [
          ...prevNotiList,
          ...chatMessageDtoList,
        ]);
        setMessageData(data.result);
        setCursor(next_cursor);
        setHasMore(has_next);
      } catch (error) {
        console.error(error);
      }
    };

    handleFetchChatData(cursor);
  }, [chatEnterData])

  useEffect(() => {
    const handleScroll = () => {
      if (chatRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          chatRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 20) {
          setIsAtBottom(true);
        } else {
          setIsAtBottom(false);
        }
      }
    };

    if (chatRef.current) {
      chatRef.current.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (chatRef.current) {
        chatRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const handleDisplayDate = (messages: ChatMessageDto[], index: number): boolean => {
    if (index === 0) return true;

    const currentDate = dayjs(messages[index].createdAt).format('YYYY-M-D');
    const previousDate = dayjs(messages[index - 1].createdAt).format('YYYY-M-D');

    return currentDate !== previousDate;
  };

  const handleDisplayProfileImage = (messages: ChatMessageDto[], index: number): boolean => {
    if (index === 0) return true;

    return messages[index].senderId === chatEnterData.memberId;
  };

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
    const lastMessage = messageData?.chatMessageDtoList[messageData.chatMessageDtoList.length - 1];
    const feedbackTimestamp = dayjs(lastMessage?.createdAt).add(1, 'hour');
    const feedbackFullDate = dayjs(feedbackTimestamp).format('YYYY-MM-DDTHH:mm:ss');

    const feedbackDate = dayjs(feedbackTimestamp).format('YYYY-M-D');
    const lastMessageDate = dayjs(lastMessage?.createdAt).format('YYYY-M-D');

    setIsFeedbackDate(feedbackFullDate);

    if (feedbackDate !== lastMessageDate) {
      setIsFeedbackDateVisible(true);
    }
  }, [messageList])

  /* 게시글 열기 */
  const handlePostOpen = (id: number) => {
    dispatch(setOpenReadingModal());
    setIsBoardId(id);
  };

  /* 게시글 닫기 */
  const handlePostClose = () => {
    dispatch(setCloseReadingModal());
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
        <ReadBoard onClose={handlePostClose} postId={isBoardId} />
      }
      {messageData?.chatMessageDtoList.map((data, index) => {
        const hasProfileImage = handleDisplayProfileImage(messageData.chatMessageDtoList, index);
        const showTime = handleDisplayTime(messageData.chatMessageDtoList, index);

        return (
          <MsgContainer
            key={index}
            ref={chatRef}>
            {handleDisplayDate(messageData.chatMessageDtoList, index) && (
              <Timestamp>{setChatDateFormatter(data.createdAt)}</Timestamp>
            )}
            {data.senderName === "SYSTEM" ? (
              <SystemMessage
                onClick={data.boardId ? () => handlePostOpen(data.boardId as number) : undefined}
                message={data.message} />
            ) :
              data.senderId === chatEnterData.memberId ? (
                <YourMessageContainer>
                  {handleDisplayProfileImage(messageData.chatMessageDtoList, index) && (
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

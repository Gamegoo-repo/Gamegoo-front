import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";
import dayjs from 'dayjs';
import { Chat, ChatMessageDto } from "@/interface/chat";
import { getProfileBgColor } from "@/utils/profile";
import { setChatDateFormatter, setChatTimeFormatter } from "@/utils/custom";
import { useDispatch } from "react-redux";
import { setOpenMannerStatusModal } from "@/redux/slices/modalSlice";

interface MessageItemProps {
  message: ChatMessageDto;
  messageList: ChatMessageDto[];
  index: number;
  chatRef: React.RefObject<HTMLDivElement>;
  chatEnterData: Chat | undefined;
  onPostOpen: (id: number) => void;
  showDate: boolean;
  showProfileImage: boolean;
  showTime: boolean;
}

interface SystemMessageProps {
  message: string;
  onClick?: () => void;
}

const MessageItem = (props: MessageItemProps) => {
  const {
    message,
    messageList,
    index,
    chatEnterData,
    onPostOpen,
    showDate,
    showProfileImage,
    showTime,
  } = props;

  const dispatch = useDispatch();

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
    <MsgContainer>
      {showDate && <Timestamp>{setChatDateFormatter(message.createdAt)}</Timestamp>}
      {message.systemType === 0 ? (
        <SystemMessage
          message={message.message}
          onClick={message.boardId ? () => onPostOpen(message.boardId as number) : undefined}
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
          {showProfileImage && (
            <ImageWrapper $bgColor={getProfileBgColor(message.senderProfileImg)}>
              <ProfileImage
                src={`/assets/images/profile/profile${message.senderProfileImg}.svg`}
                width={38}
                height={38}
                alt="프로필 이미지"
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
  );
};

export default MessageItem;

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
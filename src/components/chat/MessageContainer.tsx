import styled from 'styled-components';
import { theme } from "@/styles/theme";
import Image from 'next/image';
import { setChatDateFormatter } from '@/utils/custom';

interface MessageInterface {
    user: string;
    msg: string;
    msgId: number;
    userId: number;
    date: string;
}
interface MessageContainerProps {
    messageList: MessageInterface[];
}

const MessageContainer = (props: MessageContainerProps) => {
    const { messageList } = props;
    console.log(messageList[0].date)


    return (
        <div>
            {messageList.map(message => {
                return (
                    <Container key={message.msgId}>
                        {message.user === "you" ? (
                            <YourMessageContainer>
                                <Image
                                    src="/assets/icons/gray_circle.svg"
                                    width={47.43}
                                    height={47.43}
                                    alt="프로필 이미지" />
                                <YourDiv>
                                    <YourMessage>{message.msg}</YourMessage>
                                    <YourDate>{setChatDateFormatter(message.date)}</YourDate>
                                </YourDiv>
                            </YourMessageContainer>
                        ) : (
                            <MyMessageContainer>
                                <MyDiv>
                                    <MyDate>{setChatDateFormatter(message.date)}</MyDate>
                                    <MyMessage>{message.msg}</MyMessage>
                                </MyDiv>
                            </MyMessageContainer>
                        )
                        }
                    </Container>
                )
            })}
            <FeedbackContainer>
                <Image
                    src="/assets/icons/gray_circle.svg"
                    width={47.43}
                    height={47.43}
                    alt="프로필 이미지" />
                <Feedback>
                    <Text>매칭은 어떠셨나요?</Text>
                    <Text>상대방의 매너를 평가해주세요!</Text>
                    <SmileImage
                        src="/assets/icons/clicked_smile.svg"
                        width={22}
                        height={22}
                        alt="스마일 이모티콘" />
                    <Button>
                        <p>매너평가 하기</p>
                    </Button>

                </Feedback>
            </FeedbackContainer>
        </div>
    )
};

export default MessageContainer;

const Container = styled.div``;

const YourMessageContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
  align-items: center;
`;

const YourDiv = styled.div`
  display: flex;
  align-items: end;
  margin-left: 11px;
`;

const YourMessage = styled.div`
  ${(props) => props.theme.fonts.regular14};
  color: ${theme.colors.gray600}; 
  background: ${theme.colors.black}; 
  border-radius: 13px;
  padding: 8px 0 8px 13px;
  max-width: 229px;
`;

const YourDate = styled.p`
  margin-left:9px;
  ${(props) => props.theme.fonts.regular8};
  color: ${theme.colors.gray700}; 
`;

const MyMessageContainer = styled.div`
  display: flex;
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
  padding: 8px;
  max-width: 196px;
`;

const MyDate = styled.p`
  margin-right:5px;
  ${(props) => props.theme.fonts.regular8};
  color: ${theme.colors.gray700}; 
`;

const FeedbackContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 35px;
`;

const Feedback = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 229px;
`;

const SmileImage = styled(Image)`
  margin-top: 12px;
`;

const Text = styled.p`
  &:first-child {
    margin-bottom: 8px;
    }
`;

const Button = styled.button`
  margin-top:12px;
`;

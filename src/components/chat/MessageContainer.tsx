import styled from 'styled-components';
import { theme } from "@/styles/theme";
import Image from 'next/image';
import { setChatDateFormatter } from '@/utils/custom';
import ChatDate from './ChatDate';
import dayjs from 'dayjs';
import { useState } from 'react';

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

    const handleDisplayDate = (messages: MessageInterface[], index: number): boolean => {
        if (index === 0) return true;

        const currentDate = dayjs(messages[index].date).format('YYYY-M-D');
        const previousDate = dayjs(messages[index - 1].date).format('YYYY-M-D');

        return currentDate !== previousDate;
    };

    const handleDisplayProfileImage = (messages: MessageInterface[], index: number): boolean => {
        if (index === 0) return true;

        return messages[index].userId !== messages[index - 1].userId;
    };

    const handleDisplayTime = (messages: MessageInterface[], index: number): boolean => {
        if (index === 0) return true;

        const currentTime = dayjs(messages[index].date).format('A h:m');
        const previousTime = dayjs(messages[index - 1].date).format('A h:m');

        const isSameTime = currentTime === previousTime;
        const isSameSender = messages[index].userId === messages[index - 1].userId;

        return !isSameTime || !isSameSender;
    };

    return (
        <>
            {messageList.map((message, index) => {
                const hasProfileImage = handleDisplayProfileImage(messageList, index);
                const showTime = handleDisplayTime(messageList, index);

                return (

                    <MsgContainer key={message.msgId}>
                        {handleDisplayDate(messageList, index) && (
                            <Timestamp>{dayjs(message.date).format('YYYY년 M월 D일')}</Timestamp>
                        )}
                        {message.user === "you" ? (
                            <YourMessageContainer>
                                {handleDisplayProfileImage(messageList, index) && (
                                    <ProfileImage
                                        src="/assets/icons/gray_circle.svg"
                                        width={47.43}
                                        height={47.43}
                                        alt="프로필 이미지" />
                                )}
                                <YourDiv $hasProfileImage={hasProfileImage}>
                                    <YourMessage>{message.msg}</YourMessage>
                                    {showTime && <YourDate>{dayjs(message.date).format('A h:m')}</YourDate>}
                                </YourDiv>
                            </YourMessageContainer>
                        ) : (
                            <MyMessageContainer>
                                <MyDiv>
                                    {showTime && <MyDate>{dayjs(message.date).format('A h:m')}</MyDate>}
                                    <MyMessage>{message.msg}</MyMessage>
                                </MyDiv>
                            </MyMessageContainer>
                        )
                        }
                    </MsgContainer>
                )
            })}
            <FeedbackDiv>
                <FeedbackContainer>
                    <ProfileImage
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
                            매너평가 하기
                        </Button>
                    </Feedback>
                </FeedbackContainer>
                <FeedbackDate>{setChatDateFormatter("2024-07-02 02:11")}</FeedbackDate>
            </FeedbackDiv>
        </>
    )
};

export default MessageContainer;

const Timestamp = styled.p`
    max-width: 79px;
    margin: 0 auto 10px auto;
    text-align: center;
    background: #000000A3;
    border-radius: 14px;
    padding: 4px 10px;
    ${(props) => props.theme.fonts.regular8};
    color: ${theme.colors.white}; 
`;
const MsgContainer = styled.div``;
const YourMessageContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
  align-items: center;
`;

const ProfileImage = styled(Image)`
    cursor: pointer;
`;

const YourDiv = styled.div<{ $hasProfileImage: boolean }>`
  display: flex;
  align-items: end;
  margin-left: ${(props) =>
        props.$hasProfileImage ? "11px" : "58.43px"}
`;

const YourMessage = styled.div`
  ${(props) => props.theme.fonts.regular14};
  color: ${theme.colors.gray600}; 
  background: ${theme.colors.white}; 
  border-radius: 13px;
  padding: 8px 13px;
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

const FeedbackDiv = styled.div`
  display: flex;
  align-items: end;
`;

const FeedbackContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 35px;
`;

const Feedback = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 229px;
  padding: 18px 15px 10px;
  background: ${theme.colors.white}; 
  border-radius: 13px;
  margin-left: 11px;
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

const Button = styled.button`
  width: 100%;
  border-radius: 53px;
  margin-top:12px;
  ${(props) => props.theme.fonts.semiBold12};
  background: ${theme.colors.purple100}; 
  color: ${theme.colors.white}; 
  padding: 10px 0;
`;

const FeedbackDate = styled.p`
  margin-left:9px;
  ${(props) => props.theme.fonts.regular8};
  color: ${theme.colors.gray700}; 
`;

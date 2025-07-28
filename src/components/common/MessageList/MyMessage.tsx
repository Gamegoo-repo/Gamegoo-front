import styled from "styled-components";

import { setChatTimeFormatter } from "@/utils";

import type { ChatMessageDto } from "@/types";

interface MyMessageProps {
  message: ChatMessageDto;
  showTime: boolean;
  isLast: boolean;
  isAnimated: boolean;
}

const MyMessage = ({
  message,
  showTime,
  isLast,
  isAnimated,
}: MyMessageProps) => (
  <MyMessageContainer>
    <MyDiv>
      {showTime && <MyDate>{setChatTimeFormatter(message.createdAt)}</MyDate>}
      <MyMessageBubble $animation={isAnimated} $isLast={isLast}>
        {message.message}
      </MyMessageBubble>
    </MyDiv>
  </MyMessageContainer>
);

export default MyMessage;

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

const MyMessageBubble = styled.div<{ $animation?: boolean; $isLast?: boolean }>`
  ${(props) => props.theme.fonts.regular14};
  color: ${(props) => props.theme.colors.gray800};
  background: ${(props) => props.theme.colors.violet300};
  border-radius: 13px;
  padding: 5px 13px;
  max-width: 196px;
  word-break: keep-all;
  overflow-wrap: break-word;
  transition: all 0.3s ease-in-out;
  ${({ $animation, $isLast }) =>
    $animation &&
    $isLast &&
    `
      animation: slideDown 0.3s ease-out;
    `}

  @keyframes slideDown {
    0% {
      margin-top: -3px;
      opacity: 0;
    }
    100% {
      margin-top: 0;
      opacity: 1;
    }
  }
`;

const MyDate = styled.p`
  margin-right: 5px;
  ${(props) => props.theme.fonts.regular8};
  color: ${(props) => props.theme.colors.gray700};
`;

"use client";

import { fadeIn, fadeOut, growShrink } from "@/styles/animation";
import { theme } from "@/styles/theme";
import { formatTime } from "@/utils/timeFormat";
import Image from "next/image";
import styled from "styled-components";

interface WaitingBoxProps {
  isMobile: boolean;
  textVisible: boolean;
  currentMessage: string;
  timeLeft: number;
}

const WaitingBox = ({
  isMobile,
  textVisible,
  currentMessage,
  timeLeft,
}: WaitingBoxProps) => {
  return (
    <Waiting>
      <AnimatedImage
        src="/assets/images/wait_heart.svg"
        width={!isMobile ? 225 : 120}
        height={!isMobile ? 225 : 120}
        alt="heart"
      />
      <AnimatedText $visible={textVisible}>{currentMessage}</AnimatedText>
      <Time>
        <Span>{formatTime(timeLeft)}&nbsp;</Span>/ 5:00
      </Time>
    </Waiting>
  );
};

export default WaitingBox;

const Waiting = styled.div`
  width: 100%;
  height: 580px;
  border-radius: 30px;
  background: ${theme.colors.gray100};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 42px;
  color: ${theme.colors.gray800};
  ${(props) => props.theme.fonts.regular25};

  animation: ${fadeIn} 0.5s ease-in forwards;
  transition: opacity 0.5s ease-in-out;

  @media (max-width: 700px) {
    height: 376px;
    padding: 80px 20px;
    border-radius: 8px;
    gap: 0px;
  }
`;

const AnimatedImage = styled(Image)`
  animation: ${growShrink} 1.8s ease-in-out infinite;

  @media (max-width: 700px) {
    margin-bottom: 20px;
  }
`;
const AnimatedText = styled.div<{ $visible: boolean }>`
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
  animation: ${({ $visible }) => ($visible ? fadeIn : fadeOut)} 1s ease-in-out
    forwards;

  @media (max-width: 700px) {
    ${(props) => props.theme.fonts.medium16};
    margin-bottom: 6px;
  }
`;
const Time = styled.div`
  color: ${theme.colors.gray700};
  ${(props) => props.theme.fonts.light32}
  margin-bottom: 32px;
`;

const Span = styled.span`
  color: ${theme.colors.violet600};
  ${(props) => props.theme.fonts.bold32}
  @media (max-width: 700px) {
    ${(props) => props.theme.fonts.bold32}
  }
`;

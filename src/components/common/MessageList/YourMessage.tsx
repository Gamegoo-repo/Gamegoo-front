import styled from "styled-components";

import { getProfileBgColor, setChatTimeFormatter } from "@/utils";

import type { ChatMessageDto } from "@/types";

interface YourMessageProps {
  message: ChatMessageDto;
  showTime: boolean;
  showProfileImage: boolean;
  onProfileClick: () => void;
  isBlind: boolean;
}

const YourMessage = ({
  message,
  showTime,
  showProfileImage,
  onProfileClick,
  isBlind,
}: YourMessageProps) => (
  <YourMessageContainer>
    {showProfileImage && (
      <ImageWrapper
        $bgColor={getProfileBgColor(message.senderProfileImg)}
        onClick={onProfileClick}
      >
        <ProfileImage
          data={
            isBlind
              ? "/assets/images/profile/profile_default.svg"
              : `/assets/images/profile/profile${message.senderProfileImg}.svg`
          }
          width={38}
          height={38}
        />
      </ImageWrapper>
    )}
    <YourDiv $hasProfileImage={showProfileImage}>
      <YourMessageBubble>{message.message}</YourMessageBubble>
      {showTime && (
        <YourDate>{setChatTimeFormatter(message.createdAt)}</YourDate>
      )}
    </YourDiv>
  </YourMessageContainer>
);

export default YourMessage;

const YourMessageContainer = styled.div`
  display: flex;
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

const ProfileImage = styled.object`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

const YourDiv = styled.div<{ $hasProfileImage: boolean }>`
  display: flex;
  align-items: end;
  margin-left: ${(props) => (props.$hasProfileImage ? "11px" : "58.43px")};
`;

const YourMessageBubble = styled.div`
  ${(props) => props.theme.fonts.regular14};
  color: ${(props) => props.theme.colors.gray800};
  background: ${(props) => props.theme.colors.white};
  border-radius: 13px;
  padding: 5px 13px;
  max-width: 229px;
  word-break: keep-all;
  overflow-wrap: break-word;
`;

const YourDate = styled.p`
  margin-left: 9px;
  ${(props) => props.theme.fonts.regular9};
  color: ${(props) => props.theme.colors.violet400};
`;

import { theme } from "@/styles/theme";
import Image from "next/image";
import React, { useState } from "react";
import styled from "styled-components";
import Alert from "./Alert";
import FeedBackInput from "./FeedbackInput";
import { useRouter } from "next/navigation";
import ChatButton from "./ChatButton";

interface FooterProps {
  isShowChat: boolean;
}

const Footer = (props: FooterProps) => {
  const { isShowChat } = props;
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);

  /* 서비스 준비 중 경고창 */
  const handleShowWarning = () => {
    setShowAlert(!showAlert);
  };

  const handleDirectPrivacy = () => {
    router.push("/policy?terms=privacy");
  };

  const handleDirectService = () => {
    router.push("/policy?terms=service");
  };

  return (
    <Wrapper>
      {showAlert && (
        <Alert
          icon="exclamation"
          width={68}
          height={58}
          content="서비스 준비 중입니다."
          alt="경고"
          onClose={handleShowWarning}
          buttonText="확인"
        />
      )}
      <Container>
        <LeftWrapper>
          <LeftDiv>
            <Image
              src="/assets/icons/logo.svg"
              width={285}
              height={58}
              alt="gamegoo"
            />
            email: gamegoo0707@gmail.com
            <br />
            copyright 2024. GameGoo All Rights Reserved.
          </LeftDiv>
          <FeedBackInput />
        </LeftWrapper>
        <RightDiv>
          <Bold>Resources</Bold>
          <button onClick={handleDirectPrivacy}>개인정보처리방침</button>
          <button onClick={handleDirectService}>이용약관</button>
        </RightDiv>
      </Container>
      {isShowChat && (
        <ChatButtonWrapper>
          <ChatButton />
        </ChatButtonWrapper>
      )}
    </Wrapper>
  );
};

export default Footer;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

const Container = styled.div`
  max-width: 1440px;
  width: 100%;
  height: 429px;
  padding: 60px 80px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const LeftWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 50px;
`;

const LeftDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 28px;
  ${theme.fonts.regular14};
  white-space: nowrap;
`;

const RightDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 54px;
  ${theme.fonts.regular14};
  white-space: nowrap;
`;

const Bold = styled.div`
  ${theme.fonts.bold20};
`;

const ChatButtonWrapper = styled.div`
  margin-bottom: 78px;
  margin-left: auto;
`;

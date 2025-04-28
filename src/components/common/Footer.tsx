import { theme } from "@/styles/theme";
import Image from "next/image";
import React, { useState } from "react";
import styled from "styled-components";
import Alert from "./Alert";
import FeedBackInput from "./FeedbackInput";
import { useRouter } from "next/navigation";
import ChatButton from "./ChatButton";
import useMediaQueries from "@/hooks/useMediaQueries";

interface FooterProps {
  isShowChat: boolean;
}

const Footer = (props: FooterProps) => {
  const isMobile = useMediaQueries({ breakpoint: 700 });
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
              src="/assets/icons/logo_gray.svg"
              width={127}
              height={22}
              alt="gamegoo"
            />
            {isMobile && (
              <FeedbackWrapper>
                <FeedBackInput />
              </FeedbackWrapper>
            )}
            <TermsTextWrap>
              <TermsButton onClick={handleDirectPrivacy}>
                개인정보처리방침
              </TermsButton>
              <TermsButton onClick={handleDirectService}>이용약관</TermsButton>
            </TermsTextWrap>
            email: gamegoo0707@gmail.com
            <br />
            copyright 2024. GameGoo All Rights Reserved.
          </LeftDiv>
          {!isMobile && (
            <FeedbackWrapper>
              <FeedBackInput />
            </FeedbackWrapper>
          )}
        </LeftWrapper>
      </Container>
      {isShowChat && !isMobile ? (
        <ChatButtonWrapper>
          <ChatButton />
        </ChatButtonWrapper>
      ) : (
        <></>
      )}
    </Wrapper>
  );
};

export default Footer;

const Wrapper = styled.div`
  width: 100%;
  max-width: 1440px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

const Container = styled.div`
  width: 100%;
  height: 429px;
  padding: 60px 80px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  @media (max-width: 700px) {
    height: unset;
    padding: 20px;
  }
`;

const LeftWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: end;
  gap: 170px;
`;

const LeftDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  ${theme.fonts.regular13};
  color: ${theme.colors.gray500};
  white-space: nowrap;
  @media (max-width: 700px) {
    ${theme.fonts.regular12};
  }
`;

const TermsTextWrap = styled.div`
  margin: 28px 0 20px 0;
  @media (max-width: 700px) {
    margin: 28px 0 10px 0;
  }
`;

const TermsButton = styled.button`
  ${theme.fonts.bold14};
  color: ${theme.colors.gray500};
  text-decoration: underline;
  margin-right: 16px;
`;
const FeedbackWrapper = styled.div`
  @media (max-width: 700px) {
    margin-top: 25px;
    ${theme.fonts.bold12};
  }
`;

const ChatButtonWrapper = styled.div`
  margin-bottom: 78px;
  margin-left: auto;
`;

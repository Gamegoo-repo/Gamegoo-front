import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styled from "styled-components";

import { useMediaQueryContext } from "@/hooks";
import { theme } from "@/styles/theme";

import ChatButton from "./ChatButton";
import FeedBackInput from "./FeedbackInput";

interface FooterProps {
  isShowChat: boolean;
}

const Footer = (props: FooterProps) => {
  const { isMobile } = useMediaQueryContext();
  const { isShowChat } = props;
  const router = useRouter();

  const handleDirectPrivacy = () => {
    router.push("/policy?terms=privacy");
  };

  const handleDirectService = () => {
    router.push("/policy?terms=service");
  };

  return (
    <Wrapper>
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
  @media (max-width: ${theme.breakpoints.mobile}) {
    height: unset;
    padding: 20px;
  }
`;

const LeftWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: end;
  gap: 170px;

  @media (max-width: ${theme.breakpoints.desktop}) {
    gap: 130px;
  }

  @media (max-width: 1000px) {
    gap: 100px;
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    gap: 70px;
  }
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
  @media (max-width: ${theme.breakpoints.mobile}) {
    ${theme.fonts.regular12};
  }
`;

const TermsTextWrap = styled.div`
  margin: 28px 0 20px 0;
  @media (max-width: ${theme.breakpoints.mobile}) {
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
  @media (max-width: ${theme.breakpoints.mobile}) {
    margin-top: 25px;
    ${theme.fonts.bold12};
  }
`;

const ChatButtonWrapper = styled.div`
  margin-bottom: 78px;
  margin-left: auto;
`;

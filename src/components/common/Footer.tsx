import { theme } from "@/styles/theme";
import Image from "next/image";
import React from "react";
import styled from "styled-components";

const Footer = () => {
  return (
    <Wrapper>
      <Container>
        <LeftDiv>
          <Image
            src="/assets/icons/logo.svg"
            width={285}
            height={58}
            alt="gamegoo"
          />
          email: gamegoo0707@gmail.com
          <br />
          copyright 2024. GamGoo All Rights Reserved.
        </LeftDiv>
        <RightDiv>
          <Bold>Resources</Bold>
          <div>개인정보처리방침</div>
          <div>이용약관</div>
        </RightDiv>
      </Container>
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

const LeftDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 28px;
  color: #000;
  ${theme.fonts.regular14};
`;

const RightDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  gap: 54px;
  color: #000;
  ${theme.fonts.regular14};
  white-space: nowrap;
`;

const Bold = styled.div`
  ${theme.fonts.bold20};
`;

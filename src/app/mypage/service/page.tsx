"use client";

import styled from "styled-components";
import { theme } from "@/styles/theme";
import ChatButton from "@/components/common/ChatButton";
import Image from "next/image";

const MyServicePage = () => {
  return (
    <Wrapper>
      <MyServiceContent>
        <Service>
          <Top>고객 센터</Top>
        </Service>
        <Content>
          어떤 내용이든 문의해 주시면 답변 드리겠습니다!
          <br />
          가능한 한 빠르게 도움을 드릴 수 있도록 노력하겠습니다.
          <Box>
            <Image
              src="/assets/images/social/kakaoChanel.svg"
              width={61}
              height={61}
              alt="카카오 채널"
            />
            <StyledLink
              href="https://pf.kakao.com/_Rrxiqn"
              target="_blank"
              rel="noopener noreferrer"
            >
              카카오 채널로 문의하기
            </StyledLink>
          </Box>
          <Box>
            <Image
              src="/assets/images/social/gmail.svg"
              width={61}
              height={46}
              alt="카카오 채널"
            />
            <Column>
              이메일로 문의하기
              <StyledLink
                href="mailto:gamegoo0707@gmail.com"
                style={{ textDecoration: "underline" }}
              >
                gamegoo0707@gmail.com
              </StyledLink>
            </Column>
          </Box>
        </Content>
      </MyServiceContent>
      <Footer>
        <ChatBoxContent>
          <ChatButton />
        </ChatBoxContent>
      </Footer>
    </Wrapper>
  );
};

export default MyServicePage;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 140px;
`;

const MyServiceContent = styled.div`
  max-width: 1440px;
  width: 100%;
  padding: 0 80px;
`;

const Service = styled.header`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 32px;
`;

const Top = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  color: ${theme.colors.gray700};
  ${(props) => props.theme.fonts.regular25};
  padding-bottom: 13px;
  margin-bottom: 20px;
  border-bottom: 1px solid ${theme.colors.gray400};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 27px;
  color: ${theme.colors.gray600};
  ${theme.fonts.regular18};
  text-align: center;
`;

const Box = styled.div`
  width: 423px;
  height: 100px;
  padding: 20px 30px;
  display: flex;
  align-items: center;
  background: ${theme.colors.purple500};
  border: 0.5px solid ${theme.colors.purple200};
  gap: 94px;
  text-align: left;
  color: black;
  ${theme.fonts.medium16};
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;
const StyledLink = styled.a`
  color: black;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Footer = styled.footer`
  display: flex;
  margin-bottom: 78px;
`;

const ChatBoxContent = styled.div`
  margin-left: auto;
`;

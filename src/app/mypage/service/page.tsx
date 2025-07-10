"use client";

import styled from "styled-components";

import { useMediaQueryContext } from "@/hooks";
import { theme } from "@/styles/theme";

const MyServicePage = () => {
  const { isMobile } = useMediaQueryContext();

  return (
    <Wrapper>
      <MyServiceContent>
        <Service>
          <Top>고객센터</Top>
        </Service>
        <Content>
          어떤 내용이든 문의해 주시면 답변 드리겠습니다!
          <br />
          가능한 한 빠르게 도움을 드릴 수 있도록 노력하겠습니다.
          <BoxWrap>
            <Box $bgColor={theme.colors.yellow100}>
              <KakaoImage
                data="/assets/images/social/kakaoChanel.svg"
                width={isMobile ? 52 : 80}
                height={isMobile ? 52 : 80}
              />
              <StyledLink
                href="https://pf.kakao.com/_Rrxiqn"
                target="_blank"
                rel="noopener noreferrer"
              >
                카카오톡 채널로
                <br /> 문의하기
              </StyledLink>
            </Box>
            <Box $bgColor={theme.colors.blue100}>
              <GmailLogoWrapper>
                <GmailLogo
                  data="/assets/images/social/gmail.svg"
                  width={isMobile ? 37 : 59}
                  height={isMobile ? 28 : 45}
                />
              </GmailLogoWrapper>

              <Column>
                이메일로 문의하기
                <StyledLink
                  href="mailto:gamegoo0707@gmail.com"
                  $smallText={true}
                >
                  gamegoo0707@gmail.com
                </StyledLink>
              </Column>
            </Box>
          </BoxWrap>
        </Content>
      </MyServiceContent>
    </Wrapper>
  );
};

export default MyServicePage;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 140px;
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 30px 20px;
  }
`;

const MyServiceContent = styled.div`
  max-width: 1440px;
  width: 100%;
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 0;
  }
`;

const Service = styled.header`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 76px;
  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) => props.theme.fonts.semiBold18};
    margin-bottom: 20px;
  }
`;

const Top = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  color: ${theme.colors.gray700};
  ${(props) => props.theme.fonts.bold25};
  padding-bottom: 13px;
  /* margin-bottom: 20px; */
  border-bottom: 1px solid ${theme.colors.gray300};
  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) => props.theme.fonts.semiBold18};
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 27px;
  color: ${theme.colors.gray800};
  ${theme.fonts.regular18};
  text-align: center;
  @media (max-width: ${theme.breakpoints.mobile}) {
    text-align: start;
    ${(props) => props.theme.fonts.regular14};
    align-items: flex-start;
  }
`;

const BoxWrap = styled.div`
  display: flex;
  gap: 20px;
  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 100%;
    flex-direction: column;
  }
`;

const Box = styled.button<{ $bgColor: string }>`
  width: 300px;
  height: 328px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: ${({ $bgColor }) => $bgColor};
  gap: 94px;
  text-align: left;
  color: ${theme.colors.gray800};
  ${theme.fonts.bold25};
  border-radius: 12px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 100%;
    height: 200px;
    padding: 32px;
    gap: 30px;
    ${theme.fonts.bold20};
  }
`;

const KakaoImage = styled.object`
  pointer-events: none;
`;

const GmailLogoWrapper = styled.div`
  position: relative;
  border-radius: 8.35px;
  background: ${theme.colors.white};
  width: 80px;
  height: 80px;
  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 51px;
    height: 51px;
  }
`;
const GmailLogo = styled.object`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;
const Column = styled.div`
  display: flex;
  flex-direction: column;
`;
const StyledLink = styled.a<{ $smallText?: boolean }>`
  color: ${theme.colors.gray900};

  ${({ $smallText }) => $smallText && theme.fonts.regular18};

  text-decoration: none;
  @media (max-width: ${theme.breakpoints.mobile}) {
    ${({ $smallText }) => $smallText && theme.fonts.regular16};
  }
`;

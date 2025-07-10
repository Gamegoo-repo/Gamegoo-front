"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import styled from "styled-components";

import { Banner } from "@/components";
import { MATCH_PAGE_DATA } from "@/constants";
import { useMediaQueryContext } from "@/hooks";
import { theme } from "@/styles/theme";

const HomePage = () => {
  const router = useRouter();
  const { isMobile } = useMediaQueryContext();

  return (
    <Wrapper>
      <HomeContent>
        <Banner />
        <Main>
          {MATCH_PAGE_DATA.map((content) => {
            return (
              <ContentWrapper
                key={content.id}
                onClick={() => {
                  router.push(content.pathname);
                }}
              >
                <StyledObject
                  data={!isMobile ? content.image : content.moImage}
                  width={0}
                  height={0}
                  style={{ width: "100%", height: "100%" }}
                />
                <TitleWrap>
                  <ContentTitle>{content.title}</ContentTitle>
                  <Image
                    src={"/assets/icons/chevron_right.svg"}
                    width={!isMobile ? 24 : 14}
                    height={!isMobile ? 24 : 14}
                    style={{ marginLeft: "10px" }}
                    alt="go"
                  />
                </TitleWrap>
              </ContentWrapper>
            );
          })}
        </Main>
      </HomeContent>
    </Wrapper>
  );
};

export default HomePage;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 100px;
  @media (max-width: ${theme.breakpoints.desktop}) {
    padding-top: 24px;
  }
`;

const HomeContent = styled.div`
  max-width: 1440px;
  width: 100%;
  padding: 0px 80px;
  @media (max-width: ${theme.breakpoints.desktop}) {
    padding: 0 20px;
  }
`;

const Main = styled.main`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 59px;
  margin-bottom: 37px;

  @media (max-width: ${theme.breakpoints.desktop}) {
    flex-direction: column;
    gap: 40px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 600px;
  position: relative;
  cursor: pointer;
  @media (max-width: ${theme.breakpoints.mobile}) {
    min-width: 100%;
  }
`;

const StyledObject = styled.object`
  pointer-events: none;
`;

const TitleWrap = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
`;

const ContentTitle = styled.p`
  ${(props) => props.theme.fonts.bold32};
  color: ${theme.colors.white};
  white-space: nowrap;
  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) => props.theme.fonts.bold16};
  }
`;

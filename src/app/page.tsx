"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";

import { Banner } from "@/components";
import GuideModal from "@/components/common/GuideModal";
import Icon from "@/components/common/Icon";
import { MATCH_PAGE_DATA } from "@/constants";
import { useMediaQueryContext } from "@/hooks";
import { theme } from "@/styles/theme";

const HomePage = () => {
  const router = useRouter();
  const { isMobile } = useMediaQueryContext();
  const [showGuideModal, setShowGuideModal] = useState(false);

  const getCookie = (name: string): string | null => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  useEffect(() => {
    const hideGuideModalToday = getCookie("hideGuideModalToday");
    
    // 24시간 쿠키가 없으면 모달 표시 (다시보지 않기 체크했을 때만 쿠키 저장됨)
    if (!hideGuideModalToday) {
      setShowGuideModal(true);
    }
  }, []);

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
                  <Icon
                    backgroundUrl={"/assets/icons/chevron_right.svg"}
                    width={isMobile ? 14 : 24}
                    height={isMobile ? 14 : 24}
                    style={{ marginLeft: "10px" }}
                  />
                </TitleWrap>
              </ContentWrapper>
            );
          })}
        </Main>
      </HomeContent>
      <GuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />
    </Wrapper>
  );
};

export default HomePage;

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full flex justify-center">{children}</div>
);

const HomeContent = ({ children }: { children: React.ReactNode }) => (
  <div className="box-border max-w-[1440px] w-full px-5 desktop:px-20 pt-6 desktop:pt-[100px]">
    {children}
  </div>
);

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

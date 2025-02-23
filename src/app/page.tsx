"use client";

import { useRouter } from "next/navigation";
import { MATCH_PAGE_DATA } from "@/constants/match";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import Banner from "@/components/common/Banner";

const HomePage = () => {
  const router = useRouter();

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
                  data={content.image}
                  width={0}
                  height={0}
                  style={{ width: "100%", height: "100%" }}
                />
                <ContentTitle>{content.title}</ContentTitle>
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
`;

const HomeContent = styled.div`
  max-width: 1440px;
  width: 100%;
  padding: 0px 80px;
`;

const Header = styled.header`
  margin-bottom: 35px;
`;

const SubTitle = styled.div`
  ${(props) => props.theme.fonts.regular25};
  color: #44515c;
`;

const Main = styled.main`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 59px;
  margin-bottom: 37px;

  @media (max-width: 1200px) {
    flex-direction: column;
    gap: 40px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 600px;
  position: relative;
  cursor: pointer;
`;

const StyledObject = styled.object`
  pointer-events: none;
`;

const ContentTitle = styled.p`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  ${(props) => props.theme.fonts.bold32};
  color: ${theme.colors.white};
  white-space: nowrap;
`;

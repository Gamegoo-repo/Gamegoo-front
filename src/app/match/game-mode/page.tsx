"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";

import { GraphicBox, HeaderTitle } from "@/components";
import Icon from "@/components/common/Icon";
import { GAME_MODE_PAGE_DATA } from "@/constants";
import { useMediaQueryContext } from "@/hooks";
import { theme } from "@/styles/theme";

const GameModePage = () => {
  const { isMobile } = useMediaQueryContext();
  const router = useRouter();
  const [displayedData, setDisplayedData] = useState(GAME_MODE_PAGE_DATA);
  const searchParams = useSearchParams();
  const params = searchParams.get("type");
  // "custom"일 때 "칼바람" 제외
  const filteredData = GAME_MODE_PAGE_DATA.filter(
    (box) => !(params === "custom" && box.title === "칼바람")
  );
  return (
    <Wrapper>
      <MatchContent>
        <HeaderTitle title="게임모드 선택" />
        <Main>
          {isMobile
            ? filteredData.map((box) => {
                const type = params || "";
                return (
                  <Box key={box.id} $backgroundColor="#2E3032">
                    <BoxTitle>{box.title}</BoxTitle>
                    <BoxButton
                      onClick={() =>
                        router.push(
                          type
                            ? box.rank
                              ? `${box.pathname}?type=${type}&rank=${box.rank}`
                              : `${box.pathname}?type=${type}`
                            : box.pathname
                        )
                      }
                    >
                      선택
                      <Icon
                        backgroundUrl="/assets/icons/chevron_right.svg"
                        width={12}
                        height={12}
                        style={{
                          marginLeft: "4px",
                        }}
                      />
                    </BoxButton>
                  </Box>
                );
              })
            : filteredData.map((box) => {
                return (
                  <BoxWrapper key={box.id}>
                    <GraphicBox
                      type={params || ""}
                      rank={box.rank}
                      pathname={box.pathname}
                      height={box.height}
                      top={box.top}
                      left={box.left}
                      backgroundColor="#2E3032"
                    >
                      {box.title}
                      <Icon
                        backgroundUrl="/assets/icons/chevron_right.svg"
                        width={20}
                        height={20}
                        style={{
                          marginLeft: "8px",
                        }}
                      />
                    </GraphicBox>
                  </BoxWrapper>
                );
              })}
        </Main>
      </MatchContent>
    </Wrapper>
  );
};

export default function GameModePaging() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GameModePage />
    </Suspense>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 110px;
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding-top: 0px;
  }
`;

const MatchContent = styled.div`
  max-width: 1440px;
  width: 100%;
  padding: 60px 80px 0px 80px;
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 24px 20px;
  }
`;

const Main = styled.main`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 27px;
  margin-top: 185px;
  margin-bottom: 65px;
  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    margin-top: 15px;
  }
`;
const Box = styled.div<{ $backgroundColor: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 89px;
  padding: 36px 33px;
  border-radius: 12px;
  background-color: ${(props) => props.$backgroundColor};
  color: ${(props) => props.theme.colors.white};
`;

const BoxTitle = styled.div`
  ${(props) => props.theme.fonts.bold20};
`;

const BoxButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 67px;
  height: 33px;
  border-radius: 9999px;
  color: ${(props) => props.theme.colors.white};
  background: ${(props) => props.theme.colors.violet600};
`;

const BoxWrapper = styled.div`
  display: contents;
`;

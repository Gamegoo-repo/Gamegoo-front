"use client";

import GraphicBox from "@/components/match/GraphicBox";
import styled from "styled-components";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GAME_MODE_PAGE_DATA } from "@/data/match";
import HeaderTitle from "@/components/common/HeaderTitle";
import { Suspense } from "react";

const GameModePage = () => {
  const router = useRouter();
  const [displayedData, setDisplayedData] = useState(GAME_MODE_PAGE_DATA);
  const searchParams = useSearchParams();
  const params = searchParams.get("type");

  return (
    <Wrapper>
      <MatchContent>
        <HeaderTitle title="게임 모드 선택" />
        <Main>
          {displayedData.map((box) => {
            return (
              <BoxWrapper key={box.id}>
                <GraphicBox
                  type={params || ""}
                  rank={box.rank}
                  pathname={box.pathname}
                  height={box.height}
                  top={box.top}
                  left={box.left}
                  background={""}
                >
                  {box.title}
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
  padding-top: 140px;
`;

const MatchContent = styled.div`
  max-width: 1440px;
  width: 100%;
  padding: 60px 80px 0px 80px;
`;

const Main = styled.main`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 27px;
  margin-top: 185px;
  margin-bottom: 37px;
`;

const BoxWrapper = styled.div`
  display: contents;
`;

"use client";

import ChatButton from "@/components/common/ChatButton";
import GraphicBox from "@/components/match/GraphicBox";
import Image from "next/image";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GAME_MODE_PAGE_DATA } from "@/data/match";
import HeaderTitle from "@/components/common/HeaderTitle";
import { Suspense } from "react";

const GameModePage = () => {
  const router = useRouter();
  const [displayedData, setDisplayedData] = useState(GAME_MODE_PAGE_DATA);
  const searchParams = useSearchParams();
  const params = searchParams.get("type");

  useEffect(() => {
    if (params === "fun") {
      setDisplayedData(GAME_MODE_PAGE_DATA);
      return;
    }
    if (params === "hard") {
      setDisplayedData(GAME_MODE_PAGE_DATA.slice(0, -1));
      return;
    }
  }, [params]);

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
                  pathname={box.pathname}
                  height={box.height}
                  top={box.top}
                  left={box.left}
                >
                  {box.title}
                </GraphicBox>
              </BoxWrapper>
            );
          })}
        </Main>
        <Footer>
          <ChatBoxContent>
            <ChatButton count={3} />
          </ChatBoxContent>
        </Footer>
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
`;

const MatchContent = styled.div`
  max-width: 1440px;
  width: 100%;
  padding: 0 80px;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 32px;
`;

const StyledImage = styled(Image)`
  margin-right: 35px;
  cursor: pointer;
`;

const Title = styled.h1`
  ${(props) => props.theme.fonts.bold32};
  color: #393939;
`;

const Main = styled.main`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 27px;
  margin-bottom: 37px;
`;

const BoxWrapper = styled.div`
  display: contents;
`;

const Footer = styled.footer`
  display: flex;
  margin-bottom: 78px;
`;

const ChatBoxContent = styled.div`
  margin-left: auto;
  margin-bottom: 37px;
`;

"use client";

import styled from "styled-components";
import GraphicBox from "@/components/match/GraphicBox";
import { MATCH_TYPE_PAGE_DATA } from "@/constants/match";
import HeaderTitle from "@/components/common/HeaderTitle";
import ChevronRight from "../../../public/assets/icons/chevron_right.svg";
import { useState } from "react";
const MatchTypePage = () => {
  const [hoveredBox, setHoveredBox] = useState<number | null>(null);

  return (
    <Wrapper>
      <MatchContent>
        <HeaderTitle title="매칭 종류 선택" />
        <Main>
          {MATCH_TYPE_PAGE_DATA.map((box) => {
            const isHovered = hoveredBox === box.id;
            return (
              <GraphicBox
                key={box.id}
                type={box.type}
                pathname={box.pathname}
                width={box.width}
                height={box.height}
                top={box.top}
                left={box.left}
                backgroundColor={
                  isHovered ? box.hoverBackground : box.background
                } // Hover 시 배경 변경
                onMouseEnter={() => setHoveredBox(box.id)}
                onMouseLeave={() => setHoveredBox(null)}
              >
                <GraphicBoxTitle>
                  <GraphicBoxTitleMain>
                    {/* Hover 시 title 변경 */}
                    {isHovered ? box.hoverTitle : box.title}
                    <ChevronRight />
                  </GraphicBoxTitleMain>
                  <GraphicBoxTitleSub isHovered={isHovered}>
                    {/* Hover 시 sub 변경 */}
                    {isHovered ? box.hoverSub : box.sub}
                  </GraphicBoxTitleSub>
                </GraphicBoxTitle>
              </GraphicBox>
            );
          })}
        </Main>
      </MatchContent>
    </Wrapper>
  );
};

export default MatchTypePage;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-top: 110px;
`;

const MatchContent = styled.div`
  max-width: 1440px;
  width: 100%;
  padding: 60px 80px 0px 80px;
`;

const Main = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 59px;
  margin-top: 72px;
  margin-bottom: 150px;

  @media screen and (max-width: 1300px) {
    flex-direction: column;
    gap: 40px;
  }
`;

const GraphicBoxTitle = styled.div``;

const GraphicBoxTitleMain = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const GraphicBoxTitleSub = styled.div<{ isHovered: boolean }>`
  ${(props) => props.theme.fonts.regular18};
  display: flex;
  width: 100%;
  white-space: pre-wrap;
  color: ${(props) =>
    props.isHovered
      ? props.theme.colors.violet300
      : props.theme.colors.gray500};
`;

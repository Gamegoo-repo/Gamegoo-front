"use client";

import styled from "styled-components";
import GraphicBox from "@/components/match/GraphicBox";
import { MATCH_TYPE_PAGE_DATA } from "@/data/match";
import HeaderTitle from "@/components/common/HeaderTitle";

const MatchTypePage = () => {
  return (
    <Wrapper>
      <MatchContent>
        <HeaderTitle title="매칭 종류 선택" />
        <Main>
          {MATCH_TYPE_PAGE_DATA.map((box) => {
            return (
              <GraphicBox
                key={box.id}
                type={box.type}
                pathname={box.pathname}
                width={box.width}
                height={box.height}
                top={box.top}
                left={box.left}
                background={box.background}
              >
                <div>
                  {box.title}
                  <Sub>{box.sub}</Sub>
                </div>
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

const Sub = styled.div`
  ${(props) => props.theme.fonts.regular18};
  white-space: pre-wrap;
`;

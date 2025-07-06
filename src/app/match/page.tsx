"use client";

import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import styled from "styled-components";

import Alert from "@/components/common/Alert";
import HeaderTitle from "@/components/common/HeaderTitle";
import GraphicBox from "@/components/match/GraphicBox";
import {
  MATCH_TYPE_PAGE_DATA,
  MO_MATCH_TYPE_PAGE_DATA,
} from "@/constants/match";
import useMediaQueries from "@/hooks/useMediaQueries";
import { getAccessToken } from "@/utils/storage";

import ChevronRight from "../../../public/assets/icons/chevron_right.svg";

const MatchTypePage = () => {
  const isMobile = useMediaQueries({ breakpoint: 700 });
  const router = useRouter();

  const accesssToken = getAccessToken(); // 로그인 유무 결정
  const [showAlert, setShowAlert] = useState(false);
  const [hoveredBox, setHoveredBox] = useState<number | null>(null);

  return (
    <Wrapper>
      {showAlert && (
        <Alert
          icon="exclamation"
          width={68}
          height={58}
          content="로그인이 필요한 서비스입니다."
          alt="경고"
          onClose={() => setShowAlert(false)}
          buttonText="확인"
        />
      )}
      <MatchContent>
        <HeaderTitle title="매칭 종류 선택" />
        <Main>
          {isMobile
            ? MO_MATCH_TYPE_PAGE_DATA.map((box) => {
                return (
                  <Box key={box.id} backgroundColor={box.background}>
                    <BoxTitleWrap>
                      <BoxTitle>
                        {box.title}
                        {box.id === 2 ? (
                          <BoxTitleOption>{box.option}</BoxTitleOption>
                        ) : (
                          <></>
                        )}
                      </BoxTitle>
                      <BoxSub>{box.sub}</BoxSub>
                    </BoxTitleWrap>

                    <BoxButton
                      onClick={
                        accesssToken
                          ? () =>
                              router.push(
                                box.type
                                  ? `${box.pathname}?type=${box.type}`
                                  : box.pathname
                              )
                          : () => setShowAlert(true)
                      }
                    >
                      선택
                      <Image
                        src={"/assets/icons/chevron_right.svg"}
                        width={12}
                        height={12}
                        style={{ marginLeft: "4px" }}
                        alt="go"
                      />
                    </BoxButton>
                  </Box>
                );
              })
            : MATCH_TYPE_PAGE_DATA.map((box) => {
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
                      hoveredBox === box.id
                        ? box.hoverBackground
                        : box.background
                    } // Hover 시 배경 변경
                    onMouseEnter={() => setHoveredBox(box.id)}
                    onMouseLeave={() => setHoveredBox(null)}
                    onClick={
                      accesssToken ? undefined : () => setShowAlert(true)
                    }
                  >
                    <GraphicBoxTitle>
                      <GraphicBoxTitleMain>
                        {/* Hover 시 title 변경 */}
                        {hoveredBox === box.id ? box.hoverTitle : box.title}
                        <ChevronRight width="5px" />
                      </GraphicBoxTitleMain>
                      <GraphicBoxTitleSub $isHovered={hoveredBox === box.id}>
                        {/* Hover 시 sub 변경 */}
                        {hoveredBox === box.id ? box.hoverSub : box.sub}
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

  @media (max-width: 700px) {
    padding-top: 0px;
  }
`;

const MatchContent = styled.div`
  max-width: 1440px;
  width: 100%;
  padding: 60px 80px 0px 80px;
  @media (max-width: 700px) {
    padding: 24px 20px;
  }
`;

const Main = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 59px;
  margin: 72px 0 150px;

  @media screen and (max-width: 1300px) {
    flex-direction: column;
    gap: 40px;
  }
  @media (max-width: 700px) {
    margin-top: 15px;
  }
`;
const Box = styled.div<{ backgroundColor: string }>`
  width: 100%;
  height: 156px;
  border-radius: 12px;
  padding: 24px 28px;
  background-color: ${(props) => props.backgroundColor};
`;
const BoxTitleWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const BoxTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  ${(props) => props.theme.fonts.bold20};
  color: ${(props) => props.theme.colors.white};
  margin-bottom: 10px;
`;
const BoxTitleOption = styled.span`
  ${(props) => props.theme.fonts.bold12};
  color: ${(props) => props.theme.colors.violet300};
`;
const BoxSub = styled.div`
  ${(props) => props.theme.fonts.regular14};
  color: ${(props) => props.theme.colors.gray400};
`;
const BoxButton = styled.button`
  float: right;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 67px;
  height: 33px;
  border-radius: 9999px;
  ${(props) => props.theme.fonts.semiBold14};
  color: ${(props) => props.theme.colors.white};
  background: ${(props) => props.theme.colors.violet600};
`;
const GraphicBoxTitle = styled.div``;

const GraphicBoxTitleMain = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const GraphicBoxTitleSub = styled.div<{ $isHovered: boolean }>`
  ${(props) => props.theme.fonts.regular18};
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  white-space: pre-wrap;
  color: ${(props) =>
    props.$isHovered
      ? props.theme.colors.violet300
      : props.theme.colors.gray500};
`;

"use client";

import styled from "styled-components";
import ChatButton from "@/components/common/ChatButton";
import GraphicBox from "@/components/match/GraphicBox";
import { MATCH_TYPE_PAGE_DATA } from "@/data/match";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const MatchTypePage = () => {
  const isEvaluationModalOpen = useSelector(
    (state: RootState) => state.modal.evaluationModal
  );
  const isMoreModalOpen = useSelector(
    (state: RootState) => state.modal.moreModal
  );

  return (
    <Wrapper>
      <MatchContent
        $isEvaluationModalOpen={isEvaluationModalOpen}
        $isMoreModalOpen={isMoreModalOpen}
      >
        <Header>
          <Title>바로 매칭하기</Title>
        </Header>
        <Main>
          {MATCH_TYPE_PAGE_DATA.map((box) => {
            return (
              <BoxWrapper key={box.id}>
                <GraphicBox
                  type={box.type}
                  pathname={box.pathname}
                  width={box.width}
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
        <ChatButton count={3} />
      </MatchContent>
    </Wrapper>
  );
};

export default MatchTypePage;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const MatchContent = styled.div<{
  $isEvaluationModalOpen: boolean;
  $isMoreModalOpen: string;
}>`
  max-width: 1440px;
  width: 100%;
  padding: 0 80px;
  &:before {
    content: "";
    position: ${({ $isEvaluationModalOpen, $isMoreModalOpen }) =>
      $isEvaluationModalOpen || $isMoreModalOpen !== "" ? "fixed" : "unset"};
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ $isEvaluationModalOpen, $isMoreModalOpen }) =>
      $isEvaluationModalOpen || $isMoreModalOpen !== ""
        ? "#0000009C"
        : "transparent"};
    z-index: 100;
  }
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
  margin-bottom: 32px;
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
`;

const ChatBoxContent = styled.div`
  margin-left: auto;
`;

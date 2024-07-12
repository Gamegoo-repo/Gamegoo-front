"use client";

import styled from "styled-components";
import HeaderTitle from "@/components/common/HeaderTitle";
import SquareProfile from "@/components/match/SquareProfile";
import Image from "next/image";
import { theme } from "@/styles/theme";
import { useState } from "react";
import ConfirmModal from "@/components/common/ConfirmModal";

const Progress = () => {
  /* 모달창 */
  const [isFirstRetry, setIsFirstRetry] = useState<boolean>(true);
  const [isSecondYes, setIsSecondYes] = useState<boolean>(false);
  const [isSecondNo, setIsSecondNo] = useState<boolean>(false);

  return (
    <Wrapper>
      <MatchContent>
        <Header>
          <HeaderTitle title="매칭 중" sub="나와 꼭 맞는 상대를 찾는 중..." />
          <Time>
            <Span>2:20&nbsp;</Span>/5:00
          </Time>
        </Header>
        <Main>
          <SquareProfile />
          <Waiting>
            <Image
              src="/assets/images/wait_heart.svg"
              width={225}
              height={225}
              alt="heart"
            />
            어떤 사람이 나올까요?
          </Waiting>
        </Main>
        {/* 즐겜모드, 빡겜모드 매칭 실패 */}
        {isFirstRetry && (
          <ConfirmModal
            type="yesOrNo"
            width="540px"
            onClose={() => setIsFirstRetry(false)}
          >
            계속해서 매칭을 시도하겠습니까?
          </ConfirmModal>
        )}
        {/* 빡겜모드 2번째 매칭 실패 시, 같은 조건으로 글을 올린 사람이 있을 때 */}
        {isSecondYes && (
          <ConfirmModal
            type="yesOrNo"
            width="540px"
            onCheck={() => setIsSecondYes(false)}
            onClose={() => setIsSecondYes(false)}
            yes="닫기"
            no="글 보러가기"
          >
            조건에 맞는 사람이 없습니다.
            <br />
            같은 조건으로 글을 올린 사람이 있어요!
          </ConfirmModal>
        )}
        {/* 빡겜모드 2번째 매칭 실패 시, 같은 조건으로 글을 쓴 사람이 없을 때 */}
        {isSecondNo && (
          <ConfirmModal
            type="yesOrNo"
            width="540px"
            onCheck={() => setIsSecondNo(false)}
            onClose={() => setIsSecondNo(false)}
            yes="닫기"
            no="글 작성하기"
          >
            조건에 맞는 사람이 없습니다.
            <br />
            게시판에 글을 작성할 수 있어요!
          </ConfirmModal>
        )}
      </MatchContent>
    </Wrapper>
  );
};

export default Progress;

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

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Time = styled.div`
  color: ${theme.colors.gray700};
  ${(props) => props.theme.fonts.regular28}
  margin-bottom: 32px;
`;

const Span = styled.span`
  color: ${theme.colors.purple100};
  ${(props) => props.theme.fonts.bold45}
`;

const Main = styled.main`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: flex-start;
  width: 100%;
  gap: 72px;
  margin-bottom: 37px;
`;

const Waiting = styled.div`
  width: 100%;
  height: 580px;
  border-radius: 30px;
  background: var(--12, #f7f7f9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 42px;
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.regular25};
`;

import Image from "next/image";
import ProgressBar from "@ramonak/react-progress-bar";
import styled from "styled-components";

import { Tooltip } from "@/components/common";
import { theme } from "@/styles/theme";

interface WinningRateProps {
  completed: number;
  recentGameCount?: number;
}

const getProgressColor = (completed: number) => {
  if (completed < 50) return theme.colors.gray700;
  if (completed < 70) return theme.colors.violet600;
  return theme.colors.redViolet;
};

const WinningRate = (props: WinningRateProps) => {
  const { completed, recentGameCount } = props;
  const progressColor = getProgressColor(completed);

  return (
    <>
      <FirstRow>
        <Left>
          <WinningTitle>승률</WinningTitle>
          <Percent $color={progressColor}>
            {!completed ? 0 : completed}%
          </Percent>
        </Left>
        <Right>
          {/* 최근 {recentGameCount === null ? 0 : recentGameCount}
              게임 */}
          현 시즌 성적 통계
          <Tooltip
            title="현 시즌 성적 통계"
            content={`선택한 게임 모드의 이번 시즌 승률을 보여줘요.\n최대 30게임 승률(0~30게임)`}
            width="299px"
          />
        </Right>
      </FirstRow>
      <SecondRow $completed={completed} $color={progressColor}>
        <ProgressBar
          completed={completed}
          maxCompleted={100}
          height="12px"
          className="wrapper"
          barContainerClassName="container"
          completedClassName="barCompleted"
          labelClassName="label"
        />
      </SecondRow>
    </>
  );
};

export default WinningRate;

const FirstRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
`;

const SecondRow = styled.div<{ $completed: number; $color: string }>`
  .wrapper {
    height: 12px;
  }
  .container {
    height: 12px;
    background: ${theme.colors.gray300};
    border-radius: 11px;
  }
  .barCompleted {
    height: 12px;
    background: ${({ $color }) => $color};
    border-radius: 11px;
    width: ${({ $completed }) => $completed || 0}%;
  }
  .label {
    color: transparent;
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  ${(props) => props.theme.fonts.medium11};
  color: ${theme.colors.gray500};
`;

const WinningTitle = styled.p`
  ${(props) => props.theme.fonts.semiBold14};
  color: ${theme.colors.gray800};

  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) => props.theme.fonts.medium11};
  }
`;

const Percent = styled.p<{ $color: string }>`
  ${(props) => props.theme.fonts.bold16};
  color: ${({ $color }) => $color};

  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) => props.theme.fonts.bold12};
  }
`;

const History = styled.p`
  ${(props) => props.theme.fonts.medium11};
  color: ${theme.colors.gray500};
`;

const InfoIcon = styled(Image)``;

const TextModal = styled.div`
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.semiBold14};
  position: absolute;
  z-index: 1;
  top: 100%;
  left: 0;
  border-radius: 10px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.7);
  /* Background Blur */
  box-shadow: 0 4px 8.9px 0 rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(7.5px);

  &::after {
    /* tail css */
    content: "";
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    border-top: 0 solid transparent;
    border-left: 4.5px solid transparent;
    border-right: 4.5px solid transparent;
    border-bottom: 10px solid rgba(0, 0, 0, 0.64);
  }
`;

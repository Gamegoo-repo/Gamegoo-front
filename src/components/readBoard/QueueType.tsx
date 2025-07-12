import Image from "next/image";
import styled from "styled-components";

import Icon from "@/components/common/Icon";
import { theme } from "@/styles/theme";
import { setQueueType } from "@/utils";

import type { GameMode } from "@/types";

interface QueueTypeProps {
  value: GameMode;
}

const QueueType = (props: QueueTypeProps) => {
  const { value } = props;

  return (
    <Queue>
      <Title>선호 게임 모드</Title>
      <Type>
        <Icon
          backgroundUrl="/assets/icons/mini_check.svg"
          width={20}
          height={20}
        />
        <P>{setQueueType(value)}</P>
      </Type>
    </Queue>
  );
};

export default QueueType;

const Queue = styled.div`
  width: 234px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: auto;
  }
`;

const Title = styled.p`
  ${(props) => props.theme.fonts.semiBold14};
  color: ${theme.colors.gray800};
  margin-bottom: 6px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) => props.theme.fonts.medium11};
  }
`;

const Type = styled.div`
  background: ${theme.colors.white};
  border-radius: 10px;
  padding: 16px 12px;
  display: flex;
  align-items: center;
  gap: 2px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 8px;
  }
`;

const P = styled.p`
  ${(props) => props.theme.fonts.medium16};
  color: ${theme.colors.gray800};

  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) => props.theme.fonts.bold12};
  }
`;

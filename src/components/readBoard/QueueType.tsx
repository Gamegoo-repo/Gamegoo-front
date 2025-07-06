import Image from "next/image";

import styled from "styled-components";

import { theme } from "@/styles/theme";
import type { GameMode } from "@/types";
import { setQueueType } from "@/utils";

interface QueueTypeProps {
  value: GameMode;
}

const QueueType = (props: QueueTypeProps) => {
  const { value } = props;

  return (
    <Queue>
      <Title>선호 게임 모드</Title>
      <Type>
        <Image
          src="/assets/icons/mini_check.svg"
          width={20}
          height={20}
          alt=""
        />
        <P>{setQueueType(value)}</P>
      </Type>
    </Queue>
  );
};

export default QueueType;

const Queue = styled.div`
  width: 234px;

  @media (max-width: 700px) {
    width: auto;
  }
`;

const Title = styled.p`
  ${(props) => props.theme.fonts.semiBold14};
  color: ${theme.colors.gray800};
  margin-bottom: 6px;

  @media (max-width: 700px) {
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

  @media (max-width: 700px) {
    padding: 8px;
  }
`;

const P = styled.p`
  ${(props) => props.theme.fonts.medium16};
  color: ${theme.colors.gray800};

  @media (max-width: 700px) {
    ${(props) => props.theme.fonts.bold12};
  }
`;

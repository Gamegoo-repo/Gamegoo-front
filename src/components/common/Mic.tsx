import styled from "styled-components";

import Icon from "@/components/common/Icon";
import { useMediaQueryContext } from "@/hooks";
import { theme } from "@/styles/theme";

import type { Mike } from "@/types";

interface MicProps {
  variant?: "chip" | "icon";
  status: Mike;
}

const Mic = (props: MicProps) => {
  const { variant = "chip", status } = props;
  const { isMobile } = useMediaQueryContext();

  const isAvailable = status === "AVAILABLE";

  if (variant === "icon") {
    return (
      <IconTextWrapper>
        <Icon
          backgroundUrl={`/assets/icons/mic_${isAvailable ? "on" : "off"}_no_bg.svg`}
          width={isMobile ? 24 : 32}
          height={isMobile ? 24 : 32}
        />
        <IconText className={isAvailable ? "on" : "off"}>
          마이크 {isAvailable ? "ON" : "OFF"}
        </IconText>
      </IconTextWrapper>
    );
  }

  return (
    <ChipWrapper className={isAvailable ? "on" : "off"}>
      <Icon
        backgroundUrl={`/assets/icons/mic_${isAvailable ? "on" : "off"}_no_bg.svg`}
        width={10}
        height={12}
      />
      <ChipText className={isAvailable ? "on" : "off"}>
        마이크 {isAvailable ? "ON" : "OFF"}
      </ChipText>
    </ChipWrapper>
  );
};

export default Mic;

const ChipWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 1px 6px;
  border-radius: 999px;

  &.on {
    border: 2px solid ${theme.colors.violet600};
  }
  &.off {
    border: 2px solid ${theme.colors.gray600};
  }
`;

const ChipText = styled.p`
  ${(props) => props.theme.fonts.bold9};
  &.on {
    color: ${theme.colors.violet600};
  }
  &.off {
    color: ${theme.colors.gray600};
  }
`;

const IconTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IconText = styled.p`
  ${(props) => props.theme.fonts.semiBold13};
  margin-top: 6px;

  &.on {
    color: ${theme.colors.violet600};
  }
  &.off {
    color: ${theme.colors.gray600};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    ${theme.fonts.bold12};
  }
`;

import React, { useState } from "react";

import Image from "next/image";

import styled, { css } from "styled-components";

import { useMediaQueries } from "@/hooks";
import { theme } from "@/styles/theme";

interface TooltipProps {
  title?: string;
  content: string;
  children?: React.ReactNode;
  position?: "top" | "bottom";
  size?: "small" | "large";
  width?: string;
}

const Tooltip = (props: TooltipProps) => {
  const {
    title,
    content,
    children,
    position = "bottom",
    size = "small",
    width,
  } = props;
  const isMobile = useMediaQueries({ breakpoint: 700 });
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (isMobile) setIsHovered((prev) => !prev);
  };

  return (
    <TooltipWrapper
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <IconWrapper>
        {children || (
          <Image
            src={"/assets/icons/info.svg"}
            width={16}
            height={16}
            alt="info"
          />
        )}
      </IconWrapper>
      <TooltipContent
        $visible={isHovered}
        position={position}
        size={size}
        $width={width}
      >
        {title && <TooltipTitle>{title}</TooltipTitle>}
        {content}
      </TooltipContent>
    </TooltipWrapper>
  );
};

export default Tooltip;

const TooltipWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const TooltipContent = styled.div<{
  position: "top" | "bottom";
  size: "small" | "large";
  $width?: string;
  $visible: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: ${theme.colors.white};
  ${theme.fonts.regular14};
  position: absolute;
  z-index: 10;
  pointer-events: none;
  opacity: 0;
  transform: translate(
    -50%,
    ${({ position }) => (position === "bottom" ? "5px" : "-5px")}
  );
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;

  ${({ $visible }) =>
    $visible &&
    css`
      opacity: 1;
      pointer-events: auto;
      transform: translate(-50%, 0);
    `}

  ${({ position }) =>
    position === "bottom"
      ? css`
          top: 100%;
          margin-top: 12px;
        `
      : css`
          bottom: 100%;
          margin-bottom: 12px;
        `}

          left: 50%;

  transform: translateX(-50%);
  border-radius: 10px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.7);
  box-shadow: 0 4px 8.9px 0 rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(7.5px);
  white-space: pre-line;
  max-width: 360px; // 모바일 최대

  ${(props) =>
    props.$width &&
    css`
      width: ${props.$width};
    `}

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    ${({ position }) =>
      position === "bottom"
        ? css`
            top: -10px;
            border-top: 0 solid transparent;
            border-left: 4.5px solid transparent;
            border-right: 4.5px solid transparent;
            border-bottom: 10px solid rgba(0, 0, 0, 0.64);
          `
        : css`
            bottom: -10px;
            border-top: 10px solid rgba(0, 0, 0, 0.64);
            border-left: 4.5px solid transparent;
            border-right: 4.5px solid transparent;
            border-bottom: 0 solid transparent;
          `}
  }
`;

const TooltipTitle = styled.div`
  ${theme.fonts.bold14};
`;

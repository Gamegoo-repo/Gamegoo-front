"use client";

import { useRouter } from "next/navigation";

import styled, { css } from "styled-components";

import { theme } from "@/styles/theme";

interface GraphicBoxProps {
  type?: string;
  rank?: string;
  pathname: string;
  children: React.ReactNode;
  width?: string;
  height: string;
  top: string;
  left: string;
  backgroundColor?: string; // 추가: Hover 시 변경될 배경색을 전달받음
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
}

const GraphicBox = (props: GraphicBoxProps) => {
  const router = useRouter();
  const {
    type,
    rank,
    pathname,
    children,
    width,
    height,
    top,
    left,
    backgroundColor,
    onMouseEnter,
    onMouseLeave,
    onClick,
  } = props;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(
        type
          ? rank
            ? `${pathname}?type=${type}&rank=${rank}`
            : `${pathname}?type=${type}`
          : pathname
      );
    }
  };

  return (
    <Wrapper
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      $width={width}
      $height={height}
      style={{ backgroundColor }} // background-color 동적 적용
      $background={backgroundColor ? true : false}
    >
      <Box>
        <Title $top={top} $left={left}>
          {children}
        </Title>
      </Box>
    </Wrapper>
  );
};

export default GraphicBox;

const Wrapper = styled.div<{
  $width?: string;
  $height: string;
  $background: boolean;
}>`
  position: relative;
  max-width: ${(props) => (props.$width ? props.$width : "auto")};
  width: 100%;
  height: ${(props) => props.$height};
  border-radius: 30px;
  cursor: pointer;

  ${({ $background }) =>
    $background &&
    css`
      background: ${theme.colors.gray800};
      &:hover {
        box-shadow: 0px 0px 38.3px 0px rgba(90, 66, 238, 0.7);
      }
    `}
`;

const Box = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 100%;
`;

const Title = styled.div<{ $top: string; $left: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.bold25};
  line-height: 37px;
  white-space: nowrap;
`;

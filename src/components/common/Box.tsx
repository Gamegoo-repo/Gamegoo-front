import { theme } from "@/styles/theme";
import React from "react";
import styled, { css } from "styled-components";

type ShapeType = "round" | "square";

interface BoxProps {
  text: string;
  shape: ShapeType;
}

const Box: React.FC<BoxProps> = ({ text, shape = "round" }) => {
  return <StyledBox shape={shape}>{text}</StyledBox>;
};

export default Box;

const StyledBox = styled.div<{ shape: ShapeType }>`
  display: inline-flex;
  padding: 10px 35px;
  justify-content: center;
  align-items: center;
  background: ${theme.colors.purple100};
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.regular20}
  white-space: nowrap;

  ${(props) =>
    props.shape === "round" &&
    css`
      border-radius: 80px;
    `}

  ${(props) =>
    props.shape === "square" &&
    css`
      border-radius: 0;
    `}
`;

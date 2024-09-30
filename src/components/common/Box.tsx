import { theme } from "@/styles/theme";
import React from "react";
import styled, { css } from "styled-components";

type ShapeType = "round" | "square";
type profileType = "me" | "other" | "none" | "mini";

interface BoxProps {
  text: string;
  shape: ShapeType;
  profileType?: profileType;
}

const Box: React.FC<BoxProps> = ({ text, shape = "round", profileType }) => {
  return (
    <StyledBox $shape={shape} $profiletype={profileType}>
      {text}
    </StyledBox>
  );
};

export default Box;

const StyledBox = styled.div<{ $shape: ShapeType; $profiletype?: profileType }>`
  display: inline-flex;
  padding: 10px 35px;
  justify-content: center;
  align-items: center;
  background: ${theme.colors.purple100};
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.regular20}
  white-space: nowrap;

  ${(props) =>
    props.$shape === "round" &&
    css`
      border-radius: 80px;
    `}

  ${(props) =>
    props.$shape === "square" &&
    css`
      border-radius: 0;
    `}

  ${(props) =>
    props.$profiletype === "mini" &&
    css`
      height: 25px;
      padding: 5px 17px;
      ${(props) => props.theme.fonts.bold12}
    `}
`;

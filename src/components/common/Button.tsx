import Image from "next/image";
import styled from "styled-components";

import { theme } from "@/styles/theme";

interface ButtonProps {
  buttonType?: "primary" | "secondary" | "default" | "light" | "riot";
  type?: "submit" | "reset" | "button" | undefined;
  size?: "small" | "medium" | "large";
  width?: string;
  height?: string;
  text: string;
  icon?: string;
  borderRadius?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

const Button = (props: ButtonProps) => {
  const {
    buttonType = "default",
    size,
    width,
    height,
    text,
    icon,
    borderRadius,
    onClick,
    disabled,
  } = props;

  let buttonClassName = buttonType;
  if (size) {
    buttonClassName += " ${size}";
  }

  return (
    <StyledButton
      type="submit"
      className={buttonType}
      onClick={onClick}
      disabled={disabled}
      $width={width}
      $height={height}
      $borderradius={borderRadius}
    >
      {icon && <Icon src={icon} width={24} height={24} alt="" />}
      {text}
    </StyledButton>
  );
};

export default Button;

const StyledButton = styled.button<{
  $width?: string;
  $height?: string;
  $borderradius?: string;
}>`
  width: ${({ $width }) => $width || "100%"};
  height: ${({ $height }) => $height || "auto"};
  padding: 19px 30px;
  border-radius: ${({ $borderradius }) => $borderradius || "15px"};
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.bold14};
  white-space: nowrap;
  transition:
    color 200ms,
    background-color 200ms;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  /*buttonType*/
  &.primary {
    background: ${theme.colors.violet600};
    &:hover:not(:disabled) {
      background: ${theme.colors.violet600};
      color: #ffffff65;
    }
    &:disabled {
      background: #c5c5c7;
    }
  }
  &.secondary {
    background: ${theme.colors.gray800};
    &:hover:not(:disabled) {
      background: #606060;
      color: rgba(255, 255, 255, 0.42);
    }
    &:disabled {
      background: #606060;
      color: rgba(255, 255, 255, 0.42);
    }
  }
  &.default {
    background: ${theme.colors.white};
    border: 1px solid ${theme.colors.gray300};
    color: ${theme.colors.gray900};
    ${(props) => props.theme.fonts.medium16};
    &:hover:not(:disabled) {
      border: 1px solid ${theme.colors.violet600};
      background: ${theme.colors.violet500};
    }
    &:disabled {
      background: ${theme.colors.gray300};
    }
  }
  &.light {
    background: ${theme.colors.violet100};
    border: 1px solid ${theme.colors.violet600};
    color: ${theme.colors.gray800};
    ${(props) => props.theme.fonts.medium16};
    &:hover:not(:disabled) {
      background: ${theme.colors.violet200};
    }
  }
  &.riot {
    background: ${theme.colors.red500};
    border: none;
    color: ${theme.colors.white};
    ${(props) => props.theme.fonts.bold14};
  }

  @media (max-width: 700px) {
    height: ${({ $height }) => $height || "45px"};
    border-radius: 6px;
  }
`;

const Icon = styled(Image)``;

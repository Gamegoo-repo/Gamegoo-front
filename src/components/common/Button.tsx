import { theme } from "@/styles/theme";
import styled from "styled-components";

interface ButtonProps {
  buttonType?: "primary" | "secondary" | "default" | "";
  type?: "submit" | "reset" | "button" | undefined;
  size?: "small" | "medium" | "large";
  width?: string;
  text: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

const Button = (props: ButtonProps) => {
  const {
    buttonType = "default",
    size,
    width,
    text,
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
      width={width}
    >
      {text}
    </StyledButton>
  );
};

export default Button;

const StyledButton = styled.button<{ width?: string }>`
  width: ${({ width }) => width || "100%"};
  padding: 19px 30px;
  border: none;
  border-radius: 15px;
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.bold14};
  white-space: nowrap;

  /*buttonType*/
  &.primary {
    background: ${theme.colors.purple100};
    &:hover:not(:disabled) {
      background: #7362de;
      color: rgba(255, 255, 255, 0.42);
    }
    &:disabled {
      background: #c5c5c7;
    }
  }
  &.secondary {
    background: ${theme.colors.gray100};
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
    color: ${theme.colors.black};
    ${(props) => props.theme.fonts.medium16};
    &:hover:not(:disabled) {
      border: 1px solid ${theme.colors.purple100};
      background: ${theme.colors.purple500};
    }
    &:disabled {
      background: #c5c5c7;
    }
  }
`;

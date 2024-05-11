import { theme } from "@/styles/theme";
import styled from "styled-components";

interface ButtonProps {
  buttonType: "primary" | "secondary" | "default";
  size?: "small" | "medium" | "large";
  text: string;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
}

const Button = (props: ButtonProps) => {
  const { buttonType = "default", size, text, onClick, disabled } = props;

  let buttonClassName = buttonType;
  if (size) {
    buttonClassName += " ${size}";
  }

  return (
    <StyledButton className={buttonType} onClick={onClick} disabled={disabled}>
      {text}
    </StyledButton>
  );
};

export default Button;

const StyledButton = styled.button`
  width: 100%;
  padding: 19px 60px;
  border: none;
  border-radius: 15px;
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.bold14};

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
      background: #c5c5c7;
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

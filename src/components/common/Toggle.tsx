import styled, { css } from "styled-components";

import { theme } from "@/styles/theme";

import type { Mike } from "@/types";

interface ToggleProps {
  isOn: Mike;
  onToggle: (state: Mike) => void;
  disabled?: boolean;
  type?: string;
  isBlind?: boolean;
}

const Toggle = (props: ToggleProps) => {
  const { isOn, onToggle, disabled = false, type, isBlind = false } = props;

  const toggleHandler = () => {
    const newState = isOn === "AVAILABLE" ? "UNAVAILABLE" : "AVAILABLE";
    onToggle(newState);
  };

  return (
    <>
      <ToggleContainer
        onClick={toggleHandler}
        disabled={disabled}
        $type={type}
        $isBlind={isBlind}
      >
        <div
          className={`toggle-circle ${
            isOn === "AVAILABLE" ? null : "unchecked"
          }`}
        />
        <div
          className={`toggle-container ${
            isOn === "AVAILABLE" ? null : "unchecked"
          }`}
        />
      </ToggleContainer>
    </>
  );
};

export default Toggle;

const ToggleContainer = styled.div<{
  disabled: boolean;
  $type: string | undefined;
  $isBlind: boolean;
}>`
  position: relative;
  cursor: pointer;
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};

  > .toggle-container {
    width: ${({ $type }) =>
      $type === "board" ? "67px" : $type === "mini" ? "60px" : "87px"};
    height: ${({ $type }) =>
      $type === "board" ? "37px" : $type === "mini" ? "34px" : "46px"};
    border-radius: 49px;
    background-color: ${theme.colors.violet400};
    /* ${({ disabled }) =>
      disabled &&
      css`
        background-color: ${theme.colors.gray200};
      `} */
    @media (max-width: ${theme.breakpoints.mobile}) {
      width: 54px;
      height: 32px;
    }
  }

  > .unchecked {
    background-color: ${theme.colors.gray500};
    transition: 0.5s;
    /* ${({ disabled }) =>
      disabled &&
      css`
        background-color: ${theme.colors.gray200};
      `} */
    ${({ $isBlind }) =>
      $isBlind &&
      css`
        background-color: ${theme.colors.gray400};
        background-color: #606060;
      `}
  }

  > .toggle-circle {
    position: absolute;
    top: 50%;
    left: ${({ $type }) =>
      $type === "board" ? "35px" : $type === "mini" ? "32px" : "46px"};
    transform: translate(0, -50%);
    width: ${({ $type }) =>
      $type === "board" ? "27px" : $type === "mini" ? "22px" : "33px"};
    height: ${({ $type }) =>
      $type === "board" ? "27px" : $type === "mini" ? "22px" : "33px"};
    border-radius: 50%;
    background-color: rgb(255, 254, 255);
    transition: 0.5s;
    /* ${({ disabled }) =>
      disabled &&
      css`
        background-color: ${theme.colors.gray300};
      `} */
    @media (max-width: ${theme.breakpoints.mobile}) {
      width: 22px;
      height: 22px;
      left: 25px;
    }
  }
  > .unchecked {
    left: 8px;
    transition: 0.5s;
    @media (max-width: ${theme.breakpoints.mobile}) {
      left: 8px;
    }
  }
`;

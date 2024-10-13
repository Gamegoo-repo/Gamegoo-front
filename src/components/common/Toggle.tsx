import { theme } from "@/styles/theme";
import styled from "styled-components";
import { css } from "styled-components";

interface ToggleProps {
  isOn: boolean;
  onToggle: (state: boolean) => void;
  disabled?: boolean;
  type?: string;
  isBlind?: boolean;
}

const Toggle = (props: ToggleProps) => {
  const { isOn, onToggle, disabled = false, type, isBlind = false } = props;

  const toggleHandler = () => {
    const newState = !isOn;
    onToggle(newState);
    console.log("New state:", newState);
  };

  return (
    <>
      <ToggleContainer
        onClick={toggleHandler}
        disabled={disabled}
        $type={type}
        $isBlind={isBlind}
      >
        <div className={`toggle-circle ${isOn ? null : "toggle--unchecked"}`} />
        <div
          className={`toggle-container ${isOn ? null : "toggle--unchecked"}`}
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
      $type === "board" ? "67px" : $type === "mini" ? "62px" : "87px"};
    height: ${({ $type }) =>
      $type === "board" ? "37px" : $type === "mini" ? "32px" : "46px"};
    border-radius: 49px;
    background-color: ${theme.colors.purple200};
    /* ${({ disabled }) =>
      disabled &&
      css`
        background-color: ${theme.colors.gray200};
      `} */
  }

  > .toggle--unchecked {
    background-color: ${theme.colors.gray300};
    transition: 0.5s;
    /* ${({ disabled }) =>
      disabled &&
      css`
        background-color: ${theme.colors.gray200};
      `} */
    ${({ $isBlind }) =>
      $isBlind &&
      css`
        background-color: ${theme.colors.gray800};
      `}
  }

  > .toggle-circle {
    position: absolute;
    top: 50%;
    left: 8px;
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
  }
  > .toggle--unchecked {
    left: ${({ $type }) =>
      $type === "board" ? "35px" : $type === "mini" ? "32px" : "46px"};
    transition: 0.5s;
  }
`;

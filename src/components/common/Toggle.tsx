import { theme } from "@/styles/theme";
import styled from "styled-components";

interface ToggleProps {
  isOn: boolean;
  onToggle: (state: boolean) => void;
  type?: 'board';
}

const Toggle = (props: ToggleProps) => {
  const { isOn = false, onToggle, type } = props;
  const toggleHandler = () => {
    onToggle(!isOn);
  };

  return (
    <>
      <ToggleContainer onClick={toggleHandler} $type={type}>
        <div className={`toggle-circle ${isOn ? null : "toggle--unchecked"}`} />
        <div
          className={`toggle-container ${isOn ? null : "toggle--unchecked"}`}
        />
      </ToggleContainer>
    </>
  );
};

export default Toggle;

const ToggleContainer = styled.div<{ $type: string | undefined }>`
  position: relative;
  cursor: pointer;

  > .toggle-container {
    width: ${({ $type }) =>
    $type === 'board'
      ? '67px'
      : '87px'};
    height: ${({ $type }) =>
    $type === 'board'
      ? '37px'
      : '46px'};
    border-radius: 49px;
    background-color: ${theme.colors.purple200};
  }

  > .toggle--unchecked {
    background-color: ${theme.colors.gray300};
    transition: 0.5s;
  }

  > .toggle-circle {
    position: absolute;
    top: 50%;
    left: 8px;
    transform: translate(0, -50%);
    width: ${({ $type }) =>
    $type === 'board'
      ? '27px'
      : '33px'};
    height: ${({ $type }) =>
    $type === 'board'
      ? '27px'
      : '33px'};
    border-radius: 50%;
    background-color: rgb(255, 254, 255);
    transition: 0.5s;
  }
  > .toggle--unchecked {
    left: ${({ $type }) =>
    $type === 'board'
      ? '35px'
      : '46px'};
    transition: 0.5s;
  }
`;

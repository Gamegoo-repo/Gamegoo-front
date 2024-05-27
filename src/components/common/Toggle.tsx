import { theme } from "@/styles/theme";
import { useState } from "react";
import styled from "styled-components";

const Toggle = () => {
  const [isOn, setisOn] = useState(false);

  const toggleHandler = () => {
    setisOn(!isOn);
  };

  return (
    <>
      <ToggleContainer onClick={toggleHandler}>
        <div className={`toggle-circle ${isOn ? null : "toggle--unchecked"}`} />
        <div
          className={`toggle-container ${isOn ? null : "toggle--unchecked"}`}
        />
      </ToggleContainer>
    </>
  );
};

export default Toggle;

const ToggleContainer = styled.div`
  position: relative;
  cursor: pointer;

  > .toggle-container {
    width: 87px;
    height: 46px;
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
    width: 33px;
    height: 33px;
    border-radius: 50%;
    background-color: rgb(255, 254, 255);
    transition: 0.5s;
  }
  > .toggle--unchecked {
    left: 46px;
    transition: 0.5s;
  }
`;

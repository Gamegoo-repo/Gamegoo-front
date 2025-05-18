import styled, { keyframes } from "styled-components";
import { theme } from "@/styles/theme";
import { useEffect, useState } from "react";

type positionType = "top" | "right" | "board";
interface MannerLevelProps {
  level: number;
  onClick: (e: React.MouseEvent) => void;
  position?: positionType;
}

const MannerLevel = (props: MannerLevelProps) => {
  const { level, onClick, position = "top" } = props;

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {}, [isVisible]);

  return (
    <>
      {level && (
        <LevelWrapper>
          <Level>
            <ClickArea onClick={onClick}>
              <Text>LV.{level}</Text>
            </ClickArea>
            <BubbleWrapper
              $position={position}
              data-hide={!isVisible ? "true" : undefined}
            >
              <Bubble $position={position}>
                <P>클릭해서 매너키워드 보기</P>
              </Bubble>
            </BubbleWrapper>
          </Level>
        </LevelWrapper>
      )}
    </>
  );
};

export default MannerLevel;

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOutDown = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(10px);
  }
`;

const LevelWrapper = styled.div`
  position: relative;
`;

const BubbleWrapper = styled.div<{
  $position: positionType;
  "data-hide"?: string;
}>`
  position: absolute;
  bottom: ${({ $position }) =>
    $position === "top" ? "45px" : $position === "board" ? "80px" : "10px"};
  right: ${({ $position }) =>
    $position === "top" ? "-6px" : $position === "board" ? "-80px" : "-150px"};

  animation: ${({ "data-hide": hide }) =>
      hide === "true" ? fadeOutDown : fadeInUp}
    0.5s ease-out;
  animation-fill-mode: forwards;
`;

const Bubble = styled.div<{
  $position: positionType;
}>`
  border: 1px solid ${theme.colors.violet400};
  padding: 7px 13px;
  background: ${theme.colors.gray100};
  border-radius: 46px;
  white-space: nowrap;

  &:before {
    content: "";
    position: absolute;
    bottom: -10.5px;
    border-width: 11px 8px 0;
    border-style: solid;
    border-color: ${theme.colors.violet400} transparent transparent transparent;
    border-style: solid;
    width: 0;
    height: 0;

    ${({ $position }) =>
      $position === "board"
        ? `
      left: 24px;
      `
        : `
        left: 100px;
      `}
  }

  &:after {
    content: "";
    position: absolute;
    bottom: -6px;
    bottom: -9px;
    border-width: 10px 7.5px 0;
    border-style: solid;
    border-color: ${theme.colors.gray100} transparent transparent transparent;
    border-style: solid;
    width: 0;
    height: 0;

    ${({ $position }) =>
      $position === "board"
        ? `
    left: 25px;
      `
        : `
      left: 101px;
      `}
  }
`;

const P = styled.p`
  ${theme.fonts.medium11};
  color: ${theme.colors.gray800};
`;

const Level = styled.div`
  position: relative;
`;

const ClickArea = styled.div`
  width: 53px;
  height: 26px;
  background: #000000a6;
  padding: 5px 11px;
  box-shadow: 0 4px 4px 0 #00000040;
  border-radius: 57px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Text = styled.p`
  ${(props) => props.theme.fonts.bold14};
  color: ${theme.colors.violet300};
`;

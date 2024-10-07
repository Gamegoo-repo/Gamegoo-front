import styled, { keyframes } from "styled-components";
import { theme } from "@/styles/theme";
import { useEffect, useState } from "react";

type positionType = "top" | "right";
interface MannerLevelProps {
  forNoData: string;
  level: number;
  onClick: (e: React.MouseEvent) => void;
  position?: positionType;
}

const MannerLevel = (props: MannerLevelProps) => {
  const { forNoData, level, onClick, position = "top" } = props;

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
            <ClickArea
              onClick={onClick}
              className={!forNoData ? "bigMargin" : ""}
            >
              <Text>LV.{level}</Text>
            </ClickArea>
            <BubbleWrapper
              $position={position}
              data-hide={!isVisible ? "true" : undefined}
            >
              <Bubble>
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
  bottom: ${({ $position }) => ($position === "top" ? "45px" : "10px")};
  right: ${({ $position }) => ($position === "top" ? "-6px" : "-150px")};

  animation: ${({ "data-hide": hide }) =>
      hide === "true" ? fadeOutDown : fadeInUp}
    0.5s ease-out;
  animation-fill-mode: forwards;
`;

const Bubble = styled.div`
  border: 1px solid ${theme.colors.purple200};
  padding: 7px 13px;
  background: ${theme.colors.purple500};
  border-radius: 46px;
  white-space: nowrap;

  &:before {
    content: "";
    position: absolute;
    bottom: -11.5px;
    left: 100px;
    width: 0;
    height: 0;
    border-width: 12px 8px 0;
    border-style: solid;
    border-color: ${theme.colors.purple200} transparent transparent transparent;
  }

  &:after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 101px;
    width: 0;
    height: 0;
    border-width: 11px 7px 0;
    border-style: solid;
    border-color: ${theme.colors.purple500} transparent transparent transparent;
  }
`;

const P = styled.p`
  ${(props) => props.theme.fonts.medium11};
  color: #000;
`;

const Level = styled.div`
  position: relative;
`;

const ClickArea = styled.div`
  &.bigMargin {
    margin-left: 40.63px;
  }
  margin-left: 23px;
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
  color: ${theme.colors.purple300};
`;

import styled from "styled-components";
import { theme } from "@/styles/theme";

type positionType = "top" | "right";
interface MannerLevelProps {
  level: number;
  onClick: (e: React.MouseEvent) => void;
  position?: positionType;
}

const MannerLevel = (props: MannerLevelProps) => {
  const { level, onClick, position = "top" } = props;

  return (
    <>
      <LevelWrapper>
        <Level>
          <ClickArea onClick={onClick}>
          <Text>LV.{level}</Text>
          </ClickArea>
          <BubbleWrapper position={position}>
            <Bubble>
              <P>클릭해서 매너키워드 보기</P>
            </Bubble>
          </BubbleWrapper>
        </Level>
      </LevelWrapper>
    </>
  );
};

export default MannerLevel;

const LevelWrapper = styled.div`
  position: relative;
`;

const BubbleWrapper = styled.div<{ position: positionType }>`
  position: absolute;
  bottom: ${({ position }) => (position === "top" ? "45px" : "10px")};
  right: ${({ position }) => (position === "top" ? "-6px" : "-150px")};
`;

const Bubble = styled.div`
  border: 1px solid ${theme.colors.purple200};
  padding: 7px 13px;
  background: ${theme.colors.purple500};
  border-radius: 46px;
  white-space: nowrap;
  &:before {
    content: '';
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
    content: '';
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
  margin-left: 23px;
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
  color: ${theme.colors.purple300};
`;

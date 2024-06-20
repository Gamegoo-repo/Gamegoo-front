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
      <LevelWrapper onClick={onClick}>
        <Level>
          <Text>LV.{level}</Text>
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
  right: ${({ position }) => (position === "top" ? "-12px" : "-150px")};
`;

const Bubble = styled.div`
  border: 1px solid ${theme.colors.purple200};
  padding: 7px 13px;
  background: ${theme.colors.purple500};
  border-radius: 46px;
  white-space: nowrap;
  &:after {
    content: "";
    display: block;
    position: absolute;
    bottom: -6px;
    right: 32px;
    width: 12px;
    height: 12px;
    /* top: 50%;
    left: -6px;
    width: 12px;
    height: 12px;
    transform: rotate(45deg) translateY(-50%); */
    background: #f2f0fc;
    border-left: 1px solid ${theme.colors.purple200};
    border-bottom: 1px solid ${theme.colors.purple200};
    transform: rotate(-45deg);
  }
`;

const P = styled.p`
  ${(props) => props.theme.fonts.medium11};
  color: #000;
`;

const Level = styled.div`
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
  position: relative;
`;

const Text = styled.p`
  ${(props) => props.theme.fonts.bold14};
  color: ${theme.colors.purple300};
`;

import { theme } from "@/styles/theme";
import styled from "styled-components";
import Random from "../../../public/assets/icons/position_random_unclicked.svg";
import Top from "../../../public/assets/icons/position_top_unclicked.svg";
import Jungle from "../../../public/assets/icons/position_jungle_unclicked.svg";
import Mid from "../../../public/assets/icons/position_mid_unclicked.svg";
import Bottom from "../../../public/assets/icons/position_bottom_unclicked.svg";
import Supporter from "../../../public/assets/icons/position_supporter_unclicked.svg";

interface PositionComponentProps {
  onClose: () => void;
  boxName: string;
  onSelect: (position: string) => void;
}

const PositionCategory = (props: PositionComponentProps) => {
  const { onClose, onSelect } = props;

  const handlePositionCategory = (positionName: string) => {
    onSelect(positionName);
    onClose();
  };

  return (
    <Wrapper>
      <Box>
        <RandomButton onClick={() => handlePositionCategory("random")}>
          <Random />
        </RandomButton>
        <TopButton onClick={() => handlePositionCategory("top")}>
          <Top />
        </TopButton>
        <JungleButton onClick={() => handlePositionCategory("jungle")}>
          <Jungle />
        </JungleButton>
        <MidButton onClick={() => handlePositionCategory("mid")}>
          <Mid />
        </MidButton>
        <BottomButton onClick={() => handlePositionCategory("bottom")}>
          <Bottom />
        </BottomButton>
        <SupporterButton onClick={() => handlePositionCategory("supporter")}>
          <Supporter />
        </SupporterButton>
      </Box>
    </Wrapper>
  );
};

export default PositionCategory;

const Wrapper = styled.div`
  width: 100%;
  position: absolute;
  top: 100px;
  left: calc(50% - 35px);
  z-index: 10;
  &.main {
    top: 47%;
    left: 10%;
  }
  &.sub {
    top: 47%;
    left: 28.5%;
  }
  &.want {
    top: 47%;
    left: 65.5%;
  }
`;

const Box = styled.div`
  display: flex;
  align-items: center;
  column-gap: 50px;
  width: 482px;
  padding: 18px 27px;
  background: ${theme.colors.black};
  border-radius: 16.3px;
  &:after {
    border-top: 0 solid transparent;
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    border-bottom: 18px solid ${theme.colors.black};
    content: "";
    position: absolute;
    top: -13px;
    left: 27px;
  }
`;

const RandomButton = styled.button`
  &:hover path {
    stroke: ${theme.colors.purple200};
  }
  &:active,
  &:focus path {
    stroke: ${theme.colors.purple100};
  }
`;

const TopButton = styled.button`
  &:hover path:first-child {
    fill: ${theme.colors.purple200};
  }
  &:active,
  &:focus path:first-child {
    fill: ${theme.colors.purple100};
  }
`;

const JungleButton = styled.button`
  &:hover path {
    fill: ${theme.colors.purple200};
  }
  &:active,
  &:focus path {
    fill: ${theme.colors.purple100};
  }
`;

const MidButton = styled.button`
  &:hover path:nth-child(2) {
    fill: ${theme.colors.purple200};
  }
  &:active,
  &:focus path:nth-child(2) {
    fill: ${theme.colors.purple100};
  }
`;

const BottomButton = styled.button`
  &:hover path:nth-child(2) {
    fill: ${theme.colors.purple200};
  }
  &:active,
  &:focus path:nth-child(2) {
    fill: ${theme.colors.purple100};
  }
`;

const SupporterButton = styled.button`
  &:hover path {
    fill: ${theme.colors.purple200};
  }
  &:active,
  &:focus path {
    fill: ${theme.colors.purple100};
  }
`;

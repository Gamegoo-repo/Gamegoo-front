import { theme } from "@/styles/theme";
import styled from "styled-components";
import All from "../../../public/assets/icons/position_all_unclicked.svg";
import Top from "../../../public/assets/icons/position_top_unclicked.svg";
import Jungle from "../../../public/assets/icons/position_jungle_unclicked.svg";
import Mid from "../../../public/assets/icons/position_mid_unclicked.svg";
import OndDeal from "../../../public/assets/icons/position_one_deal_unclicked.svg";
import Supporter from "../../../public/assets/icons/position_supporter_unclicked.svg";

interface PositionComponentProps {
  onClose: () => void;
  boxName: string;
  onSelect: (positionId: number) => void;
}

const PositionCategory = (props: PositionComponentProps) => {
  const { onClose, onSelect } = props;

  const handlePositionCategory = (positionId: number) => {
    onSelect(positionId);
    onClose();
  };

  return (
    <Wrapper>
      <Box>
        <AllButton onClick={() => handlePositionCategory(0)}>
          <All />
        </AllButton>
        <TopButton onClick={() => handlePositionCategory(1)}>
          <Top />
        </TopButton>
        <JungleButton onClick={() => handlePositionCategory(2)}>
          <Jungle />
        </JungleButton>
        <MidButton onClick={() => handlePositionCategory(3)}>
          <Mid />
        </MidButton>
        <OneDealButton onClick={() => handlePositionCategory(4)}>
          <OndDeal />
        </OneDealButton>
        <SupporterButton onClick={() => handlePositionCategory(5)}>
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

const AllButton = styled.button`
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

const OneDealButton = styled.button`
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

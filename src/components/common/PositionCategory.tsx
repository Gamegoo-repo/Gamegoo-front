import { theme } from "@/styles/theme";
import styled from "styled-components";
import All from "../../../public/assets/images/position/position_all_unclicked.svg";
import Top from "../../../public/assets/images/position/position_top_unclicked.svg";
import Jungle from "../../../public/assets/images/position/position_jungle_unclicked.svg";
import Mid from "../../../public/assets/images/position/position_mid_unclicked.svg";
import OndDeal from "../../../public/assets/images/position/position_one_deal_unclicked.svg";
import Supporter from "../../../public/assets/images/position/position_supporter_unclicked.svg";
import React, { useEffect } from "react";
import { Position } from "@/types/position/position";

interface PositionComponentProps {
  onClose: () => void;
  boxName?: string;
  onSelect: (positionName: Position) => void;
}

const PositionCategory = (props: PositionComponentProps) => {
  const { onClose, onSelect } = props;
  const boxRef = React.useRef<HTMLDivElement>(null);

  const handlePositionCategory = (positionName: Position) => {
    onSelect(positionName);
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <Wrapper>
      <Box ref={boxRef}>
        <AllButton onClick={() => handlePositionCategory("ANY")}>
          <All />
        </AllButton>
        <TopButton onClick={() => handlePositionCategory("TOP")}>
          <Top />
        </TopButton>
        <JungleButton onClick={() => handlePositionCategory("JUNGLE")}>
          <Jungle />
        </JungleButton>
        <MidButton onClick={() => handlePositionCategory("MID")}>
          <Mid />
        </MidButton>
        <OneDealButton onClick={() => handlePositionCategory("ADC")}>
          <OndDeal />
        </OneDealButton>
        <SupporterButton onClick={() => handlePositionCategory("SUP")}>
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
  background: ${theme.colors.gray900};
  border-radius: 16.3px;
  &:after {
    border-top: 0 solid transparent;
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    border-bottom: 18px solid ${theme.colors.gray900};
    content: "";
    position: absolute;
    top: -13px;
    left: 27px;
  }
`;

const AllButton = styled.button`
  &:hover path {
    stroke: ${theme.colors.violet200};
  }
  &:active,
  &:focus path {
    stroke: ${theme.colors.violet600};
  }
`;

const TopButton = styled.button`
  &:hover path:first-child {
    fill: ${theme.colors.violet200};
  }
  &:active,
  &:focus path:first-child {
    fill: ${theme.colors.violet600};
  }
`;

const JungleButton = styled.button`
  &:hover path {
    fill: ${theme.colors.violet200};
  }
  &:active,
  &:focus path {
    fill: ${theme.colors.violet600};
  }
`;

const MidButton = styled.button`
  &:hover path:nth-child(2) {
    fill: ${theme.colors.violet200};
  }
  &:active,
  &:focus path:nth-child(2) {
    fill: ${theme.colors.violet600};
  }
`;

const OneDealButton = styled.button`
  &:hover path:nth-child(2) {
    fill: ${theme.colors.violet200};
  }
  &:active,
  &:focus path:nth-child(2) {
    fill: ${theme.colors.violet600};
  }
`;

const SupporterButton = styled.button`
  &:hover path {
    fill: ${theme.colors.violet200};
  }
  &:active,
  &:focus path {
    fill: ${theme.colors.violet600};
  }
`;

import { theme } from "@/styles/theme";
import styled from "styled-components";
import React, { useEffect } from "react";
import { Position, PositionType } from "@/types/position/position";
import Image from "next/image";
import { POSITION } from "@/constants/position";
import All from "../../../public/assets/images/position/position_all_unclicked.svg";
import Top from "../../../public/assets/images/position/position_top_unclicked.svg";
import Jungle from "../../../public/assets/images/position/position_jungle_unclicked.svg";
import Mid from "../../../public/assets/images/position/position_mid_unclicked.svg";
import OneDeal from "../../../public/assets/images/position/position_one_deal_unclicked.svg";
import Supporter from "../../../public/assets/images/position/position_supporter_unclicked.svg";

interface PositionComponentProps {
  selectedBox?: PositionType | null;
  value?: Position | null;
  onSelect: (positionName: Position | null) => void;
  onClose: () => void;
}

const PositionCategory = (props: PositionComponentProps) => {
  const { selectedBox, value, onSelect, onClose } = props;
  const boxRef = React.useRef<HTMLDivElement>(null);

  const handlePositionCategory = (positionName: Position | null) => {
    if (value === positionName) {
      // 현재 선택 포지션 클릭시 초기화
      onSelect(null);
    } else {
      onSelect(positionName);
    }
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

  const getImageSrc = (position: Position | null) => {
    const positionData = POSITION.find((p) => p.key === position);
    if (!positionData || !positionData.image) return "";
    return `/assets/images/position/position_${positionData.image}_${
      value === position ? "purple" : "unclicked"
    }.svg`;
  };

  const getSvgComponent = (position: Position | null) => {
    switch (position) {
      case "ANY":
        return <All />;
      case "TOP":
        return <Top />;
      case "JUNGLE":
        return <Jungle />;
      case "MID":
        return <Mid />;
      case "ADC":
        return <OneDeal />;
      case "SUP":
        return <Supporter />;
      default:
        return <All />;
    }
  };

  const positionList =
    selectedBox === "want1" || selectedBox === "want2"
      ? POSITION.slice(2)
      : POSITION.slice(1);

  return (
    <Wrapper>
      <Box ref={boxRef}>
        {positionList.map((pos) => (
          <StyledButton
            key={pos.id}
            posKey={pos.key || null}
            onClick={() => handlePositionCategory(pos.key)}
          >
            {value === pos.key ? (
              <Image
                src={getImageSrc(pos.key)}
                alt={pos.key || "선택"}
                width={35}
                height={35}
              />
            ) : (
              getSvgComponent(pos.key)
            )}
          </StyledButton>
        ))}
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

const StyledButton = styled.button<{ posKey: Position | null }>`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  ${({ posKey }) =>
    (posKey === "ANY" || posKey === "JUNGLE" || posKey === "SUP") &&
    `
      &:hover path {
        fill: ${theme.colors.violet200};
      }
      &:active, &:focus path {
        fill: ${theme.colors.violet600};
      }
  `}

  ${({ posKey }) =>
    posKey === "TOP" &&
    `
      &:hover path:first-child {
        fill: ${theme.colors.violet200};
      }
      &:active, &:focus path:first-child {
        fill: ${theme.colors.violet600};
      }
  `}

  ${({ posKey }) =>
    (posKey === "MID" || posKey === "ADC") &&
    `
      &:hover path:nth-child(2) {
        fill: ${theme.colors.violet200};
      }
      &:active, &:focus path:nth-child(2) {
        fill: ${theme.colors.violet600};
      }
  `}
`;

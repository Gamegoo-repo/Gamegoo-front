import { theme } from "@/styles/theme";
import styled, { css } from "styled-components";
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
import useMediaQueries from "@/hooks/useMediaQueries";

interface PositionComponentProps {
  selectedBox?: PositionType | null;
  value?: Position | null;
  // onSelect: (selectedValues: Position | (Position | null)[]) => void;
  onSelect: (selectedValue: Position | null) => void;
  onClose: () => void;
}

const PositionCategory = (props: PositionComponentProps) => {
  const { selectedBox, value = [], onSelect, onClose } = props;
  const isMobile = useMediaQueries({ breakpoint: 700 });
  const boxRef = React.useRef<HTMLDivElement>(null);

  const handlePositionCategory = (positionName: Position | null) => {
    let updatedValue: Position | null;

    // 내가 찾는 포지션: 이미 선택한 포지션을 다시 클릭한 경우 → 해제
    if (selectedBox === "want" && value === positionName) {
      updatedValue = null;
    } else {
      updatedValue = positionName ?? "ANY";
    }

    onSelect(updatedValue);
  };

  const handleClose = () => {
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

  const getImageSrc = (position: Position) => {
    const positionData =
      POSITION.find((p) => p.key === position) || POSITION[1];

    return `/assets/images/position/position_${positionData.image}_unclicked.svg`;
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

  const positionList = selectedBox === "want" ? POSITION.slice(1) : POSITION;

  return (
    <Wrapper $isWant={selectedBox === "want"}>
      <Header>
        <Title>
          {selectedBox === "main"
            ? "주"
            : selectedBox === "sub"
            ? "부"
            : "내가 찾는"}{" "}
          포지션 선택
        </Title>
        <CloseButton onClick={() => handleClose()}>
          <Image
            src={"/assets/icons/close_white.svg"}
            width={16}
            height={16}
            alt="go"
          />
        </CloseButton>
      </Header>

      <Box $isWant={selectedBox === "want"} ref={boxRef}>
        {positionList.map((pos) => (
          <StyledButton
            key={pos.id}
            $posKey={pos.key}
            onClick={() => handlePositionCategory(pos.key)}
            $selected={value === pos.key}
          >
            {getSvgComponent(pos.key)}
          </StyledButton>
        ))}
      </Box>
    </Wrapper>
  );
};

export default PositionCategory;

const Wrapper = styled.div<{ $isWant: boolean }>`
  width: ${({ $isWant }) => ($isWant ? "383px" : "452px")};
  position: absolute;
  top: 80px;
  left: calc(50% - 35px);
  z-index: 10;
  border-radius: 20px;
  padding: 32px;
  background: rgba(0, 0, 0, 0.64);

  /* Background Blur */
  box-shadow: 0 4px 8.9px 0 rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(7.5px);

  @media (max-width: 700px) {
    width: 224px;
    ${({ $isWant }) =>
      $isWant &&
      css`
        left: calc(50% - 165px);
      `};
  }
`;

const Header = styled.div`
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.div`
  ${theme.fonts.bold20}
  color: ${theme.colors.white};
`;

const CloseButton = styled.button``;

const Box = styled.div<{ $isWant: boolean }>`
  display: flex;
  align-items: center;
  column-gap: 20px;
  width: ${({ $isWant }) => ($isWant ? "410px" : "482px")};

  &:after {
    border-top: 0 solid transparent;
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    border-bottom: 18px solid rgba(0, 0, 0, 0.64);
    content: "";
    position: absolute;
    top: -18px;
    left: 27px;

    @media (max-width: 700px) {
      ${({ $isWant }) =>
        $isWant &&
        css`
          left: 150px;
        `};
    }
  }

  @media (max-width: 700px) {
    width: 184px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    row-gap: 20px;
    column-gap: 0px;
  }
`;

const StyledButton = styled.button<{ $posKey: Position; $selected: boolean }>`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) =>
    props.$selected ? theme.colors.violet600 : "transparent"};
  border-radius: 6px;
  padding-top: 2px;
  padding-left: 1px;
  cursor: pointer;
`;

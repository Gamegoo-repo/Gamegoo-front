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
  value?: Position | (Position | null)[];
  onSelect: (selectedValues: Position | (Position | null)[]) => void;
  onClose: () => void;
}

const PositionCategory = (props: PositionComponentProps) => {
  const { selectedBox, value = [], onSelect, onClose } = props;
  const boxRef = React.useRef<HTMLDivElement>(null);

  const handlePositionCategory = (positionName: Position | null) => {
    let updatedValues: Position | (Position | null)[];

    if (selectedBox === "want") {
      // 찾는 포지션 (want) → 최대 2개 선택 가능
      let wantArray = Array.isArray(value) ? [...value] : [];

      // 이미 선택된 경우 → 제거
      if (wantArray.includes(positionName)) {
        updatedValues = wantArray.filter((v) => v !== positionName);
      } else if (wantArray.length < 2 || wantArray.includes(null)) {
        // 최대 2개 선택 가능
        const firstEmptyIndex = wantArray.indexOf(null);
        if (firstEmptyIndex !== -1) {
          wantArray[firstEmptyIndex] = positionName;
        } else {
          wantArray.push(positionName);
        }
        updatedValues = wantArray.slice(0, 2);
      } else {
        updatedValues = wantArray;
      }
    } else {
      // 주/부 포지션 (main, sub) → 하나만 선택 가능
      updatedValues = positionName || "ANY";
    }

    onSelect(updatedValues);
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
    <Wrapper>
      <Header>
        <Title>주 포지션 선택</Title>
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
          >
            {value.includes(pos.key) ? (
              <>
                <Image
                  src={getImageSrc(pos.key)}
                  alt={pos.key || "선택"}
                  width={25}
                  height={25}
                />
              </>
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
  width: 452px;
  position: absolute;
  top: 100px;
  left: calc(50% - 35px);
  z-index: 10;
  border-radius: 20px;
  padding: 32px;
  background: rgba(0, 0, 0, 0.64);

  /* Background Blur */
  box-shadow: 0 4px 8.9px 0 rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(7.5px);
`;

const Header = styled.div`
  margin-bottom: 45px;
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
    border-bottom: 18px solid ${theme.colors.gray900};
    content: "";
    position: absolute;
    top: -13px;
    left: 27px;
  }
`;

const StyledButton = styled.button<{ $posKey: Position }>`
  width: 48px;
  /* TODO */
  /* background: ${(props) =>
    props.$posKey ? theme.colors.violet600 : ""};   */
  border: none;
  padding: 0;
  cursor: pointer;
`;

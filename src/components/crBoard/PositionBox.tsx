import styled from "styled-components";
import Image from "next/image";
import { useState } from "react";
import PositionCategory from "../common/PositionCategory";

interface PositionBoxProps {
  status: "posting" | "reading";
  onPositionChange?: (newPositionValue: PositionState) => void;
}

type Position = "main" | "sub" | "want";

export interface PositionState {
  main: string;
  sub: string;
  want: string;
}

const PositionBox = (props: PositionBoxProps) => {
  const { status, onPositionChange } = props;
  const [selectedBox, setSelectedBox] = useState("");
  const [positionValue, setPositionValue] = useState<PositionState>({
    main: "",
    sub: "",
    want: "",
  });

  const handleCategoryButtonClick = (positionName: string) => {
    if (selectedBox) {
      const newPositionValue = {
        ...positionValue,
        [selectedBox]: positionName,
      };
      setPositionValue(newPositionValue);
      if (onPositionChange) {
        onPositionChange(newPositionValue);
      }
    }
  };

  const handlePositionImgSet = (buttonLabel: string) => {
    switch (buttonLabel) {
      case "random":
        return "/assets/icons/position_random_purple.svg";
      case "top":
        return "/assets/icons/position_top_purple.svg";
      case "jungle":
        return "/assets/icons/position_jungle_purple.svg";
      case "mid":
        return "/assets/icons/position_mid_purple.svg";
      case "bottom":
        return "/assets/icons/position_bottom_purple.svg";
      case "supporter":
        return "/assets/icons/position_supporter_purple.svg";
      default:
        return "/assets/icons/position_random_purple.svg";
    }
  };

  const [openPosition, setOpenPosition] = useState<Position | null>(null);

  const handleBoxClick = (position: Position) => {
    if (status === "reading") return;
    setOpenPosition((prevPosition) =>
      prevPosition === position ? null : position
    );
    setSelectedBox(position);
  };

  const closePosition = () => {
    setOpenPosition(null);
  };

  return (
    <PositionWrapper>
      <FirstBox>
        <Section>
          <Title>주 포지션</Title>
          <StyledImage
            $status={status}
            onClick={() => handleBoxClick("main")}
            src={handlePositionImgSet(positionValue.main)}
            width={35}
            height={34}
            alt="main position image"
          />
          {openPosition === "main" && (
            <PositionCategory
              onClose={closePosition}
              boxName={selectedBox}
              onSelect={handleCategoryButtonClick}
            />
          )}
        </Section>
        <Section>
          <Title>부 포지션</Title>
          <StyledImage
            $status={status}
            onClick={() => handleBoxClick("sub")}
            src={handlePositionImgSet(positionValue.sub)}
            width={35}
            height={34}
            alt="sub position image"
          />
          {openPosition === "sub" && (
            <PositionCategory
              onClose={closePosition}
              boxName={selectedBox}
              onSelect={handleCategoryButtonClick}
            />
          )}
        </Section>
      </FirstBox>
      <SecondBox>
        <Title>찾는 포지션</Title>
        <StyledImage
          $status={status}
          onClick={() => handleBoxClick("want")}
          src={handlePositionImgSet(positionValue.want)}
          width={35}
          height={34}
          alt="want position image"
        />
        {openPosition === "want" && (
          <PositionCategory
            onClose={closePosition}
            boxName={selectedBox}
            onSelect={handleCategoryButtonClick}
          />
        )}
      </SecondBox>
    </PositionWrapper>
  );
};

export default PositionBox;

const PositionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const FirstBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  white-space: nowrap;
  background: #f6f6f6;
  border-radius: 10px;
  padding: 24px 54px 24px 47px;
`;

const Section = styled.div`
  position: relative;
`;

const SecondBox = styled.div`
  text-align: center;
  background: #f6f6f6;
  white-space: nowrap;
  border-radius: 10px;
  padding: 24px 91px;
  position: relative;
`;

const Title = styled.p`
  ${(props) => props.theme.fonts.medium11};
  margin-bottom: 6px;
`;

const StyledImage = styled(Image)<{ $status: string }>`
  cursor: ${({ $status }) => ($status === "posting" ? "pointer" : "unset")};
`;

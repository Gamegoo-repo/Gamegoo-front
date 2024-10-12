import styled from "styled-components";
import Image from "next/image";
import { useEffect, useState } from "react";
import PositionCategory from "../common/PositionCategory";

type Status = "reading" | "posting";

interface PositionBoxProps {
  status?: Status;
  onPositionChange?: (newPositionValue: PositionState) => void;
  main: number | undefined;
  sub: number | undefined;
  want: number | undefined;
}

type Position = "main" | "sub" | "want";

export interface PositionState {
  main: number | undefined;
  sub: number | undefined;
  want: number | undefined;
}

const PositionBox = (props: PositionBoxProps) => {
  const { status, onPositionChange, main, sub, want } = props;
  const [selectedBox, setSelectedBox] = useState("");
  const [openPosition, setOpenPosition] = useState<Position | null>(null);
  const [positionValue, setPositionValue] = useState<PositionState>({
    main: main,
    sub: sub,
    want: want,
  });

  useEffect(() => {
    setPositionValue({
      main: main ?? 0,
      sub: sub ?? 0,
      want: want ?? 0,
    });
  }, [main, sub, want]);

  const handleCategoryButtonClick = (positionId: number) => {
    if (selectedBox) {
      setPositionValue((prevPositionValue) => ({
        ...prevPositionValue,
        [selectedBox]: positionId,
      }));
      if (onPositionChange) {
        onPositionChange({
          ...positionValue,
          [selectedBox]: positionId,
        });
      }
    }
  };

  const handlePositionImgSet = (positionId: number | undefined) => {
    switch (positionId) {
      case 0:
        return "/assets/icons/position_all_purple.svg";
      case 1:
        return "/assets/icons/position_top_purple.svg";
      case 2:
        return "/assets/icons/position_jungle_purple.svg";
      case 3:
        return "/assets/icons/position_mid_purple.svg";
      case 4:
        return "/assets/icons/position_one_deal_purple.svg";
      case 5:
        return "/assets/icons/position_supporter_purple.svg";
      default:
        return "/assets/icons/position_all_purple.svg";
    }
  };

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
            alt="메인 포지션"
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
            alt="부 포지션"
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
          alt="찾는 포지션"
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
  width: 100%;
  white-space: nowrap;
  background: #f6f6f6;
  border-radius: 10px;
  padding: 24px 54px 24px 47px;
  gap: 59px;
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

const StyledImage = styled(Image) <{ $status: string | undefined }>`
  cursor: ${({ $status }) => ($status === "posting" ? "pointer" : "unset")};
`;
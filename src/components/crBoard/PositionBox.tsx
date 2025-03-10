import styled from "styled-components";
import Image from "next/image";
import { useState } from "react";
import PositionCategory from "../common/PositionCategory";
import { Position, PositionType } from "@/types/position/position";
import { theme } from "@/styles/theme";
import { POSITION } from "@/constants/position";

type Status = "reading" | "posting";

interface PositionBoxProps {
  status?: Status;
  onPositionChange?: (newPositionValue: PositionState) => void;
  main: Position | null;
  sub: Position | null;
  want: (Position | null)[] | null;
}

export interface PositionState {
  main: Position;
  sub: Position;
  want: (Position | null)[] | null;
}

const PositionBox = (props: PositionBoxProps) => {
  const { status, onPositionChange, main, sub, want } = props;
  const [selectedBox, setSelectedBox] = useState<PositionType | null>(null);
  const [openPosition, setOpenPosition] = useState<PositionType | null>(null);
  const [positionValue, setPositionValue] = useState<PositionState>({
    main: main || "ANY",
    sub: sub || "ANY",
    want: want ?? [],
  });

  /* 포지션 선택  */
  const handleCategoryButtonClick = (
    selectedValues: Position | (Position | null)[]
  ) => {
    setPositionValue((prev) => {
      let updated;

      if (selectedBox === "want") {
        // `want`는 배열 형태로 유지 (최대 2개 선택 가능)
        updated = {
          ...prev,
          want: Array.isArray(selectedValues)
            ? selectedValues
            : [selectedValues],
        };
        console.log(updated);
      } else {
        // `main`과 `sub`은 단일 값만 저장
        updated = {
          ...prev,
          [selectedBox as "main" | "sub"]: selectedValues as Position,
        };
      }

      onPositionChange && onPositionChange(updated);
      return updated;
    });
  };

  const handlePositionImgSet = (positionId: Position | undefined | null) => {
    // console.log("handlePositionImgSet", positionId);
    const positionData = POSITION.find((p) => p.key === positionId);
    if (!positionData || !positionData.image)
      return "/assets/icons/bottom_caution.svg";
    return `/assets/images/position/position_${positionData.image}_purple.svg`;
  };

  const handleBoxClick = (position: PositionType) => {
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
              selectedBox={selectedBox}
              onClose={closePosition}
              value={positionValue.main}
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
              selectedBox={selectedBox}
              onClose={closePosition}
              value={positionValue.sub}
              onSelect={handleCategoryButtonClick}
            />
          )}
        </Section>
      </FirstBox>
      <SecondBox>
        <Title>찾는 포지션</Title>
        <WantPWrapper>
          <StyledImage
            $status={status}
            onClick={() => handleBoxClick("want")}
            src={handlePositionImgSet(positionValue.want?.[0])}
            width={35}
            height={34}
            alt="첫 번째 찾는 포지션"
          />
          {(positionValue.want?.[1] || status === "posting") && (
            <StyledImage
              $status={status}
              onClick={() => handleBoxClick("want")}
              src={handlePositionImgSet(positionValue.want?.[1])}
              width={35}
              height={34}
              alt="두 번째 찾는 포지션"
            />
          )}
          {openPosition === "want" && (
            <PositionCategory
              selectedBox={selectedBox}
              onClose={closePosition}
              value={positionValue.want || []}
              onSelect={handleCategoryButtonClick}
            />
          )}
        </WantPWrapper>
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
  background: ${theme.colors.gray100};
  border-radius: 10px;
  padding: 24px 54px 24px 47px;
  gap: 59px;
`;

const Section = styled.div`
  position: relative;
`;

const SecondBox = styled.div`
  text-align: center;
  background: ${theme.colors.gray100};
  white-space: nowrap;
  border-radius: 10px;
  padding: 24px 91px;
  position: relative;
`;

const WantPWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
`;

const Title = styled.p`
  color: ${theme.colors.gray800};
  ${(props) => props.theme.fonts.medium11};
  margin-bottom: 6px;
`;

const StyledImage = styled(Image)<{ $status: string | undefined }>`
  cursor: ${({ $status }) => ($status === "posting" ? "pointer" : "unset")};
`;

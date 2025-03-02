import styled from "styled-components";
import Image from "next/image";
import { useEffect, useState } from "react";
import PositionCategory from "../common/PositionCategory";
import { Position, PositionType } from "@/types/position/position";
import { theme } from "@/styles/theme";
import { POSITION } from "@/constants/position";

type Status = "reading" | "posting";

interface PositionBoxProps {
  status?: Status;
  onPositionChange?: (newPositionValue: PositionState) => void;
  main: Position | undefined;
  sub: Position | undefined;
  want: (Position | null)[] | undefined;
}

export interface PositionState {
  main: Position | undefined;
  sub: Position | undefined;
  want: (Position | null)[] | undefined | null;
}

const PositionBox = (props: PositionBoxProps) => {
  const { status, onPositionChange, main, sub, want } = props;
  const [selectedBox, setSelectedBox] = useState<PositionType | null>(null);
  const [openPosition, setOpenPosition] = useState<PositionType | null>(null);
  const [positionValue, setPositionValue] = useState<PositionState>({
    main: main,
    sub: sub,
    want: want ?? [null, null],
  });

  useEffect(() => {
    let finalWant: (Position | null)[] = want ?? [null, null];
    if (finalWant.length < 2) {
      finalWant = [finalWant[0] ?? null, null];
    } else if (finalWant.length > 2) {
      finalWant = [finalWant[0], finalWant[1]];
    }

    setPositionValue({
      main: main ?? "ANY",
      sub: sub ?? "ANY",
      want: finalWant,
    });
  }, [main, sub, want]);

  /* 포지션 선택  */
  const handleCategoryButtonClick = (positionName: Position | null) => {
    if (!selectedBox) return;

    // 포지션 박스 타입별 처리
    if (selectedBox === "main" || selectedBox === "sub") {
      setPositionValue((prev) => {
        const updated = { ...prev, [selectedBox]: positionName };
        onPositionChange && onPositionChange(updated);
        return updated;
      });
    } else {
      setPositionValue((prev) => {
        const newWant = [...(prev.want ?? [null, null])];
        if (selectedBox === "want1") {
          newWant[0] = positionName;
        } else if (selectedBox === "want2") {
          newWant[1] = positionName;
        }
        const updated = { ...prev, want: newWant };
        onPositionChange && onPositionChange(updated);
        return updated;
      });
    }
  };

  const handlePositionImgSet = (positionId: Position | undefined | null) => {
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
            onClick={() => handleBoxClick("want1")}
            src={handlePositionImgSet(positionValue.want?.[0])}
            width={35}
            height={34}
            alt="첫 번째 찾는 포지션"
          />
          {openPosition === "want1" && (
            <PositionCategory
              selectedBox={selectedBox}
              onClose={closePosition}
              value={positionValue.want?.[0]}
              onSelect={handleCategoryButtonClick}
            />
          )}
          <StyledImage
            $status={status}
            onClick={() => handleBoxClick("want2")}
            src={handlePositionImgSet(positionValue.want?.[1])}
            width={35}
            height={34}
            alt="두 번째 찾는 포지션"
          />
          {openPosition === "want2" && (
            <PositionCategory
              selectedBox={"want2"}
              onClose={closePosition}
              value={positionValue.want?.[1]}
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

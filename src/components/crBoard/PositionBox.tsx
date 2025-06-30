import styled from "styled-components";
import Image from "next/image";
import { useState } from "react";
import PositionCategory from "../common/PositionCategory";
import { Position, PositionType } from "@/types/position/position";
import { theme } from "@/styles/theme";
import { POSITIONS } from "@/constants/profile";
import useMediaQueries from "@/hooks/useMediaQueries";
import { setPositionImg } from "@/utils/custom";
import { css } from "styled-components";

type Status = "reading" | "posting" | "matching";

interface PositionBoxProps {
  status?: Status;
  onPositionChange?: (newPositionValue: PositionState) => void;
  main: Position | null;
  sub: Position | null;
  want: (Position | null)[] | null;
  isEditable?: boolean;
}

export interface PositionState {
  main: Position;
  sub: Position;
  want: (Position | null)[] | null;
}

const PositionBox = (props: PositionBoxProps) => {
  const {
    status,
    onPositionChange,
    main,
    sub,
    want,
    isEditable = true,
  } = props;

  const isMobile = useMediaQueries({ breakpoint: 700 });
  const [positionValue, setPositionValue] = useState<PositionState>({
    main: main || "ANY",
    sub: sub || "ANY",
    want: want || [null, null],
  });

  const [isPositionOpen, setIsPositionOpen] = useState({
    main: false,
    sub: false,
    want: [false, false],
  });

  /* 포지션 선택  */
  const handlePosition = (type: "main" | "sub" | "want", index: number = 0) => {
    if (status === "reading") return;
    setIsPositionOpen((prev) => {
      if (type === "want") {
        const updated = prev.want.map((v, i) => (i === index ? !v : false));
        return { ...prev, want: updated, main: false, sub: false };
      } else {
        return { ...prev, [type]: !prev[type], want: [false, false] };
      }
    });
  };

  const handlePositionClose = (
    type: "main" | "sub" | "want",
    index: number = 0
  ) => {
    setIsPositionOpen((prev) => {
      if (type === "want") {
        const updated = [...prev.want];
        updated[index] = false;
        return { ...prev, want: updated };
      } else {
        return { ...prev, [type]: false };
      }
    });
  };

  const handleCategoryButtonClick = (
    selectedValue: Position | null,
    type: "main" | "sub" | "want",
    index: number = 0
  ) => {
    setPositionValue((prev) => {
      const updated = { ...prev };

      if (type === "want") {
        const updatedWant = [...(prev.want ?? [null, null])];
        updatedWant[index] =
          updatedWant[index] === selectedValue ? null : selectedValue;
        updated.want = updatedWant;
      } else {
        if (selectedValue === null) return prev; // main/sub에 null 불가
        updated[type] = selectedValue;
      }

      onPositionChange?.(updated);
      return updated;
    });

    handlePositionClose(type, index);
  };

  return (
    <PositionWrapper>
      <Positions>
        {/* 주 포지션 + 부 포지션 */}
        <PosiWrap $status={status}>
          {POSITIONS.slice(0, 2).map((position, index) => {
            const type = index === 0 ? "main" : "sub";

            return (
              <Posi key={index} $isWantP={false}>
                {position.label}
                <PosiItem>
                  <Image
                    src={setPositionImg(
                      type === "main"
                        ? (positionValue.main ?? "ANY")
                        : (positionValue.sub ?? "ANY")
                    )}
                    width={!isMobile ? 48 : 32}
                    height={!isMobile ? 48 : 32}
                    alt="포지션"
                    onClick={() => handlePosition(type)}
                  />
                  {isEditable && isPositionOpen[type] && (
                    <PositionCategory
                      selectedBox={type}
                      value={positionValue[type] ?? "ANY"}
                      onClose={() => handlePositionClose(type)}
                      onSelect={(val) => handleCategoryButtonClick(val, type)}
                    />
                  )}
                </PosiItem>
              </Posi>
            );
          })}
        </PosiWrap>

        {/* 내가 찾는 포지션 */}
        <PosiWrap $status={status}>
          <Posi key={2} $isWantP={true}>
            {POSITIONS[2].label}
            <PosiRow>
              {positionValue?.want?.map((posi, index) => (
                <PosiItem key={index}>
                  {posi ? (
                    <Image
                      src={setPositionImg(posi)}
                      width={!isMobile ? 48 : 32}
                      height={!isMobile ? 48 : 32}
                      alt="포지션"
                      onClick={() => handlePosition("want", index)}
                    />
                  ) : (
                    <Plus onClick={() => handlePosition("want", index)}>
                      <Image
                        src="/assets/icons/plus_violet.svg"
                        width={!isMobile ? 16 : 14}
                        height={!isMobile ? 16 : 14}
                        alt=""
                      />
                    </Plus>
                  )}
                  {/* PositionCategory 열기 조건 */}
                  {isEditable && isPositionOpen.want[index] && (
                    <PositionCategory
                      selectedBox="want"
                      value={posi}
                      onClose={() => handlePositionClose("want", index)}
                      onSelect={(val) =>
                        handleCategoryButtonClick(val, "want", index)
                      }
                      usedPositions={
                        positionValue.want?.filter(
                          (pos, i): pos is Position =>
                            i !== index && pos !== null
                        ) ?? []
                      }
                    />
                  )}
                </PosiItem>
              ))}
            </PosiRow>
          </Posi>
        </PosiWrap>
      </Positions>
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

const Positions = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 8px;
`;

const PosiWrap = styled.div<{ $status: Status | undefined }>`
  height: ${({ $status }) => ($status === "matching" ? "116px" : "98px")};
  display: flex;
  justify-content: center;
  gap: 58px;
  background-color: ${({ $status }) =>
    $status === "matching" ? theme.colors.gray100 : theme.colors.white};
  width: 100%;
  border-radius: 6px;
  padding: ${({ $status }) =>
    $status === "matching" ? "28px 43px" : "16px 43px"};

  @media (max-width: 700px) {
    height: 69px;
    padding: 12px 20px 8px 20px;
    gap: 12px;
  }
`;

const Posi = styled.div<{ $isWantP: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: ${theme.fonts.bold12};
  color: ${theme.colors.gray700};
  white-space: nowrap;

  @media (max-width: 700px) {
    font-size: ${theme.fonts.medium11};
    ${({ $isWantP }) =>
      $isWantP &&
      css`
        margin-left: 0px;
      `};
  }
`;

const PosiRow = styled.div`
  height: 48px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const PosiItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Plus = styled.div`
  display: flex;
  width: 48px;
  height: 32px;
  justify-content: center;
  align-items: center;
  border-radius: 999px;
  background: ${theme.colors.violet100};

  @media (max-width: 700px) {
    width: 32px;
    height: 24px;
  }
`;

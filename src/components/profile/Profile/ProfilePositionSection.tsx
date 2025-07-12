import React from "react";
import styled, { css } from "styled-components";

import { PositionCategory } from "@/components";
import Icon from "@/components/common/Icon";
import { POSITIONS } from "@/constants";
import { theme } from "@/styles/theme";
import { setPositionImg } from "@/utils/custom";

import type { Position, PositionType } from "@/types";

interface Props {
  profileType: "normal" | "wind" | "other" | "me";
  isMobile: boolean;
  isPositionOpen: {
    main: boolean;
    sub: boolean;
    want: boolean[];
  };
  positionValue: {
    main: Position | null;
    sub: Position | null;
    want: (Position | null)[];
  };
  handlePosition: (type: PositionType, index?: number) => void;
  handlePositionClose: (type: PositionType, index?: number) => void;
  handleCategoryButtonClick: (
    selectedValue: Position | null,
    type: PositionType,
    index?: number
  ) => void;
}

const ProfilePositionSection: React.FC<Props> = ({
  profileType,
  isMobile,
  isPositionOpen,
  positionValue,
  handlePosition,
  handlePositionClose,
  handleCategoryButtonClick,
}) => {
  return (
    <Positions>
      {/* 주/부 포지션 */}
      <PosiWrap>
        {POSITIONS.slice(0, 2).map((position, index) => {
          const type = index === 0 ? "main" : "sub";
          return (
            <Posi key={index} className={profileType} $isWantP={false}>
              {position.label}
              <PosiItem>
                <Icon
                  backgroundUrl={setPositionImg(
                    type === "main"
                      ? (positionValue.main ?? "ANY")
                      : (positionValue.sub ?? "ANY")
                  )}
                  width={!isMobile ? 55 : 22}
                  height={!isMobile ? 40 : 22}
                  onClick={() => handlePosition(type)}
                />
                {isPositionOpen[type] && (
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

      {/* 내가 원하는 포지션 */}
      <PosiWrap>
        <Posi className={profileType} $isWantP={true}>
          {POSITIONS[2].label}
          <PosiRow>
            {positionValue.want?.length > 0 ? (
              positionValue.want
                .concat(Array(2).fill(null))
                .slice(0, 2)
                .map((posi, index) => (
                  <PosiItem key={index}>
                    {posi ? (
                      <Icon
                        backgroundUrl={setPositionImg(posi)}
                        width={!isMobile ? 48 : 22}
                        height={!isMobile ? 40 : 22}
                        onClick={() => handlePosition("want", index)}
                      />
                    ) : (
                      ["wind", "normal"].includes(profileType) && (
                        <Plus onClick={() => handlePosition("want", index)}>
                          <Icon
                            backgroundUrl="/assets/icons/plus_violet.svg"
                            width={!isMobile ? 16 : 14}
                            height={!isMobile ? 16 : 14}
                          />
                        </Plus>
                      )
                    )}
                    {/* PositionCategory 열기 조건 */}
                    {isPositionOpen.want[index] && (
                      <PositionCategory
                        selectedBox="want"
                        value={posi}
                        onClose={() => handlePositionClose("want", index)}
                        onSelect={(val) =>
                          handleCategoryButtonClick(val, "want", index)
                        }
                        usedPositions={
                          positionValue.want?.filter(
                            (p, i): p is Position => i !== index && p !== null
                          ) ?? []
                        }
                      />
                    )}
                  </PosiItem>
                ))
            ) : // 매칭 프로필 - 포지션 선택, 조회 프로필 - ANY(*) 지정
            ["wind", "normal"].includes(profileType) ? (
              <PosiItem>
                <Plus onClick={() => handlePosition("want", 0)}>
                  <Icon
                    backgroundUrl="/assets/icons/plus_violet.svg"
                    width={!isMobile ? 16 : 14}
                    height={!isMobile ? 16 : 14}
                  />
                </Plus>
                {isPositionOpen.want[0] && (
                  <PositionCategory
                    selectedBox="want"
                    value={null}
                    onClose={() => handlePositionClose("want", 0)}
                    onSelect={(val) =>
                      handleCategoryButtonClick(val, "want", 0)
                    }
                    usedPositions={[]}
                  />
                )}
              </PosiItem>
            ) : (
              <PosiItem>
                <Icon
                  backgroundUrl={setPositionImg("ANY")}
                  width={!isMobile ? 48 : 22}
                  height={!isMobile ? 40 : 22}
                />
              </PosiItem>
            )}
          </PosiRow>
        </Posi>
      </PosiWrap>
    </Positions>
  );
};

export default ProfilePositionSection;

const Positions = styled.div`
  display: flex;
  align-items: center;
  width: 412px;
  gap: 12px;
  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 100%;
  }
`;

const PosiWrap = styled.div`
  height: 104px;
  display: flex;
  justify-content: center;
  gap: 12px;
  background-color: ${theme.colors.white};
  width: 100%;
  border-radius: 6px;
  padding: 16px 32px 12px 32px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    height: 69px;
    padding: 12px 20px 8px 20px;
  }
`;

const Posi = styled.div<{ $isWantP: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  font-size: ${theme.fonts.medium16};
  color: ${theme.colors.gray800};
  white-space: nowrap;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fonts.medium11};
    gap: 9px;
    ${({ $isWantP }) =>
      $isWantP &&
      css`
        margin-left: 0px;
      `};
  }
`;

const PosiRow = styled.div`
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 12px;
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

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 32px;
    height: 24px;
  }
`;

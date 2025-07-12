import { useEffect, useState } from "react";
import styled, { css } from "styled-components";

import { getMemberMannerKeyword } from "@/api";
import Icon from "@/components/common/Icon";
import { BAD_MANNER_TYPES, MANNER_TYPES } from "@/constants";
import { useMediaQueryContext } from "@/hooks";
import { theme } from "@/styles/theme";

import type { MannerKeyword } from "@/types";

interface MannerLevelBoxProps {
  memberId: number;
  level: number;
  top: string;
  right: string;
  tail?: boolean;
  tailPosition?: "center" | "top";
  onClose?: () => void;
}

const MannerLevelBox = (props: MannerLevelBoxProps) => {
  const {
    memberId,
    level,
    top,
    right,
    tail = false,
    tailPosition = "center",
    onClose,
  } = props;

  const { isMobile } = useMediaQueryContext();

  const [positiveKeywords, setPositiveKeywords] = useState<MannerKeyword[]>([]);
  const [negativeKeywords, setNegativeKeywords] = useState<MannerKeyword[]>([]);

  useEffect(() => {
    const getManners = async () => {
      const manner = await getMemberMannerKeyword(memberId);
      const positive = manner.data.mannerKeywords.filter(
        (keyword: MannerKeyword) =>
          keyword.mannerKeywordId >= 1 && keyword.mannerKeywordId <= 6
      );
      const negative = manner.data.mannerKeywords.filter(
        (keyword: MannerKeyword) => keyword.mannerKeywordId >= 7
      );

      setPositiveKeywords(positive);
      setNegativeKeywords(negative);
    };

    getManners();
  }, [memberId]);

  /* id로 매너 텍스트 가져오기 */
  const getMannerText = (id: number) => {
    const match = MANNER_TYPES.find((type) => type.id === id);
    return match ? match.text : "";
  };

  /* id로 비매너 텍스트 가져오기 */
  const getBadMannerText = (id: number) => {
    const match = BAD_MANNER_TYPES.find((type) => type.id === id);
    return match ? match.text : "";
  };

  return (
    <Wrapper
      $top={top}
      $right={right}
      $tail={tail}
      $tailPosition={tailPosition}
    >
      <TitleWrap>
        <Title>매너 레벨 LV. {level}</Title>
        <Icon
          backgroundUrl="/assets/icons/close_white.svg"
          width={!isMobile ? 24 : 16}
          height={!isMobile ? 24 : 16}
          onClick={onClose}
        />
      </TitleWrap>

      <MannerEvaluations>
        <Div>
          <SubTitle>받은 매너평가</SubTitle>
          {positiveKeywords.map((positive) => {
            return (
              <MannerListBox key={positive.mannerKeywordId}>
                <Type className={positive.count > 0 ? "mannerEmph" : "default"}>
                  {getMannerText(positive.mannerKeywordId)}
                </Type>
                <Value
                  className={positive.count > 0 ? "mannerEmph" : "default"}
                >
                  {positive.count}
                </Value>
              </MannerListBox>
            );
          })}
        </Div>
        <Div>
          <SubTitle>받은 비매너평가</SubTitle>
          {negativeKeywords.map((negative) => {
            return (
              <MannerListBox key={negative.mannerKeywordId}>
                <Type className={negative.count > 0 ? "badEmph" : "default"}>
                  {getBadMannerText(negative.mannerKeywordId)}
                </Type>
                <Value className={negative.count > 0 ? "badEmph" : "default"}>
                  {negative.count}
                </Value>
              </MannerListBox>
            );
          })}
        </Div>
      </MannerEvaluations>
    </Wrapper>
  );
};

export default MannerLevelBox;

const Wrapper = styled.div<{
  $top: string;
  $right: string;
  $tail: boolean;
  $tailPosition?: "center" | "top";
}>`
  position: absolute;
  top: ${({ $top }) => $top};
  right: ${({ $right }) => $right};
  padding: 32px;
  box-shadow: 0 0 21.3px 0 #00000026;
  backdrop-filter: blur(10px);
  border-radius: 19px;
  background: #000000a3;
  width: fit-content;
  z-index: ${theme.zIndex.popup};;
  white-space: nowrap;

  ${({ $tail, $tailPosition }) =>
    $tail &&
    $tailPosition === "center" &&
    css`
      &::after {
        content: "";
        position: absolute;
        top: -15px;
        left: 50%;
        transform: translateX(-50%);
        border-top: 0 solid transparent;
        border-left: 9px solid transparent;
        border-right: 9px solid transparent;
        border-bottom: 15px solid rgba(0, 0, 0, 0.64);
      }
    `}

  ${({ $tail, $tailPosition }) =>
    $tail &&
    $tailPosition === "top" &&
    css`
      &::after {
        content: "";
        position: absolute;
        top: -9px;
        left: 20px;
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-bottom: 9px solid #000000a3;
      }
    `}

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 20px;
    ${({ $tail, $tailPosition, $top, $right }) =>
      $tail && $tailPosition === "top"
        ? css`
            top: ${$top};
            left: 0px;
            transform: none;
          `
        : css`
            top: 50%;
            right: 50%;
            transform: translate(50%);
          `}
  }
`;

const TitleWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
`;

const Title = styled.div`
  ${(props) => props.theme.fonts.bold20};
  color: ${theme.colors.white};

  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) => props.theme.fonts.bold14};
  }
`;

const MannerEvaluations = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 49px;
`;

const Div = styled.div``;

const SubTitle = styled.p`
  ${(props) => props.theme.fonts.semiBold13};
  color: ${theme.colors.white};
  margin-bottom: 16px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) => props.theme.fonts.medium11};
    margin-bottom: 6px;
  }
`;

const MannerListBox = styled.div`
  width: 176px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  &:last-child {
    margin-bottom: unset;
  }
  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 126px;
    margin-bottom: 6px;
  }
`;

const Value = styled.p`
  ${(props) => props.theme.fonts.bold16};

  &.default {
    color: ${theme.colors.gray500};
  }

  &.mannerEmph {
    color: ${theme.colors.violet400};
  }

  &.badEmph {
    color: ${theme.colors.red400};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) => props.theme.fonts.bold12};
  }
`;

const Type = styled.p`
  ${(props) => props.theme.fonts.bold16};
  &.default {
    color: ${theme.colors.gray500};
  }

  &.mannerEmph {
    color: ${theme.colors.violet400};
  }

  &.badEmph {
    color: ${theme.colors.red400};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) => props.theme.fonts.bold12};
  }
`;

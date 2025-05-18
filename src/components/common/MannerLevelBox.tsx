import styled from "styled-components";
import { theme } from "@/styles/theme";
import { BAD_MANNER_TYPES, MANNER_TYPES } from "@/constants/mannerLevel";
import { useEffect, useState } from "react";
import { MannerKeywords } from "@/interface/manner";
import { getMemberMannerKeyword } from "@/api/manner/manner";
import Image from "next/image";
import { css } from "styled-components";

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

  const [positiveKeywords, setPositiveKeywords] = useState<MannerKeywords[]>(
    []
  );
  const [negativeKeywords, setNegativeKeywords] = useState<MannerKeywords[]>(
    []
  );

  useEffect(() => {
    const getManners = async () => {
      const manner = await getMemberMannerKeyword(memberId);
      const positive = manner.data.mannerKeywords.filter(
        (keyword: MannerKeywords) =>
          keyword.mannerKeywordId >= 1 && keyword.mannerKeywordId <= 6
      );
      const negative = manner.data.mannerKeywords.filter(
        (keyword: MannerKeywords) => keyword.mannerKeywordId >= 7
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
        <CloseImage
          src="/assets/icons/close_white.svg"
          width={24}
          height={24}
          alt="close"
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
  z-index: 100;
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


  @media (max-width: 700px) {
    padding: 20px;
    top: 50%;
    right: 50%;
    transform: translate(50%);
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
`;

const CloseImage = styled(Image)`
  cursor: pointer;
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
`;

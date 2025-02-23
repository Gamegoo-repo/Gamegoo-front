import styled from "styled-components";
import { theme } from "@/styles/theme";
import { BAD_MANNER_TYPES, MANNER_TYPES } from "@/constants/mannerLevel";
import { useEffect, useState } from "react";
import { MannerKeywords } from "@/interface/manner";
import { getMemberMannerKeyword } from "@/api/manner";

interface MannerLevelBoxProps {
  memberId: number;
  level: number;
  top: string;
  right: string;
}

const MannerLevelBox = (props: MannerLevelBoxProps) => {
  const { memberId, level, top, right } = props;

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
    <Wrapper $top={top} $right={right}>
      <Title>매너 레벨 {level}</Title>
      <MannerEvaluations>
        <Div>
          <SubTitle>받은 매너평가</SubTitle>
          {positiveKeywords.map((positive) => {
            return (
              <MannerListBox key={positive.mannerKeywordId}>
                <Value
                  className={positive.count > 0 ? "mannerEmph" : "default"}
                >
                  {positive.count}
                </Value>
                <Type className={positive.count > 0 ? "mannerEmph" : "default"}>
                  {getMannerText(positive.mannerKeywordId)}
                </Type>
              </MannerListBox>
            );
          })}
        </Div>
        <Div>
          <SubTitle>받은 비매너평가</SubTitle>
          {negativeKeywords.map((negative) => {
            return (
              <MannerListBox key={negative.mannerKeywordId}>
                <Value className={negative.count > 0 ? "badEmph" : "default"}>
                  {negative.count}
                </Value>
                <Type className={negative.count > 0 ? "badEmph" : "default"}>
                  {getBadMannerText(negative.mannerKeywordId)}
                </Type>
              </MannerListBox>
            );
          })}
        </Div>
      </MannerEvaluations>
    </Wrapper>
  );
};

export default MannerLevelBox;

const Wrapper = styled.div<{ $top: string; $right: string }>`
  position: absolute;
  top: ${({ $top }) => $top};
  right: ${({ $right }) => $right};
  padding: 16px 32px 34px;
  box-shadow: 0 0 21.3px 0 #00000026;
  backdrop-filter: blur(10px);
  border-radius: 19px;
  background: #000000a3;
  width: fit-content;
  z-index: 100;
  white-space: nowrap;
`;

const Title = styled.div`
  ${(props) => props.theme.fonts.medium16};
  color: ${theme.colors.white};
  margin-bottom: 10px;
`;

const MannerEvaluations = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 49px;
`;

const Div = styled.div``;

const SubTitle = styled.p`
  ${(props) => props.theme.fonts.regular14};
  color: ${theme.colors.white};
  margin-bottom: 23px;
`;

const MannerListBox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 21px;
  &:last-child {
    margin-bottom: unset;
  }
`;

const Value = styled.p`
  ${(props) => props.theme.fonts.medium16};

  &.default {
    color: ${theme.colors.gray600};
  }

  &.mannerEmph {
    color: ${theme.colors.violet400};
  }

  &.badEmph {
    color: ${theme.colors.red400};
  }
`;

const Type = styled.p`
  ${(props) => props.theme.fonts.medium16};
  margin-left: 11px;
  &.default {
    color: ${theme.colors.gray600};
  }

  &.mannerEmph {
    color: ${theme.colors.violet400};
  }

  &.badEmph {
    color: ${theme.colors.red400};
  }
`;

import styled from "styled-components";
import { theme } from "@/styles/theme";
import { BAD_MANNER_TYPES, MANNER_TYPES } from "@/data/mannerLevel";
import { useEffect, useState } from "react";
import { MannerKeywords, OthersManner } from "@/interface/manner";
import { getOthersManner } from "@/api/manner";

interface MannerLevelBoxProps {
  memberId: number;
  level: number;
  top: string;
  right: string;
}

const MannerLevelBox = (props: MannerLevelBoxProps) => {
  const { memberId, level, top, right } = props;

  const [positiveKeywords, setPositiveKeywords] = useState<MannerKeywords[]>([]);
  const [negativeKeywords, setNegativeKeywords] = useState<MannerKeywords[]>([]);

  useEffect(() => {
    const getManners = async () => {
      const manner = await getOthersManner(memberId);
      const positive = manner.result.mannerKeywords.filter((keyword: MannerKeywords) => keyword.isPositive);
      const negative = manner.result.mannerKeywords.filter((keyword: MannerKeywords) => !keyword.isPositive);

      setPositiveKeywords(positive);
      setNegativeKeywords(negative);
      console.log("manner:", manner.result);
    };

    getManners();
  }, [memberId]);

  /* id로 매너 텍스트 가져오기 */
  const getMannerText = (id: number) => {
    const match = MANNER_TYPES.find(type => type.id === id);
    return match ? match.text : '';
  };

  /* id로 비매너 텍스트 가져오기 */
  const getBadMannerText = (id: number) => {
    const match = BAD_MANNER_TYPES.find(type => type.id === id);
    return match ? match.text : '';
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
                  className={positive.count > 0 ? "mannerEmph" : "default"}>
                  {positive.count}
                </Value>
                <Type className={positive.count > 0 ? "mannerEmph" : "default"}>
                  {getMannerText(positive.mannerKeywordId)}
                </Type>
              </MannerListBox>
            )
          })}
        </Div>
        <Div>
          <SubTitle>받은 비매너평가</SubTitle>
          {negativeKeywords.map((negative) => {
            return (
              <MannerListBox key={negative.mannerKeywordId}>
                <Value
                  className={negative.count > 0 ? "badEmph" : "default"}>
                  {negative.count}
                </Value>
                <Type className={negative.count > 0 ? "badEmph" : "default"}>
                  {getBadMannerText(negative.mannerKeywordId)}
                </Type>
              </MannerListBox>
            )
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
  z-index: 1;
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
  margin-bottom:26px;
  &:last-child {
    margin-bottom: unset;
  }
`;

const Value = styled.p`
  ${(props) => props.theme.fonts.semiBold16};

  &.default {
    color: ${theme.colors.gray200};
  }

  &.mannerEmph {
    color: ${theme.colors.purple300};
  }

  &.badEmph {
    color: ${theme.colors.error200};
  }
`;

const Type = styled.p`
  ${(props) => props.theme.fonts.semiBold16};
  margin-left: 11px;
  &.default {
    color: ${theme.colors.gray200};
  }

  &.mannerEmph {
    color: ${theme.colors.purple300};
  }

  &.badEmph {
    color: ${theme.colors.error200};
  }
`;

import styled from "styled-components";
import { theme } from "@/styles/theme";
import { BAD_MANNER_TYPES, MANNER_TYPES } from "@/data/mannerLevel";
import { useEffect, useState } from "react";
import { getBadMannerValues, getMannerValues } from "@/api/manner";
import { MannerList } from "@/interface/manner";

const data = {
  good_manner: {
    "1": 8,
    "2": 5,
    "3": 2,
    "4": 5,
    "5": 0,
    "6": 5,
  },
  bad_manner: {
    "1": 1,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
    "6": 0,
  },
};

interface MannerLevelBoxProps {
  memberId: number;
  level:number;
  top: string;
  right: string;
}

const MannerLevelBox = (props: MannerLevelBoxProps) => {
  const { memberId, level, top, right } = props;

  const mannerEvaluations = Object.entries(data.good_manner);
  const badMannerEvaluations = Object.entries(data.bad_manner);

  const [mannerData, setMannerData] = useState<MannerList>();
  const [badMannerData, setBadMannerData] = useState<MannerList>();

  useEffect(() => {
    const getManner = async () => {
      const good = await getMannerValues(memberId);
      setMannerData(good.result);
      console.log('good:', good.result)
    };

    const getBadManner = async () => {
      const bad = await getBadMannerValues(memberId);
      setBadMannerData(bad.result);
      console.log('bad:', bad.result)

    };

    getManner();
    getBadManner();
  }, [memberId])

  return (
    <Wrapper $top={top} $right={right}>
      <Title>매너 레벨 {level}</Title>
      <MannerEvaluations>
        <Div>
          <SubTitle>받은 매너평가</SubTitle>
          <MannerList>
            <ValueWrapper>
              {mannerEvaluations.map(([key, value]) => {
                return (
                  <Value
                    key={key}
                    className={value > 0 ? "mannerEmph" : "default"}
                  >
                    {value}
                  </Value>
                );
              })}
            </ValueWrapper>
            <TypeWrapper>
              {MANNER_TYPES.map((type, index) => {
                return (
                  <Type
                    key={type.id}
                    className={
                      mannerEvaluations[index][1] > 0 ? "mannerEmph" : "default"
                    }
                  >
                    {type.text}
                  </Type>
                );
              })}
            </TypeWrapper>
          </MannerList>
        </Div>
        <Div>
          <SubTitle>받은 비매너평가</SubTitle>
          <MannerList>
            <ValueWrapper>
              {badMannerEvaluations.map(([key, value]) => {
                return (
                  <Value
                    key={key}
                    className={value > 0 ? "badEmph" : "default"}
                  >
                    {value}
                  </Value>
                );
              })}
            </ValueWrapper>
            <TypeWrapper>
              {BAD_MANNER_TYPES.map((type, index) => {
                return (
                  <Type
                    key={type.id}
                    className={
                      badMannerEvaluations[index][1] > 0 ? "badEmph" : "default"
                    }
                  >
                    {type.text}
                  </Type>
                );
              })}
            </TypeWrapper>
          </MannerList>
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

const MannerList = styled.div`
  display: flex;
  align-items: center;
`;

const ValueWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 11px;
  row-gap: 26px;
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

const TypeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 26px;
`;

const Type = styled.p`
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

"use client";

import styled from "styled-components";
import { theme } from "@/styles/theme";
import MannerLevelBar from "@/components/common/MannerLevelBar";
import { BAD_MANNER_TYPES, MANNER_TYPES } from "@/data/mannerLevel";

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

const MyReviewPage = () => {
  const mannerEvaluations = Object.entries(data.good_manner);
  const badMannerEvaluations = Object.entries(data.bad_manner);

  return (
    <Wrapper>
      <MyReviewContent>
        <Review>
          <Title>내 평가</Title>
          <Box>
            <Top>
              나의 매너 레벨
              <Gray>
                매너 키워드는 하나 당 1점, 비매너 키워드는 -2점으로 계산해요.
              </Gray>
            </Top>
            <MannerLevelBar recentLevel={4} />
          </Box>
        </Review>
        <Private>
          <Row>
            <MannerKey>
              <Small>매너 키워드</Small>
              <MannerBox>
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
                          key={index}
                          className={
                            mannerEvaluations[index][1] > 0
                              ? "mannerEmph"
                              : "default"
                          }
                        >
                          {type.text}
                        </Type>
                      );
                    })}
                  </TypeWrapper>
                </MannerList>
              </MannerBox>
            </MannerKey>
            <MannerKey>
              <Small>매너 키워드</Small>
              <MannerBox>
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
                          key={index}
                          className={
                            badMannerEvaluations[index][1] > 0
                              ? "badEmph"
                              : "default"
                          }
                        >
                          {type.text}
                        </Type>
                      );
                    })}
                  </TypeWrapper>
                </MannerList>
              </MannerBox>
            </MannerKey>
          </Row>
        </Private>
      </MyReviewContent>
    </Wrapper>
  );
};

export default MyReviewPage;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 140px;
`;

const MyReviewContent = styled.div`
  max-width: 1440px;
  width: 100%;
  padding: 0 80px;
`;

const Review = styled.header`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
  margin-bottom: 32px;
`;

const Private = styled.header`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
  margin-bottom: 32px;
`;

const Box = styled.div`
  width: 100%;
  height: 177px;
  padding: 29px 36px;
  border-radius: 20px;
  background: ${theme.colors.gray500};
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.medium16};
`;

const Gray = styled.div`
  color: ${theme.colors.gray800};
  ${(props) => props.theme.fonts.regular12};
`;

const Title = styled.h1`
  padding-left: 6px;
  margin-bottom: 13px;
  ${(props) => props.theme.fonts.regular25};
  color: ${theme.colors.gray700};
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 9px;
`;

const MannerKey = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Small = styled.h1`
  ${(props) => props.theme.fonts.bold11};
  color: ${theme.colors.gray800};
  margin-left: 11px;
`;

const MannerBox = styled.div`
  width: 100%;
  height: 313px;
  border-radius: 20px;
  padding: 32px;
  background: ${theme.colors.gray600};
  box-shadow: 0px 4px 18.4px 0px rgba(0, 0, 0, 0.25);
`;

const MannerList = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  white-space: nowrap;
`;

const ValueWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 11px;
  justify-content: space-between;
`;

const Value = styled.p`
  ${(props) => props.theme.fonts.medium16};

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
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Type = styled.p`
  height: 100%;
  ${(props) => props.theme.fonts.medium16};

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

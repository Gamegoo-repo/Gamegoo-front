"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { getMemberMannerKeyword, getMemberMannerLevel } from "@/api";
import { MannerLevelBar, Tooltip } from "@/components";
import { BAD_MANNER_TYPES, MANNER_TYPES } from "@/constants";
import { theme } from "@/styles/theme";

import type { Manner } from "@/components/user/UserProfile";
import type { RootState } from "@/redux/store";

const MyReviewPage = () => {
  const myId = useSelector((state: RootState) => state.user.id);
  const [myManner, setMyManner] = useState<Manner>();

  useEffect(() => {
    const fetchGetMyManner = async () => {
      const response_level = await getMemberMannerLevel(myId || 0);
      const response_keywords = await getMemberMannerKeyword(myId || 0);
      setMyManner({ ...response_level.data, ...response_keywords.data });
    };

    fetchGetMyManner();
  }, [myId]);

  const goodMannerEvaluations =
    myManner?.mannerKeywords
      .filter(
        (keyword) => keyword.mannerKeywordId > 0 && keyword.mannerKeywordId <= 6
      )
      .map((keyword) => ({
        id: keyword.mannerKeywordId,
        count: keyword.count,
      })) || [];

  const badMannerEvaluations =
    myManner?.mannerKeywords
      .filter((keyword) => keyword.mannerKeywordId >= 7)
      .map((keyword) => ({
        id: keyword.mannerKeywordId,
        count: keyword.count,
      })) || [];

  return (
    <Wrapper>
      <MyReviewContent>
        <Review>
          <Title>
            내 평가
            <Tooltip
              title="매너레벨"
              content={`매너 레벨은 겜구 사용자로부터 받은 매너평가, 비매
너평가를 반영한 지표예요. `}
              width="319px"
            />
          </Title>
          <Box>
            <Top>
              나의 매너 레벨
              <Gray>
                매너 키워드는 하나 당 1점, 비매너 키워드는 -2점으로 계산해요.
              </Gray>
            </Top>
            <MannerLevelBar
              recentLevel={myManner?.mannerLevel || 1}
              mannerRank={myManner?.mannerRank}
            />
          </Box>
        </Review>
        <Private>
          <Row>
            <MannerKey>
              <MannerTitle>받은 매너 평가</MannerTitle>
              <MannerBox>
                <MannerList>
                  <TypeWrapper>
                    {goodMannerEvaluations.map((type, index) => {
                      return (
                        <Type
                          key={index}
                          className={type.count > 0 ? "mannerEmph" : "default"}
                        >
                          {
                            MANNER_TYPES.find(
                              (evaluation) => evaluation.id === type.id
                            )?.text
                          }
                        </Type>
                      );
                    })}
                  </TypeWrapper>
                  <ValueWrapper>
                    {goodMannerEvaluations.map((item) => (
                      <Value
                        key={item.id}
                        className={item.count > 0 ? "mannerEmph" : "default"}
                      >
                        {item.count}
                      </Value>
                    ))}
                  </ValueWrapper>
                </MannerList>
              </MannerBox>
            </MannerKey>
            <MannerKey>
              <MannerTitle>받은 비매너 평가</MannerTitle>
              <MannerBox>
                <MannerList>
                  <TypeWrapper>
                    {badMannerEvaluations.map((type, index) => {
                      return (
                        <Type
                          key={index}
                          className={type.count > 0 ? "badEmph" : "default"}
                        >
                          {
                            BAD_MANNER_TYPES.find(
                              (evaluation) => evaluation.id === type.id
                            )?.text
                          }
                        </Type>
                      );
                    })}
                  </TypeWrapper>
                  <ValueWrapper>
                    {badMannerEvaluations.map((item) => (
                      <Value
                        key={item.id}
                        className={item.count > 0 ? "badEmph" : "default"}
                      >
                        {item.count}
                      </Value>
                    ))}
                  </ValueWrapper>
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
  @media (max-width: 700px) {
    padding: 30px 20px;
  }
`;

const MyReviewContent = styled.div`
  max-width: 1440px;
  width: 100%;
  @media (max-width: 700px) {
    padding: 0;
  }
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
  height: 195px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 31px 35px;
  border-radius: 20px;
  background: ${theme.colors.gray100};

  @media (max-width: 700px) {
    border-radius: 8px;
    padding: 24px 20px;
  }
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${theme.colors.gray800};
  ${(props) => props.theme.fonts.medium16};

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: start;
    ${(props) => props.theme.fonts.medium14};
  }
`;

const Gray = styled.div`
  color: ${theme.colors.gray700};
  ${(props) => props.theme.fonts.regular12};
`;

const Title = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${theme.colors.gray800};
  ${(props) => props.theme.fonts.bold25};
  margin-bottom: 20px;
  @media (max-width: 700px) {
    ${(props) => props.theme.fonts.semiBold18};
    justify-content: flex-start;
    align-items: center;
  }
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 9px;
  @media (max-width: 700px) {
    flex-direction: column;
  }
`;

const MannerKey = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const MannerTitle = styled.div`
  ${(props) => props.theme.fonts.semiBold18};
  color: ${theme.colors.gray800};
`;

const MannerBox = styled.div`
  width: 100%;
  height: 313px;
  border-radius: 20px;
  padding: 32px;
  background: ${theme.colors.gray800};

  @media (max-width: 700px) {
    height: unset;
    border-radius: 8px;
    padding: 24px 20px;
    margin-bottom: 24px;
  }
`;

const MannerList = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;
`;

const ValueWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 11px;
  justify-content: space-between;
  @media (max-width: 700px) {
    gap: 14px;
  }
`;

const Value = styled.p`
  ${(props) => props.theme.fonts.medium16};

  &.default {
    color: ${theme.colors.gray600};
  }

  &.mannerEmph {
    color: ${theme.colors.violet500};
  }

  &.badEmph {
    color: ${theme.colors.red500};
  }

  @media (max-width: 700px) {
    ${(props) => props.theme.fonts.medium14};
  }
`;

const TypeWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media (max-width: 700px) {
    gap: 14px;
  }
`;

const Type = styled.p`
  ${(props) => props.theme.fonts.medium16};

  &.default {
    color: ${theme.colors.gray600};
  }

  &.mannerEmph {
    color: ${theme.colors.gray100};
  }

  &.badEmph {
    color: ${theme.colors.gray100};
  }

  @media (max-width: 700px) {
    ${(props) => props.theme.fonts.medium14};
  }
`;

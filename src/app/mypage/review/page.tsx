"use client";

import styled from "styled-components";
import { theme } from "@/styles/theme";
import MannerLevelBar from "@/components/common/MannerLevelBar";
import { BAD_MANNER_TYPES, MANNER_TYPES } from "@/data/mannerLevel";
import ChatButton from "@/components/common/ChatButton";
import { useEffect, useState } from "react";
import { getMyManner } from "@/api/user";
import { Manner } from "@/components/user/UserProfile";

const MyReviewPage = () => {
  const [myManner, setMyManner] = useState<Manner>();

  useEffect(() => {
    const fetchGetMyManner = async () => {
      const response = await getMyManner();
      setMyManner(response.result);
    };

    console.log("badMannerEvaluations", badMannerEvaluations);

    fetchGetMyManner();
  }, []);

  const goodMannerEvaluations =
    myManner?.mannerKeywords
      .filter((keyword) => keyword.isPositive)
      .map((keyword) => ({
        id: keyword.mannerKeywordId,
        count: keyword.count,
      })) || [];

  const badMannerEvaluations =
    myManner?.mannerKeywords
      .filter((keyword) => !keyword.isPositive)
      .map((keyword) => ({
        id: keyword.mannerKeywordId,
        count: keyword.count,
      })) || [];

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
            <MannerLevelBar recentLevel={myManner?.mannerLevel || 1} />
          </Box>
        </Review>
        <Private>
          <Row>
            <MannerKey>
              <Small>매너 키워드</Small>
              <MannerBox>
                <MannerList>
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
                </MannerList>
              </MannerBox>
            </MannerKey>
            <MannerKey>
              <Small>비매너 키워드</Small>
              <MannerBox>
                <MannerList>
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
                </MannerList>
              </MannerBox>
            </MannerKey>
          </Row>
        </Private>
      </MyReviewContent>
      <Footer>
        <ChatBoxContent>
          <ChatButton />
        </ChatBoxContent>
      </Footer>
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

const Title = styled.div`
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

const Small = styled.div`
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

const Footer = styled.footer`
  display: flex;
  margin-bottom: 78px;
`;

const ChatBoxContent = styled.div`
  margin-left: auto;
`;

"use client";

import styled from "styled-components";
import { useParams, useRouter } from "next/navigation";
import Profile from "@/components/match/Profile";
import HeaderTitle from "@/components/common/HeaderTitle";
import { theme } from "@/styles/theme";
import { BAD_MANNER_TYPES, MANNER_TYPES } from "@/data/mannerLevel";
import MannerLevelBar from "@/components/common/MannerLevelBar";

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

const userData = {
  image: "/assets/images/profile.svg",
  account: "유니콘의 비밀",
  tag: "KR1",
  tier: "B3",
  manner_level: 5,
  mic: true,
  champions: [
    { id: 1, value: "/assets/icons/gray_circle.svg" },
    { id: 2, value: "/assets/icons/gray_circle.svg" },
    { id: 3, value: "/assets/icons/gray_circle.svg" },
  ],
  gameStyle: [
    "이기기만 하면 뭔들",
    "과도한 핑은 사절이에요",
    "랭크 올리고 싶어요",
  ],
};

const UserProfile = () => {
  const router = useRouter();
  const params = useParams();
  const id = +params.id;

  const mannerEvaluations = Object.entries(data.good_manner);
  const badMannerEvaluations = Object.entries(data.bad_manner);

  return (
    <Wrapper>
      <MatchContent>
        <HeaderTitle title="장시은 님의 프로필" size="regular" />
        <Main>
          <Profile profileType="other" user={userData} />
          <Content>
            <div>
              <Title>장시은 님의 매너레벨</Title>
              <Box>
                <Text>
                  매너 키워드는 하나 당 1점, 비매너 키워드는 -2점으로 계산해요.
                  <br />
                  최근 <Span>4</Span>명의 사용자가 장시은 님에게 긍정적 매너
                  평가를 남겼어요.
                </Text>
                <MannerLevelBar recentLevel={4} percentage={15} />
              </Box>
            </div>
            <div>
              <Title>매너 키워드</Title>
              <Box>
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
                          {type}
                        </Type>
                      );
                    })}
                  </TypeWrapper>
                </MannerList>
              </Box>
            </div>
            <div>
              <Title>비매너 키워드</Title>
              <Box>
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
                          {type}
                        </Type>
                      );
                    })}
                  </TypeWrapper>
                </MannerList>
              </Box>
            </div>
          </Content>
        </Main>
      </MatchContent>
    </Wrapper>
  );
};

export default UserProfile;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const MatchContent = styled.div`
  max-width: 1440px;
  width: 100%;
  padding: 0 80px;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
  gap: 14px;
  margin-bottom: 37px;
`;

const Content = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 4fr 1fr 1fr;
  gap: 15px;
  margin-top: 37px;
`;

const Title = styled.h1`
  padding-left: 6px;
  margin-bottom: 13px;
  ${(props) => props.theme.fonts.regular25};
  color: ${theme.colors.gray700};
`;

const Box = styled.div`
  width: 100%;
  height: 269px;
  border-radius: 20px;
  padding: 18px 32px;
  background: ${theme.colors.gray500};
`;

const Text = styled.div`
  ${(props) => props.theme.fonts.regular16};
  color: ${theme.colors.gray700};
  margin-top: 8px;
  margin-bottom: 40px;
`;

const Span = styled.span`
  ${(props) => props.theme.fonts.bold16};
  color: ${theme.colors.purple100};
`;

const MannerList = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
`;

const ValueWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 11px;
  row-gap: 16px;
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
  display: flex;
  flex-direction: column;
  row-gap: 16px;
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

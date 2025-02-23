import styled from "styled-components";
import Profile from "@/components/match/Profile";
import HeaderTitle from "@/components/common/HeaderTitle";
import { theme } from "@/styles/theme";
import { BAD_MANNER_TYPES, MANNER_TYPES } from "@/constants/mannerLevel";
import MannerLevelBar from "@/components/common/MannerLevelBar";
import { profileType, User } from "@/interface/profile";
import { getUserId } from "@/utils/storage";
import Champion from "../readBoard/Champion";
import { isErrored } from "stream";

export interface Manner {
  memberId?: number;
  mannerLevel: number;
  mannerRank: number;
  mannerKeywords: { mannerKeywordId: number; count: number }[];
}

const UserProfile = ({
  profile,
  profileType,
  manner,
  updateFriendState,
  isDefault,
}: {
  profile: User;
  profileType?: profileType;
  manner: Manner;
  updateFriendState: (state: {
    friend: boolean;
    friendRequestMemberId: number | null;
    blocked: boolean;
  }) => void;
  isDefault?: boolean; // 비회원용 default 프로필 여부
}) => {
  const goodMannerEvaluations =
    manner.mannerKeywords
      .filter(
        (keyword) =>
          keyword.mannerKeywordId >= 1 && keyword.mannerKeywordId <= 6
      )
      .map((keyword) => ({
        id: keyword.mannerKeywordId,
        count: keyword.count,
      })) || [];
  const badMannerEvaluations =
    manner.mannerKeywords
      .filter((keyword) => keyword.mannerKeywordId >= 7)
      .map((keyword) => ({
        id: keyword.mannerKeywordId,
        count: keyword.count,
      })) || [];

  return (
    <Wrapper>
      <MatchContent>
        <Row>
          <HeaderTitle
            title={
              isDefault
                ? "로그인이 필요한 서비스"
                : `${profile.gameName}님의 프로필`
            }
            mini={
              isDefault
                ? "로그인 후 다른 플레이어들의 정보를 확인해 보세요!"
                : ""
            }
            size="bold"
            blocked={profile.blocked}
            marginBottom="20px"
          />
        </Row>
        <Main>
          <Profile
            profileType={
              profileType ||
              (profile.id === Number(getUserId()) ? "me" : "other")
            }
            user={profile}
            updateFriendState={updateFriendState}
            isDefault={isDefault}
          />
          <Content>
            <div>
              <Title>{`${profile.gameName}님의 매너레벨`}</Title>
              <Box>
                <Text>
                  매너 레벨은 겜구 사용자로부터 받은 매너평가, 비매너평가를
                  반영한 지표예요.
                  <br />
                  최근 <Span>{profile.mannerRatingCount}</Span>명의 사용자가
                  {` `}
                  {profile.gameName}
                  {` `}님에게 긍정적 매너 평가를 남겼어요.
                </Text>
                <MannerLevelBar
                  recentLevel={manner.mannerLevel}
                  mannerRank={profile.mannerRank || null}
                />
              </Box>
            </div>
            <div>
              <Title>매너 키워드</Title>
              <Box>
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
                    {goodMannerEvaluations.map((evaluation) => {
                      const matchedType = MANNER_TYPES.find(
                        (type) => type.id === evaluation.id
                      );
                      return matchedType ? (
                        <Type
                          key={matchedType.id}
                          className={
                            evaluation.count > 0 ? "mannerEmph" : "default"
                          }
                        >
                          {matchedType.text}
                        </Type>
                      ) : null;
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
                    {badMannerEvaluations.map((evaluation) => {
                      const matchedType = BAD_MANNER_TYPES.find(
                        (type) => type.id === evaluation.id
                      );
                      return matchedType ? (
                        <Type
                          key={matchedType.id}
                          className={
                            evaluation.count > 0 ? "badEmph" : "default"
                          }
                        >
                          {matchedType.text}
                        </Type>
                      ) : null;
                    })}
                  </TypeWrapper>
                </MannerList>
              </Box>
            </div>
          </Content>
          <Content>
            <div>
              <Title>최근 30게임</Title>
              <RecentBox>
                <Column>
                  <RecentInfo>14승 16패</RecentInfo>
                  <DetailInfo>46.7%</DetailInfo>
                </Column>
                <Column>
                  <RecentInfo>6.0 / 5.4 / 6.5</RecentInfo>
                  <DetailInfo>KDA 2.33</DetailInfo>
                </Column>
                <Column>
                  <RecentInfo>평균 CS 7.6</RecentInfo>
                  <DetailInfo>CS 226</DetailInfo>
                </Column>
                <Champion
                  title={true}
                  font="regular14"
                  list={profile.championResponseList.map(
                    (champion) => champion.championId
                  )}
                />
              </RecentBox>
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
  padding-top: 62px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
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

const Title = styled.div`
  padding-left: 6px;
  margin-bottom: 13px;
  ${(props) => props.theme.fonts.regular25};
  color: ${theme.colors.gray700};
`;

const Box = styled.div`
  width: 100%;
  height: 269px;
  border-radius: 20px;
  padding: 26px 28px;
  background: ${theme.colors.gray100};
`;

const Text = styled.div`
  ${(props) => props.theme.fonts.regular16};
  color: ${theme.colors.gray700};
  margin-bottom: 66px;
`;

const Span = styled.span`
  ${(props) => props.theme.fonts.bold16};
  color: ${theme.colors.violet600};
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
    color: ${theme.colors.gray800};
  }

  &.mannerEmph {
    color: ${theme.colors.violet500};
  }

  &.badEmph {
    color: ${theme.colors.red500};
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
    color: ${theme.colors.gray800};
  }

  &.mannerEmph {
    color: ${theme.colors.violet500};
  }

  &.badEmph {
    color: ${theme.colors.red500};
  }
`;

const RecentBox = styled.div`
  max-width: 756px;
  border-radius: 20px;
  padding: 16px 32px;
  background: ${theme.colors.gray100};
  display: flex;
  align-items: center;
  gap: 56px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;
const RecentInfo = styled.div`
  color: ${theme.colors.gray700};
  ${theme.fonts.bold20};
`;

const DetailInfo = styled.div`
  color: ${theme.colors.gray600};
  ${theme.fonts.regular14};
`;

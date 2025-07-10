import styled from "styled-components";

import {
  Champion,
  HeaderTitle,
  MannerLevelBar,
  Tooltip,
} from "@/components/common";
import { Profile } from "@/components/profile";
import { BAD_MANNER_TYPES, MANNER_TYPES } from "@/constants";
import { useMediaQueries } from "@/hooks";
import { theme } from "@/styles/theme";
import { formatDecimal, getUserId } from "@/utils";

import type { profileType, User } from "@/types";

export interface Manner {
  memberId?: number;
  mannerLevel: number;
  mannerRank: number;
  mannerRatingCount?: number;
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
  const isMobile = useMediaQueries({ breakpoint: 700 });
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
            isColumn={isMobile && isDefault}
            isMatchProgressOrComplete={true}
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
              <Title>
                {`${profile.gameName}님의 매너레벨`}{" "}
                <Tooltip
                  title="매너레벨"
                  content={`매너 레벨은 겜구 사용자로부터 받은 매너평가, 비매
너평가를 반영한 지표예요. `}
                  width="319px"
                />
              </Title>
              <LevelBox>
                <Text>
                  {/* {!isMobile &&
                    `매너 레벨은 겜구 사용자로부터 받은 매너평가, 비매너평가를 반영한 지표예요.\n`} */}
                  최근 <Span>{manner.mannerRatingCount}명</Span>의 사용자가
                  {` `}
                  {profile.gameName}
                  {` `}님에게 긍정적 매너 평가를 남겼어요.
                </Text>
                <MannerLevelBar
                  recentLevel={manner.mannerLevel}
                  mannerRank={manner.mannerRank || null}
                />
              </LevelBox>
            </div>
            <div>
              <Title>받은 매너평가</Title>
              <MannerBox>
                <MannerList>
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
            </div>
            <div>
              <Title>받은 비매너평가</Title>
              <MannerBox>
                <MannerList>
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
            </div>
          </Content>
          <RecentContent>
            <Title>최근 30게임</Title>
            <RecentBox>
              <Column>
                <RecentInfo>
                  {profile.memberRecentStats?.recTotalWins || "0"}승{" "}
                  {profile.memberRecentStats?.recTotalLosses || "0"}패
                </RecentInfo>
                <DetailInfo>
                  {formatDecimal(profile.memberRecentStats?.recWinRate || 0)}%
                </DetailInfo>
              </Column>
              <Column>
                <RecentInfo>
                  {formatDecimal(profile.memberRecentStats?.recAvgKills || 0)} /{" "}
                  <Emph>
                    {formatDecimal(
                      profile.memberRecentStats?.recAvgDeaths || 0
                    )}
                  </Emph>{" "}
                  /{" "}
                  {formatDecimal(profile.memberRecentStats?.recAvgAssists || 0)}
                </RecentInfo>
                <DetailInfo>
                  KDA {formatDecimal(profile.memberRecentStats?.recAvgKDA || 0)}
                </DetailInfo>
              </Column>

              <Column>
                <RecentInfo>
                  평균 CS{" "}
                  {formatDecimal(
                    profile.memberRecentStats?.recAvgCsPerMinute || 0
                  )}
                </RecentInfo>
                <DetailInfo>
                  CS {profile.memberRecentStats?.recTotalCs || 0}
                </DetailInfo>
              </Column>
              <Champion
                title={true}
                font="medium14"
                color={theme.colors.gray800}
                list={profile.championResponseList}
              />
            </RecentBox>
          </RecentContent>
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

  @media (max-width: 700px) {
    min-width: 0px;
    padding-top: 24px;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const MatchContent = styled.div`
  max-width: 1440px;
  width: 100%;
  padding: 0 80px;

  @media (max-width: 700px) {
    padding: 0 20px;
  }
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

  @media (max-width: 700px) {
    display: flex;
    flex-direction: column;
    gap: 36px;
  }
`;

const Title = styled.div`
  margin-bottom: 8px;
  ${(props) => props.theme.fonts.regular25};
  color: ${theme.colors.gray800};

  @media (max-width: 700px) {
    ${(props) => props.theme.fonts.semiBold18};
  }
`;

const LevelBox = styled.div`
  width: 100%;
  height: 260px;
  border-radius: 20px;
  padding: 24px 26px;
  background: ${theme.colors.gray100};

  @media (max-width: 700px) {
    height: 156px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 8px;
  }
`;

const MannerBox = styled.div`
  width: 100%;
  height: 260px;
  border-radius: 20px;
  padding: 28px 24px;
  background: ${theme.colors.gray800};

  @media (max-width: 700px) {
    height: 196px;
    padding: 20.5px 20px;
    border-radius: 8px;
  }
`;

const Text = styled.div`
  ${(props) => props.theme.fonts.medium16};
  color: ${theme.colors.gray800};
  margin-bottom: 66px;

  @media (max-width: 700px) {
    margin-bottom: 0px;
  }
`;

const Span = styled.span`
  color: ${theme.colors.violet600};
`;

const MannerList = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
`;

const TypeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 12px;

  @media (max-width: 700px) {
    row-gap: 6.5px;
  }
`;

const Type = styled.p`
  ${(props) => props.theme.fonts.medium16};

  &.default {
    color: ${theme.colors.gray500};
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

const ValueWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 12px;

  @media (max-width: 700px) {
    row-gap: 6.5px;
  }
`;

const Value = styled.p`
  ${(props) => props.theme.fonts.bold16};

  &.default {
    color: ${theme.colors.gray500};
  }

  &.mannerEmph {
    color: ${theme.colors.violet500};
  }

  &.badEmph {
    color: ${theme.colors.red500};
  }

  @media (max-width: 700px) {
    ${(props) => props.theme.fonts.bold14};
  }
`;

const RecentContent = styled.div`
  width: 100%;
  margin-top: 37px;
`;

const RecentBox = styled.div`
  height: 121px;
  max-width: 756px;
  border-radius: 20px;
  padding: 16px 32px;
  background: ${theme.colors.gray100};
  display: flex;
  align-items: center;
  gap: 56px;

  @media (max-width: 700px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
    gap: 12px;
    border-radius: 8px;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 700px) {
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }
`;
const RecentInfo = styled.div`
  color: ${theme.colors.gray700};
  ${theme.fonts.bold20};
  @media (max-width: 700px) {
    ${theme.fonts.bold16};
  }
`;

const DetailInfo = styled.div`
  color: ${theme.colors.gray500};
  ${theme.fonts.semiBold14};
  @media (max-width: 700px) {
    ${theme.fonts.bold12};
  }
`;

const Emph = styled.span`
  color: ${theme.colors.red500};
`;

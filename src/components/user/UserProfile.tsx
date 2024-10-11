import styled from "styled-components";
import Profile from "@/components/match/Profile";
import HeaderTitle from "@/components/common/HeaderTitle";
import { theme } from "@/styles/theme";
import { BAD_MANNER_TYPES, MANNER_TYPES } from "@/data/mannerLevel";
import MannerLevelBar from "@/components/common/MannerLevelBar";
import ChatButton from "@/components/common/ChatButton";
import { User } from "@/interface/profile";

export interface Manner {
  memberId?: number;
  mannerLevel: number;
  mannerRank: number;
  mannerKeywords: [
    {
      isPositive: boolean;
      mannerKeywordId: number;
      count: number;
    }
  ];
}

const UserProfile = ({
  profile,
  manner,
  updateFriendState,
}: {
  profile: User;
  manner: Manner;
  updateFriendState: (state: {
    friend: boolean;
    friendRequestMemberId: number | null;
    blocked: boolean;
  }) => void;
}) => {
  const goodMannerEvaluations =
    manner.mannerKeywords
      .filter((keyword) => keyword.isPositive)
      .map((keyword) => ({
        id: keyword.mannerKeywordId,
        count: keyword.count,
      })) || [];
  const badMannerEvaluations =
    manner.mannerKeywords
      .filter((keyword) => !keyword.isPositive)
      .map((keyword) => ({
        id: keyword.mannerKeywordId,
        count: keyword.count,
      })) || [];

  const goodMannerCount = (
    goodMannerEvaluations as { id: number; count: number }[]
  ).reduce((total, item) => total + item.count, 0);

  return (
    <Wrapper>
      <MatchContent>
        <Row>
          <HeaderTitle
            title={`${profile.gameName} 님의 프로필`}
            size="regular"
            blocked={profile.blocked}
          />
        </Row>
        <Main>
          <Profile
            profileType="other"
            user={profile}
            updateFriendState={updateFriendState}
          />
          <Content>
            <div>
              <Title>{`${profile.gameName}의 매너레벨`}</Title>
              <Box>
                <Text>
                  매너 레벨은 겜구 사용자로부터 받은 매너평가, 비매너평가를
                  반영한 지표예요.
                  <br />
                  최근 <Span>{profile.mannerRatingCount}</Span>명의 사용자가{` `}
                  {profile.gameName}
                  {` `}님에게 긍정적 매너 평가를 남겼어요.
                </Text>
                <MannerLevelBar
                  recentLevel={manner.mannerLevel}
                  mannerRank={manner.mannerRank}
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
        </Main>
      </MatchContent>
      <Footer>
        <ChatBoxContent>
          <ChatButton />
        </ChatBoxContent>
      </Footer>
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

const Footer = styled.footer`
  display: flex;
  margin-bottom: 78px;
`;

const ChatBoxContent = styled.div`
  margin-left: auto;
`;

import styled from "styled-components";
import HeaderTitle from "@/components/common/HeaderTitle";
import { theme } from "@/styles/theme";
import { BAD_MANNER_TYPES, MANNER_TYPES } from "@/data/mannerLevel";
import MannerLevelBar from "@/components/common/MannerLevelBar";
import Image from "next/image";
import Toggle from "../common/Toggle";
import Champion from "../readBoard/Champion";
import { css } from "styled-components";
import RankTier from "../common/RankTier";
import GameStyle from "../readBoard/GameStyle";
import { POSITIONS } from "@/data/profile";
import { setPositionImg } from "@/utils/custom";
import { getProfileBgColor } from "@/utils/profile";

const GuestProfile = () => {
  const goodMannerEvaluations =
    MANNER_TYPES.map((keyword) => ({
      id: keyword.id,
      count: 0,
    })) || [];
  const badMannerEvaluations =
    BAD_MANNER_TYPES.map((keyword) => ({
      id: keyword.id,
      count: 0,
    })) || [];

  return (
    <Wrapper>
      <MatchContent>
        <Row>
          <HeaderTitle
            title="로그인이 필요한 서비스"
            size="bold"
            marginBottom="20px"
          />
        </Row>
        <Main>
          <Container>
            <RowWrapper>
              <ImageContainer>
                <ProfileImgWrapper $bgColor={getProfileBgColor(3)}>
                  <PersonImage
                    data={`/assets/images/profile/profile3.svg`}
                    width={136}
                    height={136}
                  />
                </ProfileImgWrapper>
              </ImageContainer>
              <StyledBox>
                <TopContainer>
                  <Top>
                    GAMEGOO
                    <Tag>{`#KR1`}</Tag>
                  </Top>
                </TopContainer>
                <RankTierWrapper>
                  <RankTier type="solo" tier={"silver"} rank={3} />
                  <RankTier type="free" tier={"unrank"} rank={0} />
                </RankTierWrapper>

                <UnderRow>
                  <Position>
                    {POSITIONS.map((position, index) => (
                      <Posi
                        key={index}
                        className="other"
                        $isWantP={index === 2}
                      >
                        {position.label}
                        <Image
                          src={setPositionImg(
                            index === 0 ? "ANY" : index === 1 ? "ANY" : "ANY"
                          )}
                          width={55}
                          height={40}
                          alt="포지션"
                          onClick={() => {}}
                        />
                      </Posi>
                    ))}
                  </Position>
                  {/* <Champion
                    title={true}
                    font="regular14"
                    list={user.championResponseList.map(
                      (champion) => champion.championId
                    )}
                  /> */}
                  <Mike>
                    마이크
                    <Toggle
                      isOn="AVAILABLE"
                      onToggle={() => {}}
                      disabled={true}
                    />
                  </Mike>
                </UnderRow>
                <GameStyle
                  // profileType={"none"}
                  styles={[1, 3, 6]}
                  // mike={true}
                  // handleMike={handleMike}
                />
              </StyledBox>
            </RowWrapper>
          </Container>
          <Content>
            <div>
              <Title>{`GAMEGOO님의 매너레벨`}</Title>
              <Box>
                <Text>
                  매너 레벨은 겜구 사용자로부터 받은 매너평가, 비매너평가를
                  반영한 지표예요.
                  <br />
                  최근 <Span>4</Span>명의 사용자가
                  {` `}
                  GAMEGOO
                  {` `}님에게 긍정적 매너 평가를 남겼어요.
                </Text>
                <MannerLevelBar recentLevel={4} mannerRank={15} />
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
                {/* <Champion
                  title={true}
                  font="regular14"
                  list={profile.championResponseList.map(
                    (champion) => champion.championId
                  )}
                /> */}
              </RecentBox>
            </div>
          </Content>
        </Main>
      </MatchContent>
    </Wrapper>
  );
};

export default GuestProfile;

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

const Container = styled.div<{ $backgroundColor?: string }>`
  width: 100%;
  height: 445px;
  box-sizing: border-box;
  border-radius: 30px;
  padding: 23px 44px 44px 44px;
  background: ${({ $backgroundColor }) =>
    $backgroundColor ? $backgroundColor : theme.colors.gray100};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 15px;
  position: relative;

  &.other {
    padding: 42px 41px;
  }
`;

const RowWrapper = styled.div`
  width: 100%;
  height: 186px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 38px;
  margin-bottom: 20px;
`;

const UnderRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 60px;
`;

const ImageContainer = styled.div`
  height: 186px;
  position: relative;
`;

const ProfileImgWrapper = styled.div<{ $bgColor: string }>`
  width: 186px;
  height: 186px;
  border-radius: 50%;
  background: ${(props) => props.$bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PersonImage = styled.object`
  margin-top: 5px;
  filter: drop-shadow(-4px 10px 10px rgba(63, 53, 78, 0.582));
  pointer-events: none;
`;

const StyledBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 36px;
`;

const TopContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 36px;
  ${theme.fonts.bold32};
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  color: ${theme.colors.gray800};
  white-space: nowrap;
`;

const Tag = styled.span`
  margin-right: 5px;
  color: ${theme.colors.gray500};
  font-size: ${theme.fonts.regular32};
`;

const RankTierWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
`;

const Position = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
`;

const Posi = styled.div<{ $isWantP: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: flex-start;
  font-size: ${theme.fonts.regular14};
  position: relative;

  &.other {
    font-size: ${theme.fonts.regular14};
  }

  ${({ $isWantP }) =>
    $isWantP &&
    css`
      margin-left: 36px;
    `}
`;

const Mike = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  font-size: ${theme.fonts.regular14};
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

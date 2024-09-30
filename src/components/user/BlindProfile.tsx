import styled from "styled-components";
import HeaderTitle from "@/components/common/HeaderTitle";
import { theme } from "@/styles/theme";
import { BAD_MANNER_TYPES, MANNER_TYPES } from "@/data/mannerLevel";
import MannerLevelBar from "@/components/common/MannerLevelBar";
import ChatButton from "@/components/common/ChatButton";
import Image from "next/image";
import Toggle from "../common/Toggle";

const BlindProfile = () => {
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
          <HeaderTitle title={`탈퇴한 사용자 님의 프로필`} size="regular" />
        </Row>
        <Main>
          <Container>
            <ProfileRow>
              <ImageContainer>
                <ProfileImgWrapper $bgColor="#606060"></ProfileImgWrapper>
              </ImageContainer>
              <StyledBox>
                <Top>탈퇴한 사용자</Top>
                <UnderRow>
                  <Position>
                    {["주 포지션", "부 포지션"].map((position, index) => (
                      <Posi key={index}>
                        {position}
                        <Image
                          src="/assets/icons/position_all_unclicked.svg"
                          width={55}
                          height={40}
                          alt="포지션"
                        />
                      </Posi>
                    ))}
                  </Position>
                  <Champion>
                    최근 선호 챔피언
                    <ChampionImages>
                      {[...Array(3)].map((_, index) => (
                        <Round key={index} />
                      ))}
                    </ChampionImages>
                  </Champion>
                  <Mike>
                    마이크
                    <Toggle
                      isOn={false}
                      onToggle={() => {}}
                      disabled={true}
                      isBlind={true}
                    />
                  </Mike>
                </UnderRow>
              </StyledBox>
            </ProfileRow>
          </Container>
          <Content>
            <div>
              <Title>{`탈퇴한 사용자님의 매너레벨`}</Title>
              <Box>
                <Text>
                  매너 키워드는 하나 당 1점, 비매너 키워드는 -2점으로 계산해요.
                  <br />
                  최근 <Span>0</Span>명의 사용자가{` `}
                  탈퇴한 사용자{` `}님에게 긍정적 매너 평가를 남겼어요.
                </Text>
                <MannerLevelBar isBlind={true} />
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
                    {MANNER_TYPES.map((type) => {
                      return <Type key={type.id}>{type.text}</Type>;
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
                      <Value key={item.id}>{item.count}</Value>
                    ))}
                  </ValueWrapper>
                  <TypeWrapper>
                    {BAD_MANNER_TYPES.map((type) => (
                      <Type key={type.id}>{type.text}</Type>
                    ))}
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

export default BlindProfile;

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
  color: ${theme.colors.gray700};
`;

const TypeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
`;

const Type = styled.p`
  ${(props) => props.theme.fonts.medium16};
  color: ${theme.colors.gray700};
`;

const Footer = styled.footer`
  display: flex;
  margin-bottom: 78px;
`;

const ChatBoxContent = styled.div`
  margin-left: auto;
`;

/* 프로필 부분 */

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  border-radius: 30px;
  padding: 23px 44px 44px 44px;
  background: ${theme.colors.gray500};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 15px;

  &.other {
    padding: 39px 44px 48px 44px;
  }
`;

const ProfileRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 38px;
`;

const UnderRow = styled(Row)`
  gap: 54px;
`;

const ImageContainer = styled.div`
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

const StyledBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  color: ${theme.colors.gray600};
  font-size: ${theme.fonts.bold32};
  white-space: nowrap;
`;

const Position = styled.div`
  display: flex;
  gap: 33px;
  align-items: center;
`;

const Posi = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  font-size: ${theme.fonts.semiBold14};
  position: relative;
`;

const Champion = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  font-size: ${theme.fonts.semiBold14};
`;

const ChampionImages = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
`;

const Round = styled.div`
  width: 52px;
  height: 52px;
  background-color: ${theme.colors.gray800};
  border-radius: 50%;
`;

const Mike = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  font-size: ${theme.fonts.semiBold14};
`;

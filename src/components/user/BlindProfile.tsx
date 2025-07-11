import styled from "styled-components";

import { HeaderTitle, MannerLevelBar } from "@/components/common";
import { BAD_MANNER_TYPES, MANNER_TYPES, POSITIONS } from "@/constants";
import { theme } from "@/styles/theme";

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
          <HeaderTitle
            title="탈퇴한 사용자 님의 프로필"
            size="bold"
            marginBottom="20px"
            isMatchProgressOrComplete={true}
          />
        </Row>
        <Main>
          <Container>
            <ProfileRow>
              <ImageContainer>
                <ProfileImgWrapper $bgColor={theme.colors.gray600} />
              </ImageContainer>
              <StyledBox>
                <Top>탈퇴한 사용자</Top>
                <UnderRow>
                  <Div>
                    {POSITIONS.slice(0, 2).map((position, index) => (
                      <Element key={index}>
                        {position.label}
                        <div>-</div>
                      </Element>
                    ))}
                  </Div>
                  <Div>
                    <Element>
                      내가 찾는 포지션
                      <div>-</div>
                    </Element>
                    <Element>
                      최근 선호 챔피언
                      <div>-</div>
                    </Element>
                  </Div>
                  {/* <Mike>
                    마이크
                    <Toggle
                      isOn={"UNAVAILABLE"}
                      onToggle={() => {}}
                      disabled={true}
                      isBlind={true}
                    />
                  </Mike> */}
                </UnderRow>
              </StyledBox>
            </ProfileRow>
          </Container>
          <Content>
            <div>
              <Title>{`탈퇴한 사용자님의 매너레벨`}</Title>
              <LevelBox>
                <Text>
                  최근 <Span>0</Span>명의 사용자가{` `}
                  탈퇴한 사용자{` `}님에게 긍정적 매너 평가를 남겼어요.
                </Text>
                <MannerLevelBar recentLevel={0} isBlind={true} />
              </LevelBox>
            </div>
            <div>
              <Title>받은 매너평가</Title>
              <MannerBox>
                <MannerList>
                  <TypeWrapper>
                    {MANNER_TYPES.map((type) => {
                      return <Type key={type.id}>{type.text}</Type>;
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
                    {BAD_MANNER_TYPES.map((type) => (
                      <Type key={type.id}>{type.text}</Type>
                    ))}
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
        </Main>
      </MatchContent>
    </Wrapper>
  );
};

export default BlindProfile;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 62px;

  @media (max-width: ${theme.breakpoints.mobile}) {
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

  @media (max-width: ${theme.breakpoints.mobile}) {
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

  @media (max-width: 850px) {
    display: flex;
    flex-direction: column;
    gap: 36px;
  }
`;

const Title = styled.div`
  margin-bottom: 8px;
  ${(props) => props.theme.fonts.regular25};
  color: ${theme.colors.gray800};

  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) => props.theme.fonts.semiBold18};
  }
`;

const LevelBox = styled.div`
  width: 100%;
  height: 260px;
  border-radius: 20px;
  padding: 24px 26px;
  background: ${theme.colors.gray100};

  @media (max-width: ${theme.breakpoints.mobile}) {
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

  @media (max-width: ${theme.breakpoints.mobile}) {
    height: 196px;
    padding: 20.5px 20px;
    border-radius: 8px;
  }
`;

const Text = styled.div`
  ${(props) => props.theme.fonts.medium16};
  color: ${theme.colors.gray800};
  margin-bottom: 66px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    margin-bottom: 0px;
  }
`;

const Span = styled.span`
  ${(props) => props.theme.fonts.bold16};
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

  @media (max-width: ${theme.breakpoints.mobile}) {
    row-gap: 6.5px;
  }
`;

const Type = styled.p`
  ${(props) => props.theme.fonts.medium16};
  color: ${theme.colors.gray500};

  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) => props.theme.fonts.medium14};
  }
`;

const ValueWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 12px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    row-gap: 6.5px;
  }
`;

const Value = styled.p`
  ${(props) => props.theme.fonts.bold16};
  color: ${theme.colors.gray500};

  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) => props.theme.fonts.bold14};
  }
`;

/* 프로필 부분 */
const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  border-radius: 30px;
  padding: 23px 44px 44px 44px;
  background: ${theme.colors.gray100};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 15px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 20px;
    border-radius: 8px;
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
  white-space: nowrap;

  @media (max-width: 860px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
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

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 100px;
    height: 100px;
  }
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
  gap: 6px;
  ${theme.fonts.bold32};
  color: ${theme.colors.gray800};
  white-space: nowrap;

  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) => props.theme.fonts.bold16};
  }
`;

const Div = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 24px;

  @media (max-width: 430px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const Element = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: flex-start;
  ${theme.fonts.medium14};
  color: ${theme.colors.gray600};
  position: relative;

  @media (max-width: ${theme.breakpoints.mobile}) {
    gap: 5px;
  }

  @media (max-width: 430px) {
    flex-direction: row;
  }
`;

const Mike = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  font-size: ${theme.fonts.regular14};
`;

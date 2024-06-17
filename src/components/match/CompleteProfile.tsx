import { theme } from "@/styles/theme";
import Image from "next/image";
import styled from "styled-components";
import { EX_GAME_STYLE } from "@/data/profile";
import Box from "../common/Box";

const CompleteProfile = () => {
  return (
    <Container>
      <h2>매칭이 완료되었어요!</h2>
      나의 매칭 상대
      <ImageContainer>
        <Image
          src="/assets/images/profile.svg"
          width={186}
          height={186}
          alt="프로필"
        />
        <Level>LV. 5</Level>
      </ImageContainer>
      <StyledBox>
        <Row>
          유니콘의 비밀
          <Span>#KR1</Span>
        </Row>
        <Rank>
          <Image
            src="/assets/images/rank_b3.svg"
            width={43}
            height={43}
            alt="B3"
          />
          B3
        </Rank>
        <Mike>마이크 ON</Mike>
        <GameBox>
          {EX_GAME_STYLE.map((data) => (
            <Box key={data.id} text={data.text} shape="round" />
          ))}
        </GameBox>
        <Position>
          <Posi>
            주 포지션
            <Image
              src="/assets/icons/position_supporter_purple.svg"
              width={55}
              height={44}
              alt="포지션"
            />
          </Posi>
          <Posi>
            부 포지션
            <Image
              src="/assets/icons/position_supporter_purple.svg"
              width={55}
              height={44}
              alt="포지션"
            />
          </Posi>
        </Position>
      </StyledBox>
    </Container>
  );
};

export default CompleteProfile;

const Container = styled.div`
  width: 462px;
  height: 616px;
  border-radius: 30px;
  padding: 40px;
  background: ${theme.colors.white};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const ImageContainer = styled.div`
  position: relative;
`;

const Level = styled.div`
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  width: 53px;
  height: 26px;
  border-radius: 57px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.65);
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  color: ${theme.colors.purple300};
  ${(props) => props.theme.fonts.bold14};
`;

const StyledBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Row = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-size: ${theme.fonts.regular25};
`;

const Span = styled.span`
  color: ${theme.colors.gray300};
`;
const Rank = styled.div`
  display: flex;
  align-items: center;
  color: #44515c;
  font-size: ${theme.fonts.regular16};
  font-weight: 300;
`;

const Position = styled.div`
  display: flex;
  gap: 33px;
  align-items: center;
  font-size: ${theme.fonts.regular14};
`;

const Posi = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
`;

const Mike = styled(Posi)`
  align-items: flex-start;
  gap: 12px;
`;

const GameBox = styled.div`
  display: flex;
  gap: 15px;
`;

import { theme } from "@/styles/theme";
import Image from "next/image";
import React, { useState } from "react";
import styled from "styled-components";
import Toggle from "../common/Toggle";
import { EX_GAME_STYLE } from "@/data/profile";
import Box from "../common/Box";
import GameStylePopup from "../common/GameStylePopup";

const Profile = () => {
  const [isMike, setIsMike] = useState(false);
  const [styledPopup, setStyledPopup] = useState(false);

  const handleMike = () => {
    setIsMike(!isMike);
  };

  const handleStylePopup = () => {
    setStyledPopup(!styledPopup);
  };

  const handleClosePopup = () => {
    setStyledPopup(false);
  };

  return (
    <Container>
      <Row>
        <ImageContainer>
          <Image
            src="/assets/images/profile.svg"
            width={186}
            height={186}
            alt="프로필"
          />
          <CameraImage
            src="/assets/icons/profile_camera.svg"
            width={54}
            height={54}
            alt="프로필 이미지"
          />
        </ImageContainer>
        <StyledBox>
          <Top>
            유니콘의 비밀
            <Span>#KR1</Span>
            <Rank>
              <Image
                src="/assets/images/rank_b3.svg"
                width={52}
                height={52}
                alt="B3"
              />
              B3
            </Rank>
          </Top>
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
            <Posi>
              내가 찾는 포지션
              <Image
                src="/assets/icons/position_supporter_purple.svg"
                width={55}
                height={44}
                alt="포지션"
              />
            </Posi>
            <Mike>
              마이크
              <Toggle isOn={isMike} onToggle={handleMike} />
            </Mike>
          </Position>
        </StyledBox>
      </Row>
      <Style>
        게임 스타일
        <GameBox>
          {EX_GAME_STYLE.map((data) => (
            <Box key={data.id} text={data.text} shape="round" />
          ))}
          <AddGameStyle>
            <Image
              src="/assets/icons/plus.svg"
              width={21}
              height={21}
              alt="추가"
              onClick={handleStylePopup}
            />
          </AddGameStyle>
        </GameBox>
      </Style>
      {styledPopup && <GameStylePopup onClose={handleClosePopup} />}
    </Container>
  );
};

export default Profile;

const Container = styled.div`
  width: 1224px;
  border-radius: 30px;
  padding: 40px 44px;
  background: ${theme.colors.gray500};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 38px;
`;

const Row = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 38px;
`;

const ImageContainer = styled.div`
  position: relative;
`;

const CameraImage = styled(Image)`
  position: absolute;
  bottom: 0px;
  left: 0px;
`;

const StyledBox = styled.div`
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
  color: ${theme.colors.gray100};
  font-size: ${theme.fonts.bold32};
`;

const Span = styled.span`
  color: ${theme.colors.gray300};
  font-size: ${theme.fonts.regular25};
`;
const Rank = styled.div`
  display: flex;
  align-items: center;
  color: #44515c;
  font-size: ${theme.fonts.regular25};
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

const Style = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 11px;
`;

const GameBox = styled.div`
  display: flex;
  gap: 15px;
`;

const AddGameStyle = styled.div`
  display: flex;
  width: 62px;
  height: 50px;
  padding: 13px 30px;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
  background: ${theme.colors.purple300};
  cursor: pointer;
`;

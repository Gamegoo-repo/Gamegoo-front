import React from "react";
import { theme } from "@/styles/theme";
import Image from "next/image";
import styled from "styled-components";
import GameStyle from "./GameStyle";
import { POSITIONS } from "@/data/profile";

type profileType = "fun" | "hard";

interface Profile {
  profileType: profileType;
}

const Profile: React.FC<Profile> = ({ profileType = "hard" }) => {
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
          {profileType === "fun" ? (
            <GameStyle />
          ) : (
            <Position>
              {POSITIONS.map((position, index) => (
                <Posi key={index}>
                  {position.label}
                  <Image
                    src={`/assets/icons/position_${position.position}_purple.svg`}
                    width={55}
                    height={44}
                    alt="포지션"
                  />
                </Posi>
              ))}
            </Position>
          )}
        </StyledBox>
      </Row>
      {profileType === "hard" && <GameStyle />}
    </Container>
  );
};

export default Profile;

const Container = styled.div`
  width: 100%;
  border-radius: 30px;
  padding: 40px 44px;
  background: ${theme.colors.gray500};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 15px;
`;

const Row = styled.div`
  width: 100%;
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

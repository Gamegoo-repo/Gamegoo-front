import GameStyle from "@/components/match/GameStyle";
import { Profile } from "@/interface/profile";
import { theme } from "@/styles/theme";
import Image from "next/image";
import React from "react";
import styled from "styled-components";

const MyPageProfile: React.FC<Profile> = ({ user }) => {
  return (
    <Container>
      <ImageContainer>
        <Image src={user.image} width={154} height={154} alt="profile" />
        <CameraImage
          src="/assets/icons/profile_camera.svg"
          width={34}
          height={34}
          alt="edit"
        />
      </ImageContainer>
      <Div>
        <Top>
          <Image
            src={`/assets/images/rank_${user.tier}.svg`}
            width={43}
            height={43}
            alt="profile"
          />
          {user.account}
          <Tag>#{user.tag}</Tag>
        </Top>
        <GameStyle gameStyle={user.gameStyle} profileType="mini" mic={false} />
        {/* <GameStyle gameStyle={gameStyle} /> */}
      </Div>
    </Container>
  );
};

export default MyPageProfile;

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  border-radius: 20px;
  padding: 28px 37px;
  background: ${theme.colors.gray500};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 26px;
`;

const ImageContainer = styled.div`
  position: relative;
`;

const CameraImage = styled(Image)`
  position: absolute;
  bottom: 8px;
  left: 8px;
`;

const Div = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 18px;
`;

const Tag = styled.div`
  color: ${theme.colors.gray300};
  ${(props) => props.theme.fonts.regular25}
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  ${(props) => props.theme.fonts.bold25};
  color: ${theme.colors.gray600};
`;

import { putProfileImg } from "@/api/mypage";
import GameStyle from "@/components/match/GameStyle";
import { Profile } from "@/interface/profile";
import { theme } from "@/styles/theme";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { css } from "styled-components";

const MyPageProfile: React.FC<Profile> = ({ user }) => {
  const [isProfileListOpen, setIsProfileListOpen] = useState(false);

  // 프로필 이미지 값이 "default"인 경우 1로 기본 설정, 그렇지 않으면 문자열에서 마지막 숫자 추출
  const getProfileIndex = () => {
    if (user.profileImg === "default") return 1;
    const match = user.profileImg.match(/\d+$/);
    return match ? parseInt(match[0], 10) : 1;
  };

  /* 선택된 현재 프로필 이미지 */
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(
    getProfileIndex()
  );

  /* 프로필 이미지 리스트 중 클릭시*/
  const handleImageClick = async (index: number) => {
    setSelectedImageIndex(index);

    await putProfileImg(`profile${index}`);

    setTimeout(() => {
      setIsProfileListOpen(false);
    }, 300); // 300ms 후에 창이 닫히도록 설정
  };

  return (
    <Container>
      <ImageContainer>
        <ProfileImage>
          <PersonImage
            src={`/assets/images/profile/profile${selectedImageIndex}.svg`}
            width={126}
            height={126}
            alt="프로필"
          />
        </ProfileImage>
        <CameraImage
          src="/assets/icons/profile_camera.svg"
          width={34}
          height={34}
          alt="edit"
          onClick={() => setIsProfileListOpen(!isProfileListOpen)}
        />
        {/* 프로필 이미지 선택 팝업 */}
        {isProfileListOpen && (
          <ProfileListBox>
            <Image
              src="/assets/icons/close_white.svg"
              width={14}
              height={14}
              alt="닫기"
              onClick={() => setIsProfileListOpen(false)}
            />
            <ProfileList>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((item, index) => (
                <ProfileListImage
                  key={index}
                  src={`/assets/images/profile/profile${item}.svg`}
                  width={106.52}
                  height={119.65}
                  alt="프로필 이미지"
                  isSelected={index === selectedImageIndex}
                  onClick={() => handleImageClick(index)}
                />
              ))}
            </ProfileList>
          </ProfileListBox>
        )}
      </ImageContainer>
      <Div>
        <Top>
          <Image
            src={`/assets/images/rank_${user.tier || "b3"}.svg`}
            width={43}
            height={43}
            alt="profile"
          />
          {user.gameName}
          <Tag>#{user.tag}</Tag>
        </Top>
        <GameStyle
          gameStyleResponseDTOList={user.gameStyleResponseDTOList}
          profileType="mini"
          mic={false}
        />
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
  white-space: nowrap;
`;

const ImageContainer = styled.div`
  position: relative;
`;

const ProfileImage = styled.div`
  width: 154px;
  height: 154px;
  border-radius: 93px;
  background: ${theme.colors.purple300};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PersonImage = styled(Image)`
  margin-top: 5px;
  filter: drop-shadow(-4px 10px 10px rgba(63, 53, 78, 0.582));
`;

const CameraImage = styled(Image)`
  position: absolute;
  bottom: 3px;
  left: 3px;
`;

const ProfileListBox = styled.div`
  width: 527px;
  height: 335px;
  display: flex;
  flex-direction: column;
  padding: 21px;
  gap: 10px;
  justify-content: center;
  align-items: flex-end;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.64);
  position: absolute;
  top: 170px;
  left: 0px;
  z-index: 100;
`;

const ProfileList = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 14px 29px 14px;
  row-gap: 25px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
`;

const ProfileListImage = styled(Image)<{ isSelected: boolean }>`
  cursor: pointer;
  transition: opacity 0.3s ease-in-out;

  ${({ isSelected }) =>
    isSelected &&
    css`
      opacity: 0.5;
    `}

  &:hover {
    filter: drop-shadow(0px 4px 10px rgba(138, 117, 255, 0.7));
    transition: box-shadow 0.3s ease-in-out;
  }
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

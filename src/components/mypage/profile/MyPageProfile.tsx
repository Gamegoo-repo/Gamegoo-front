import { getMyProfile } from "@/api/user/profile/get";
import { putProfileImage } from "@/api/user/profile/put";
import RankTier from "@/components/common/RankTier";
import GameStyle from "@/components/match/GameStyle";
import { Profile } from "@/interface/profile";
import { setUserProfile, setUserProfileImg } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";
import { theme } from "@/styles/theme";
import { getProfileBgColor } from "@/utils/profile";
import { toLowerCaseString } from "@/utils/string";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { css } from "styled-components";
import useMediaQueries from "@/hooks/useMediaQueries";
import { STORAGE_KEY } from "@/constants/storage";

const MyPageProfile: React.FC<Profile> = ({ user }) => {
  const dispatch = useDispatch();
  const isMobile = useMediaQueries({ breakpoint: 700 });
  const [isProfileListOpen, setIsProfileListOpen] = useState(false);
  const userRedux = useSelector((state: RootState) => state.user);

  /* 선택된 현재 프로필 이미지 */
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(
    userRedux.profileImg
  );

  /* 프로필 이미지 리스트 중 클릭시*/
  const handleImageClick = async (index: number) => {
    setSelectedImageIndex(index);

    await putProfileImage(index);
    const newUserData = await getMyProfile();
    dispatch(setUserProfileImg(index));
    localStorage.setItem(STORAGE_KEY.profileImg, index + "");
    dispatch(setUserProfile(newUserData.data));

    setTimeout(() => {
      setIsProfileListOpen(false);
    }, 300); // 300ms 후에 창이 닫히도록 설정
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await getMyProfile();
        dispatch(setUserProfile(userData.data));
      } catch (error) {
        console.error("프로필 정보 불러오기 실패:", error);
      }
    };

    fetchProfile();
  }, [dispatch]);

  useEffect(() => {
    setSelectedImageIndex(userRedux.profileImg);
  }, [userRedux.profileImg]);

  return (
    <Container>
      <ImageContainer>
        <ProfileImgWrapper>
          <PersonImgWrapper $bgColor={getProfileBgColor(selectedImageIndex)}>
            <PersonImage
              data={`/assets/images/profile/profile${selectedImageIndex}.svg`}
              width={!isMobile ? 85 : 39}
              height={!isMobile ? 97.5 : 35}
            />
          </PersonImgWrapper>
          <CameraImgBg onClick={() => setIsProfileListOpen(!isProfileListOpen)}>
            <CameraImage
              data="/assets/icons/edit_pencil.svg"
              width={!isMobile ? 18 : 9}
              height={!isMobile ? 18 : 9}
            />
          </CameraImgBg>
        </ProfileImgWrapper>

        {/* 프로필 이미지 선택 팝업 */}
        {isProfileListOpen && (
          <ProfileListBox>
            <ProfileListBoxTop>
              프로필 이미지 선택
              <Image
                src="/assets/icons/close_white.svg"
                width={14}
                height={14}
                alt="닫기"
                onClick={() => setIsProfileListOpen(false)}
              />
            </ProfileListBoxTop>
            <ProfileList>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <SelectProfileImgWrapper
                  key={item}
                  $bgColor={getProfileBgColor(item)}
                  $isSelected={item === selectedImageIndex}
                  onClick={() => handleImageClick(item)}
                >
                  {item === selectedImageIndex && (
                    <CheckIcon
                      width={22}
                      height={22}
                      data={`/assets/icons/check_white.svg`}
                    />
                  )}
                  <ProfileListImage
                    key={item}
                    data={`/assets/images/profile/profile${item}.svg`}
                    width={isMobile ? 40 : 70}
                    height={isMobile ? 40 : 70}
                  />
                </SelectProfileImgWrapper>
              ))}
            </ProfileList>
          </ProfileListBox>
        )}

        {isMobile && (
          <Top>
            <Name>{user.gameName}</Name>
            <Tag>{`#${user.tag}`}</Tag>
          </Top>
        )}
      </ImageContainer>

      <Div>
        {!isMobile && (
          <Name>
            {user.gameName}
            <Tag>#{user.tag}</Tag>
          </Name>
        )}

        <RankTierWrapper>
          <RankTier
            rankFontSize={theme.fonts.medium14}
            tierFontSize={theme.fonts.bold20}
            type="solo"
            tier={user.soloTier}
            rank={user.soloRank}
          />
          <RankTier
            rankFontSize={theme.fonts.medium14}
            tierFontSize={theme.fonts.bold20}
            type="free"
            tier={user.freeTier}
            rank={user.freeRank}
          />
        </RankTierWrapper>
        <GameStyle
          gameStyleResponseDTOList={user.gameStyleResponseList}
          profileType="mini"
          mike={user.mike}
        />
      </Div>
    </Container>
  );
};

export default MyPageProfile;

const Container = styled.div`
  width: 620px;
  /* height: 267px; */
  box-sizing: border-box;
  border-radius: 30px;
  padding: 27px 26px;
  background: ${theme.colors.gray100};
  display: flex;
  justify-content: flex-start;
  gap: 26px;
  white-space: nowrap;

  @media (max-width: 700px) {
    width: 100%;
    border-radius: 20px;
    padding: 20px;
    flex-direction: column;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  @media (max-width: 700px) {
    display: flex;
    gap: 8px;
    align-items: center;
  }
`;
const ProfileImgWrapper = styled.div``;
const PersonImgWrapper = styled.div<{ $bgColor: string }>`
  width: 120px;
  height: 120px;
  border-radius: 93px;
  background: ${(props) => props.$bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 700px) {
    width: 52px;
    height: 52px;
  }
`;

const PersonImage = styled.object`
  margin-top: 5px;
  filter: drop-shadow(-4px 10px 10px rgba(63, 53, 78, 0.582));
  pointer-events: none;
  @media (max-width: 700px) {
    margin-top: 0;
  }
`;

const CameraImgBg = styled.div`
  position: relative;
  width: 34px;
  height: 34px;
  background: #000000a1;
  box-shadow: 0 0 3.06px 0 #00000040;
  border-radius: 50%;
  top: -36px;
  @media (max-width: 700px) {
    position: absolute;
    top: unset;
    bottom: 0;
    width: 20px;
    height: 20px;
  }
`;

const CameraImage = styled.object`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

const ProfileListBox = styled.div`
  width: 527px;
  height: 335px;
  display: flex;
  flex-direction: column;
  padding: 32px;
  gap: 10px;
  justify-content: center;
  align-items: flex-end;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.64);
  position: absolute;
  top: 120px;
  left: 10px;
  z-index: 100;
  /* Background Blur */
  box-shadow: 0 4px 8.9px 0 rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(7.5px);
`;

const ProfileListBoxTop = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${theme.colors.white};
  ${theme.fonts.bold20};
  margin-bottom: 20px;
`;

const ProfileList = styled.div`
  width: 100%;
  height: 100%;
  row-gap: 30px;
  column-gap: 30px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  justify-content: center;
  align-items: center;
  justify-items: center;
`;

const SelectProfileImgWrapper = styled.div<{
  $bgColor: string;
  $isSelected: boolean;
}>`
  position: relative;
  width: 96px;
  height: 96px;
  background: ${(props) => props.$bgColor};
  border-radius: 50%;
  ${({ $isSelected }) =>
    $isSelected &&
    css`
      border: 3.41px solid ${theme.colors.white};
    `}

  &:hover {
    filter: drop-shadow(0px 4px 10px rgba(138, 117, 255, 0.7));
    transition: box-shadow 0.3s ease-in-out;
  }
`;

const CheckIcon = styled.object`
  position: absolute;
  top: 15px;
  left: 10px;
  z-index: 10;
  transform: translate(-50%, -50%);
  width: 36px;
  height: 36px;
  background: ${theme.colors.violet600};
  border-radius: 50%;
  border: 3.41px solid ${theme.colors.white};
`;
const ProfileListImage = styled.object`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  transition: opacity 0.3s ease-in-out;
`;

const Div = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  margin-top: 10px;
`;
const Top = styled.div``;

const Name = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  ${(props) => props.theme.fonts.bold25};
  color: ${theme.colors.gray800};

  @media (max-width: 700px) {
    ${(props) => props.theme.fonts.bold16};
  }
`;

const Tag = styled.div`
  color: ${theme.colors.gray500};
  ${(props) => props.theme.fonts.bold20}
  @media (max-width: 700px) {
    ${(props) => props.theme.fonts.bold12};
  }
`;

const RankTierWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
`;

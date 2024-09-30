import { getProfile, putProfileImg } from "@/api/user";
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

const MyPageProfile: React.FC<Profile> = ({ user }) => {
  const dispatch = useDispatch();
  const [isProfileListOpen, setIsProfileListOpen] = useState(false);
  const userRedux = useSelector((state: RootState) => state.user);

  /* 선택된 현재 프로필 이미지 */
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(
    userRedux.profileImg
  );

  /* 프로필 이미지 리스트 중 클릭시*/
  const handleImageClick = async (index: number) => {
    setSelectedImageIndex(index);

    await putProfileImg(index);
    const newUserData = await getProfile();
    dispatch(setUserProfileImg(index));
    localStorage.setItem("profileImg", index + "");
    dispatch(setUserProfile(newUserData));

    setTimeout(() => {
      setIsProfileListOpen(false);
    }, 300); // 300ms 후에 창이 닫히도록 설정
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await getProfile();
        dispatch(setUserProfile(userData));
        console.log("userData", userData);
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
        <ProfileImgWrapper $bgColor={getProfileBgColor(selectedImageIndex)}>
          <PersonImage
            src={`/assets/images/profile/profile${selectedImageIndex}.svg`}
            width={110}
            height={110}
            alt="프로필"
          />
        </ProfileImgWrapper>
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
            <ProfileListBoxTop>
              프로필 이미지 변경
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
                  isSelected={item === selectedImageIndex}
                  onClick={() => handleImageClick(item)}
                >
                  <ProfileListImage
                    src={`/assets/images/profile/profile${item}.svg`}
                    width={70}
                    height={70}
                    alt="프로필 이미지"
                  />
                </SelectProfileImgWrapper>
              ))}
            </ProfileList>
          </ProfileListBox>
        )}
      </ImageContainer>
      <Div>
        <Top>
          <Image
            src={`/assets/images/tier/${
              toLowerCaseString(user.tier) || "ur"
            }.svg`}
            width={43}
            height={43}
            alt="tier"
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

const ProfileImgWrapper = styled.div<{ $bgColor: string }>`
  width: 154px;
  height: 154px;
  border-radius: 93px;
  background: ${(props) => props.$bgColor};
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

const ProfileListBoxTop = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${theme.colors.white};
  ${theme.fonts.regular20};
`;

// const ProfileList = styled.div`
//   width: 100%;
//   height: 100%;
//   padding: 0 14px 29px 14px;
//   row-gap: 25px;
//   display: grid;
//   grid-template-columns: repeat(4, 1fr);
//   grid-template-rows: repeat(2, 1fr);
// `;

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
  isSelected: boolean;
}>`
  position: relative;
  width: 96px;
  height: 96px;
  background: ${(props) => props.$bgColor};
  border-radius: 50%;
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

const ProfileListImage = styled(Image)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  transition: opacity 0.3s ease-in-out;
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

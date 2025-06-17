import { getMyProfile } from "@/api/user/profile/get";
import { putProfileImage } from "@/api/user/profile/put";
import RankTier from "@/components/common/RankTier";
import GameStyle from "@/components/match/GameStyle";
import { Profile } from "@/interface/profile";
import { setUserProfile, setUserProfileImg } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";
import { theme } from "@/styles/theme";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import useMediaQueries from "@/hooks/useMediaQueries";
import UpdateProfileImage from "@/components/profile/UpdateProfileImage";

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
    localStorage.setItem("profileImg", index + "");
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
        <UpdateProfileImage
          type="mypage"
          selectedImageIndex={selectedImageIndex}
          setIsProfileListOpen={setIsProfileListOpen}
          isProfileListOpen={isProfileListOpen}
          onImageClick={handleImageClick}
        />
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

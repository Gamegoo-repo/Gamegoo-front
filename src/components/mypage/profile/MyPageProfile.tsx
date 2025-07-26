import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { getProfile, putProfileProfileImage } from "@/@generated/api";
import { RankTier } from "@/components/common";
import GameStyle from "@/components/match/GameStyle";
import { UpdateProfileImage } from "@/components/profile";
import { useMediaQueryContext } from "@/hooks";
import { setUserProfile, setUserProfileImg } from "@/redux/slices/userSlice";
import { theme } from "@/styles/theme";

import type { RootState } from "@/redux/store";
import type { Profile } from "@/types";

const MyPageProfile: React.FC<Profile> = ({ user }) => {
  const dispatch = useDispatch();
  const { isMobile } = useMediaQueryContext();
  const [isProfileListOpen, setIsProfileListOpen] = useState(false);
  const userRedux = useSelector((state: RootState) => state.user);

  /* 선택된 현재 프로필 이미지 */
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(
    userRedux.profileImg
  );

  /* 프로필 이미지 리스트 중 클릭시*/
  const handleImageClick = async (index: number) => {
    setSelectedImageIndex(index);

    await putProfileProfileImage({ profileImage: index });
    dispatch(setUserProfileImg(index));
    localStorage.setItem("profileImg", index + "");

    const response = await getProfile();

    if (!response.data) {
      throw new Error("내 프로필 조회 응답 데이터가 없습니다.");
    }

    const profile = response.data;
    dispatch(setUserProfile(profile));

    setTimeout(() => {
      setIsProfileListOpen(false);
    }, 300); // 300ms 후에 창이 닫히도록 설정
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();

        if (!response.data) {
          throw new Error("내 프로필 조회 응답 데이터가 없습니다.");
        }

        const profile = response.data;
        dispatch(setUserProfile(profile));
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

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 100%;
    border-radius: 20px;
    padding: 20px;
    flex-direction: column;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  @media (max-width: ${theme.breakpoints.mobile}) {
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

  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) => props.theme.fonts.bold16};
  }
`;

const Tag = styled.div`
  color: ${theme.colors.gray500};
  ${(props) => props.theme.fonts.bold20}
  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) => props.theme.fonts.bold12};
  }
`;

const RankTierWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
`;

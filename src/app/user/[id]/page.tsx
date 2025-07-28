"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styled from "styled-components";

import { getMemberMannerKeyword, getMemberMannerLevel } from "@/api";
import { BlindProfile, LoadingSpinner, UserProfile } from "@/components";
import { DEFAULT_MANNER, DEFAULT_PROFILE } from "@/data/profile/default";
import { getAccessToken } from "@/utils";
import { memberApi } from "@/utils/api";
import { mapOtherProfileToUser } from "@/utils/user/mapOtherProfileToUser";

import type { Manner } from "@/components/user/UserProfile";
import type { User } from "@/types";

const UserProfilePage = () => {
  const { id } = useParams();
  const [otherProfile, setOtherProfile] = useState<User>();
  const [otherManner, setOtherManner] = useState<Manner>({
    memberId: 0,
    mannerLevel: 0,
    mannerRank: 0,
    mannerKeywords: [
      {
        mannerKeywordId: 0,
        count: 0,
      },
    ],
  });
  const [friendState, setFriendState] = useState<{
    friend: boolean;
    friendRequestMemberId: number | null;
    blocked: boolean;
  }>({
    friend: false,
    friendRequestMemberId: null,
    blocked: false,
  });

  // 토큰 확인 상태 관리
  const [isTokenChecked, setIsTokenChecked] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      setHasToken(true);

      // 토큰이 있을 때만 프로필, 매너 정보 불러오기
      const fetchOtherProfile = async () => {
        try {
          const response = await memberApi.getMember({ id: Number(id) });
          if (!response.data) {
            throw new Error("다른 유저 프로필 조회 응답 데이터가 없습니다.");
          }

          const otherUserMappedData: User = mapOtherProfileToUser(
            response.data
          );

          setOtherProfile(otherUserMappedData);
          console.log(response);
        } catch (error) {
          console.error(error);
        }
      };

      const fetchOtherManner = async () => {
        try {
          const response_level = await getMemberMannerLevel(Number(id));
          const response_keywords = await getMemberMannerKeyword(Number(id));
          setOtherManner({ ...response_level.data, ...response_keywords.data });
        } catch (error) {
          console.error(error);
        }
      };

      fetchOtherProfile();
      fetchOtherManner();
    }
    setIsTokenChecked(true);
  }, [id, friendState]);

  // 상태 업데이트를 처리하는 함수
  const updateFriendState = (newFriendState: {
    friend: boolean;
    friendRequestMemberId: number | null;
    blocked: boolean;
  }) => {
    setFriendState(newFriendState);
  };

  // 토큰 확인이 완료되기 전
  if (!isTokenChecked) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  // 토큰이 없으면 기본 프로필 렌더링
  if (!hasToken) {
    return (
      <UserProfile
        profile={DEFAULT_PROFILE}
        manner={DEFAULT_MANNER}
        updateFriendState={updateFriendState}
        isDefault={true}
      />
    );
  }

  // 토큰은 있지만 프로필 정보가 아직 없을 경우
  if (!otherProfile) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  // 프로필이 블라인드 상태라면
  if (otherProfile.isBlind) {
    return <BlindProfile />;
  }

  // 모든 조건을 만족하면 실제 프로필 렌더링
  return (
    <UserProfile
      profile={otherProfile}
      profileType="other"
      manner={otherManner}
      updateFriendState={updateFriendState}
    />
  );
};

export default UserProfilePage;

const LoadingContainer = styled.div`
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
`;

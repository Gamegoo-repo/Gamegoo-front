"use client";

import { getMemberMannerKeyword, getMemberMannerLevel } from "@/api/manner";
import { getOtherProfile } from "@/api/user/profile/get";
import BlindProfile from "@/components/user/BlindProfile";
import GuestProfile from "@/components/user/GuestProfile";
import UserProfile, { Manner } from "@/components/user/UserProfile";
import { User } from "@/interface/profile";
import { getAccessToken } from "@/utils/storage";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    if (getAccessToken()) {
      const fetchOtherProfile = async () => {
        try {
          const response = await getOtherProfile(Number(id));
          setOtherProfile(response.data);
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
  }, [id, friendState]);

  // 상태 업데이트를 처리하는 함수
  const updateFriendState = (newFriendState: {
    friend: boolean;
    friendRequestMemberId: number | null;
    blocked: boolean;
  }) => {
    setFriendState(newFriendState);
  };

  return !getAccessToken() ? (
    <GuestProfile />
  ) : !otherProfile ? (
    <p>Loading...</p>
  ) : otherProfile.isBlind ? (
    <BlindProfile />
  ) : (
    <UserProfile
      profile={otherProfile}
      manner={otherManner}
      updateFriendState={updateFriendState}
    />
  );
};

export default UserProfilePage;

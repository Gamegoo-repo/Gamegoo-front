"use client";

import { getOtherManner } from "@/api/manner";
import { getOtherProfile } from "@/api/member";
import UserProfile, { Manner } from "@/components/user/UserProfile";
import { User } from "@/interface/profile";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const UserProfilePage = () => {
  const { id } = useParams();
  const [otherProfile, setOtherProfile] = useState<User>();
  const [otherManner, setOtherManner] = useState<Manner>();
  const [friendState, setFriendState] = useState<{
    friend: boolean;
    friendRequestMemberId: number | null;
  }>({
    friend: false,
    friendRequestMemberId: null,
  });

  useEffect(() => {
    const fetchOtherProfile = async () => {
      try {
        const response = await getOtherProfile(Number(id));
        setOtherProfile(response.result);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchOtherManner = async () => {
      try {
        const response = await getOtherManner(Number(id));
        setOtherManner(response.result);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOtherProfile();
    fetchOtherManner();
  }, [id, friendState]);

  // 상태 업데이트를 처리하는 함수
  const updateFriendState = (newFriendState: {
    friend: boolean;
    friendRequestMemberId: number | null;
  }) => {
    setFriendState(newFriendState);
  };

  return otherProfile && otherManner ? (
    <UserProfile
      profile={otherProfile}
      manner={otherManner}
      updateFriendState={updateFriendState}
    />
  ) : (
    <p>Loading...</p>
  );
};

export default UserProfilePage;

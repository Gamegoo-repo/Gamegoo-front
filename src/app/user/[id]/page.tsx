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
  }, []);

  return otherProfile && otherManner ? (
    <UserProfile profile={otherProfile} manner={otherManner} />
  ) : (
    <p>Loading...</p>
  );
};

export default UserProfilePage;

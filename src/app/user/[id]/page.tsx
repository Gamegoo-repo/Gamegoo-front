"use client";

import { getOtherProfile } from "@/api/member";
import UserProfile from "@/components/user/UserProfile";
import { User } from "@/interface/profile";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const UserProfilePage = () => {
  const { id } = useParams();
  const [otherProfile, setOtherProfile] = useState<User>();

  useEffect(() => {
    const fetchOtherProfile = async () => {
      try {
        const response = await getOtherProfile(Number(id));
        setOtherProfile(response.result);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOtherProfile();
  }, []);

  return otherProfile ? (
    <UserProfile profile={otherProfile} />
  ) : (
    <p>Loading...</p>
  );
};

export default UserProfilePage;

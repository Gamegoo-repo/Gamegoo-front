"use client";

import styled from "styled-components";
import { useRouter, useSearchParams } from "next/navigation";
import Profile from "@/components/match/Profile";
import Button from "@/components/common/Button";
import HeaderTitle from "@/components/common/HeaderTitle";
import { useEffect, useState } from "react";
import { profileType } from "@/interface/profile";
import { Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "@/api/mypage";
import { setUserProfile } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";

const ProfilePage = () => {
  const router = useRouter();
  const [profileType, setProfileType] = useState<profileType | undefined>();
  const searchParams = useSearchParams();
  const params = searchParams.get("type");

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        dispatch(setUserProfile(response.result));
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (
      params &&
      (params === "fun" ||
        params === "hard" ||
        params === "other" ||
        params === "me")
    ) {
      setProfileType(params as profileType);
    } else {
      setProfileType(undefined);
    }
  }, [params]);

  return (
    <Wrapper>
      <MatchContent>
        <HeaderTitle title="프로필 설정" />
        <Main>
          <Profile profileType={profileType ?? "fun"} user={user} />
          <Button
            buttonType="primary"
            width="380px"
            text="매칭 시작하기"
            onClick={() => {
              router.push("/matching/progress");
            }}
          />
        </Main>
      </MatchContent>
    </Wrapper>
  );
};

export default function ProfilePaging() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfilePage />
    </Suspense>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 140px;
`;

const MatchContent = styled.div`
  max-width: 1440px;
  width: 100%;
  padding: 60px 80px 0px 80px;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
  gap: 14px;
  margin-bottom: 37px;
`;

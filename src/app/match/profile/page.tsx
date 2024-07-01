"use client";

import ChatBox from "@/components/common/ChatBox";
import Image from "next/image";
import styled from "styled-components";
import { useRouter, useSearchParams } from "next/navigation";
import Profile from "@/components/match/Profile";
import Button from "@/components/common/Button";
import HeaderTitle from "@/components/common/HeaderTitle";
import { useEffect, useState } from "react";
import { profileType } from "@/interface/profile";
import { Suspense } from "react";

const userData = {
  image: "/assets/images/profile.svg",
  account: "유니콘의 비밀",
  tag: "KR1",
  tier: "B3",
  manner_level: 5,
  mic: true,
  gameStyle: [
    "이기기만 하면 뭔들",
    "과도한 핑은 사절이에요",
    "랭크 올리고 싶어요",
  ],
};

const ProfilePage = () => {
  const router = useRouter();
  const [profileType, setProfileType] = useState<profileType | undefined>();
  const searchParams = useSearchParams();
  const params = searchParams.get("type");

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
          <Profile profileType={profileType ?? "fun"} user={userData} />
          <Button
            buttonType="primary"
            width="380px"
            text="매칭 시작하기"
            onClick={() => {
              router.push("/matching/progress");
            }}
          />
        </Main>
        <Footer>
          <ChatBoxContent>
            <ChatBox count={3} />
          </ChatBoxContent>
        </Footer>
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
`;

const MatchContent = styled.div`
  max-width: 1440px;
  width: 100%;
  padding: 0 80px;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 32px;
`;

const StyledImage = styled(Image)`
  margin-right: 35px;
  cursor: pointer;
`;

const Title = styled.h1`
  ${(props) => props.theme.fonts.bold32};
  color: #393939;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
  gap: 14px;
  margin-bottom: 37px;
`;

const Footer = styled.footer`
  display: flex;
  margin-bottom: 78px;
`;

const ChatBoxContent = styled.div`
  margin-left: auto;
  margin-bottom: 37px;
`;

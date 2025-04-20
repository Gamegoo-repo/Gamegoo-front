"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setToken } from "@/utils/storage";

const RsoCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    const accessToken = url.searchParams.get("accessToken");
    const refreshToken = url.searchParams.get("refreshToken");
    const puuid = url.searchParams.get("puuid");
    const state = url.searchParams.get("state");

    if (accessToken && refreshToken) {
      // 로그인 완료 처리
      console.log("라이엇 로그인 성공");
      setToken(accessToken, refreshToken, false); // 자동 로그인 유무 확인
      // 서버 응답값 추가 필요
      //   dispatch(setUserName(response.data.name));
      //   dispatch(setUserProfileImg(response.data.profileImage));
      //   dispatch(setUserId(response.data.id));
      //   setName(response.data.name, autoLogin);
      //   setProfileImg(response.data.profileImage, autoLogin);
      //   setId(response.data.id, autoLogin);
      router.push("/");
    } else if (puuid) {
      // 회원가입 페이지로 이동
      router.push(`/signup?puuid=${puuid}&state=${state}`);
    } else {
      console.error("유효하지 않은 응답입니다.");
    }
  }, []);

  return <div>사용자 처리 중...</div>;
};

export default RsoCallback;

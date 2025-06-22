"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setToken } from "@/utils/storage";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import {
  setUserId,
  setUserName,
  setUserProfileImg,
} from "@/redux/slices/userSlice";
import { notify } from "@/hooks/notify";
import { LOGIN } from "@/constants/messages";
import { STORAGE_KEY } from "@/constants/storage";

const RsoCallback = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const url = new URL(window.location.href);
    const accessToken = url.searchParams.get(STORAGE_KEY.accessToken);
    const refreshToken = url.searchParams.get(STORAGE_KEY.refreshToken);
    const name = url.searchParams.get(STORAGE_KEY.name);
    const profileImage = url.searchParams.get("profileImage");
    const id = url.searchParams.get("id");
    const puuid = url.searchParams.get("puuid");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    if (error === "signup_disabled") {
      // 소환사명이 없을 경우 오류 처리
      notify({
        text: LOGIN.MESSAGE.RIOT_ERROR,
        icon: "🚫",
        type: "error",
      });
      router.push("/riot");
    }

    if (accessToken && refreshToken && name && profileImage && id) {
      // 로그인 완료 처리
      setToken(accessToken, refreshToken, true);
      dispatch(setUserName(name));
      dispatch(setUserProfileImg(Number(profileImage)));
      dispatch(setUserId(Number(id)));
      router.push("/");
    } else if (puuid) {
      // 회원가입 페이지로 이동
      router.push(`/join/terms?puuid=${puuid}&state=${state}`);
    } else {
      console.error("유효하지 않은 응답입니다.");
    }
  }, []);

  return (
    <LoadingContainer>
      <LoadingSpinner />
    </LoadingContainer>
  );
};

export default RsoCallback;

const LoadingContainer = styled.div`
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
`;

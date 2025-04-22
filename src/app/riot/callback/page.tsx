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

const RsoCallback = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const url = new URL(window.location.href);
    const accessToken = url.searchParams.get("accessToken");
    const refreshToken = url.searchParams.get("refreshToken");
    const puuid = url.searchParams.get("puuid");
    const state = url.searchParams.get("state");

    if (accessToken && refreshToken) {
      // 로그인 완료 처리
      setToken(accessToken, refreshToken, true);
      // 서버 응답값 추가 필요
      //   dispatch(setUserName(response.data.name));
      //   dispatch(setUserProfileImg(response.data.profileImage));
      //   dispatch(setUserId(response.data.id));

      // 테스트용 redux 설정
      dispatch(setUserName("라이엇"));
      dispatch(setUserProfileImg(1));
      dispatch(setUserId(8));
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

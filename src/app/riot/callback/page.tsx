"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import styled from "styled-components";

import { getUnreadUuid, socketLogin } from "@/api";
import { LoadingSpinner } from "@/components";
import ko from "@/constants/ko.json";
import { STORAGE_KEY } from "@/constants/storage";
import { notify } from "@/hooks";
import { setUnreadUuid } from "@/redux/slices/chatSlice";
import {
  setUserId,
  setUserName,
  setUserProfileImg,
} from "@/redux/slices/userSlice";
import { connectSocket, socket } from "@/socket";

const RsoCallback = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const url = new URL(window.location.href);
      const accessToken = url.searchParams.get("accessToken");
      const refreshToken = url.searchParams.get("refreshToken");
      const name = url.searchParams.get("name");
      const profileImage = url.searchParams.get("profileImage");
      const id = url.searchParams.get("id");
      const puuid = url.searchParams.get("puuid");
      const state = url.searchParams.get("state");
      const error = url.searchParams.get("error");
      const autoLogin = sessionStorage.getItem(STORAGE_KEY.autoLogin);

      if (error === "signup_disabled") {
        // 소환사명이 없을 경우 오류 처리
        notify({
          text: ko["login.riot.error"],
          icon: "🚫",
          type: "error",
        });
        router.push("/riot");
      }

      if (accessToken && refreshToken && name && profileImage && id) {
        /* 자동 로그인 체크 여부에 따라 토큰 저장 위치 결정 */
        const storage = Boolean(autoLogin) ? localStorage : sessionStorage;
        storage.setItem(STORAGE_KEY.accessToken, accessToken);
        storage.setItem(STORAGE_KEY.refreshToken, refreshToken);
        storage.setItem(STORAGE_KEY.name, name);
        storage.setItem(STORAGE_KEY.profileImg, profileImage);
        storage.setItem(STORAGE_KEY.userId, id);

        dispatch(setUserName(name));
        dispatch(setUserProfileImg(Number(profileImage)));
        dispatch(setUserId(Number(id)));

        router.push("/");
        sessionStorage.removeItem(STORAGE_KEY.autoLogin);

        /* 소켓 로그인 */
        // 소켓이 없다면 연결
        if (!socket) {
          connectSocket();
        }

        const onSocketConnectedAndLogin = () => {
          socketLogin();
          socket?.off("connect", onSocketConnectedAndLogin);
        };

        if (socket?.connected) {
          socketLogin();
        } else {
          socket?.on("connect", onSocketConnectedAndLogin);
        }

        const data = await getUnreadUuid();
        if (data.status === 200) {
          // 실시간 안읽은 채팅방 수 가져오기 위함
          dispatch(setUnreadUuid(data.data.data));
          // 새로고침시 채팅방 수 가져오기 위함
          sessionStorage.setItem(
            STORAGE_KEY.unreadChatUuids,
            JSON.stringify(data.data.data)
          );
        }
      } else if (puuid) {
        // 회원가입 페이지로 이동
        router.push(`/join/terms?puuid=${puuid}&state=${state}`);
      } else {
        console.error("유효하지 않은 응답입니다.");
      }
    };
    fetchData();
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

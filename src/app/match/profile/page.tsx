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
import { getProfile } from "@/api/user";
import { setUserProfile } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";
import ChatButton from "@/components/common/ChatButton";
import { sendMatchingQuitEvent, socket } from "@/socket";
import ConfirmModal from "@/components/common/ConfirmModal";
import { theme } from "@/styles/theme";

const ProfilePage = () => {
  const router = useRouter();
  const [profileType, setProfileType] = useState<profileType | undefined>();
  const [isClient, setIsClient] = useState(false);
  const searchParams = useSearchParams();
  const params = searchParams.get("type");
  const rank = searchParams.get("rank");
  const retry = searchParams.get("retry");

  /* 모달창 */
  const [isAlready, setIsAlready] = useState<boolean>(false);

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const matchInfo = useSelector((state: RootState) => state.matchInfo);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        console.log("Fetched profile:", response);
        dispatch(setUserProfile(response));
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, [dispatch]);

  useEffect(() => {
    if (rank === "wind" || params === "other" || params === "me") {
      setProfileType(rank as profileType);
    } else if (rank === "personal" || "free" || "fast") {
      setProfileType("normal");
    } else {
      setProfileType(undefined);
    }
  }, [rank, params]);

  useEffect(() => {
    // 클라이언트 렌더링 확인
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (socket) {
      // 에러 이벤트 감지
      socket.on("error", (errorData) => {
        if (
          errorData.event === "error" &&
          errorData.data ===
            "You are already in the matching room for this game mode."
        ) {
          setIsAlready(true);
        } else if (
          errorData.event === "error" &&
          errorData.data ===
            "Failed POST matching API: 서버 에러, 관리자에게 문의 바랍니다."
        ) {
          sendMatchingQuitEvent();
        }
      });
    }
  }, []);

  const handleMatchStart = async () => {
    const matchingType = params === "gamgoo" ? "BASIC" : "PRECISE";
    const gameModeMap = { personal: "1", free: "2", fast: "3", wind: "4" };
    const gameMode = gameModeMap[rank as keyof typeof gameModeMap] || "1";

    console.log("MatchInfo:", matchInfo);

    const matchingData = {
      matchingType,
      gameMode,
      mike: matchInfo.mike ?? false,
      mainP: (matchInfo.mainP ?? 0).toString(),
      subP: (matchInfo.subP ?? 0).toString(),
      wantP: (matchInfo.wantP ?? 0).toString(),
      gameStyle1: matchInfo.gameStyleResponseDTOList[0] || null,
      gameStyle2: matchInfo.gameStyleResponseDTOList[1] || null,
      gameStyle3: matchInfo.gameStyleResponseDTOList[2] || null,
    };

    if (socket) {
      /* 매칭 요청 보내기 */
      socket.emit("matching-request", matchingData);
      console.log("매칭 요청 이벤트 발생:", matchingData);

      /* 매칭 시작 이벤트 */
      socket.on("matching-started", (data) => {
        console.log("매칭 시작됨:", data);

        const urlParams = new URLSearchParams({
          ...data.data,
          matchingType: params || "", // 기존 type 파라미터 추가
          gameRank: rank || "", // 기존 rank 파라미터 추가
        });

        if (retry) {
          urlParams.append("retry", "true");
        }

        router.push(`/matching/progress?${urlParams.toString()}`);
      });

      /* sender 입장에서 바로 매칭 상대 찾을 경우 처리 */
      socket.on("matching-found-sender", (data) => {
        console.log("/profile에서 matching-found-sender 이벤트 on");
        router.push(
          `/matching/complete?role=sender&opponent=true&type=${params}&rank=${rank}&user=${encodeURIComponent(
            JSON.stringify(data.data)
          )}`
        );
      });
    } else {
      console.error("소켓이 연결되지 않았습니다.");
    }
  };

  if (!isClient) return null; // 클라이언트에서만 렌더링

  return (
    <Wrapper>
      <MatchContent>
        <HeaderTitle title="프로필 설정" />
        <Main>
          {user ? (
            <Profile profileType={profileType ?? "normal"} user={user} />
          ) : (
            <p>Loading...</p>
          )}
          <Button
            buttonType="primary"
            width="380px"
            text="매칭 시작하기"
            onClick={handleMatchStart}
          />
        </Main>
        <Footer>
          <ChatBoxContent>
            <ChatButton />
          </ChatBoxContent>
        </Footer>
      </MatchContent>
      {isAlready && (
        <ConfirmModal
          width="540px"
          onPrimaryClick={() => setIsAlready(false)}
          primaryButtonText="확인"
        >
          <Column>
            이미 매칭 중이에요!
            <Warning>한 번에 하나의 매칭만 할 수 있어요</Warning>
          </Column>
        </ConfirmModal>
      )}
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
  padding-top: 110px;
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
  margin-top: 40px;
  margin-bottom: 37px;
`;

const Footer = styled.footer`
  display: flex;
  margin-bottom: 78px;
`;

const ChatBoxContent = styled.div`
  margin-left: auto;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Warning = styled.div`
  color: ${theme.colors.error100};
  ${(props) => props.theme.fonts.regular16};
`;

"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";

import { getMyProfile } from "@/api";
import { Button, ConfirmModal, HeaderTitle, Profile } from "@/components";
import useMediaQueries from "@/hooks/useMediaQueries";
import { closeChatRoom } from "@/redux/slices/chatSlice";
import { setUserProfile } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";
import { sendMatchingQuitEvent, socket } from "@/socket";
import { theme } from "@/styles/theme";
import { GameMode, profileType } from "@/types";
import { getThresholdByGameMode } from "@/utils/matching/threshold";

const ProfilePage = () => {
  const isMobile = useMediaQueries({ breakpoint: 700 });
  const router = useRouter();
  const [profileType, setProfileType] = useState<profileType | undefined>();
  const [isClient, setIsClient] = useState(false);
  const searchParams = useSearchParams();
  const params = searchParams.get("type");
  const rank = searchParams.get("rank") as GameMode;
  const retry = searchParams.get("retry");

  /* 모달창 */
  const [isAlready, setIsAlready] = useState<boolean>(false);

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const matchInfo = useSelector((state: RootState) => state.matchInfo);

  const [tier, setTier] = useState<string>("UNRANK");
  const [tierCounts, setTierCounts] = useState<Record<string, number>>({});
  const tierCountsRef = useRef(tierCounts);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMyProfile();
        console.log("Fetched profile:", response);
        dispatch(setUserProfile(response.data));
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
    dispatch(closeChatRoom()); // 매칭 성공 후 열려있을 채팅방 무조건 닫기
  }, [dispatch]);

  useEffect(() => {
    console.log("Profile updated:", user);
  }, [user]);

  useEffect(() => {
    if (rank === "ARAM") {
      setProfileType("wind");
    } else if (rank === "FAST" || "SOLO" || "FREE") {
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

  useEffect(
    () => {
      if (!socket) return;

      const handleMatchingCount = (data: any) => {
        setTierCounts({ ...data.data.tierCount, total: data.data.userCount });
      };

      socket.on("matching-count", handleMatchingCount);
      return () => {
        socket?.off("matching-count", handleMatchingCount); // 메모리 누수 방지
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [socket]
  );

  useEffect(() => {
    console.log("프로필 페이지에서 matching-count 수신", tierCounts);
    tierCountsRef.current = tierCounts; // 항상 최신값 저장
  }, [tierCounts]);

  const handleMatchStart = async () => {
    const matchingType = params === "gamegoo" ? "BASIC" : "PRECISE";

    const matchingData = {
      matchingType,
      gameMode: rank,
      threshold: getThresholdByGameMode(rank),
      mike: matchInfo.mike ?? "UNAVAILABLE",
      mainP: (matchInfo.mainP ?? 0).toString(),
      subP: (matchInfo.subP ?? 0).toString(),
      wantP: matchInfo.wantP.map((p) => p ?? "ANY"),
      gameStyleIdList: matchInfo.gameStyleResponseDTOList || null,
    };

    if (socket) {
      /* 매칭 요청 보내기 */
      socket.emit("matching-request", matchingData);
      console.log("매칭 요청 이벤트 발생:", matchingData);

      let matchingStartedData: any = null;

      /* 매칭 시작 이벤트 */
      socket.on("matching-started", (data) => {
        console.log("매칭 시작됨:", data);
        matchingStartedData = data.data;

        const handleMatchingCount = (data: any) => {
          setTierCounts({
            ...data.data.tierCount,
            total: data.data.userCount,
          });

          const baseParams: Record<string, string> = {
            matchingType: params || "",
            gameRank: rank || "",
            tier: tier,
            tierCounts: JSON.stringify(data.data),
            ...matchingStartedData,
          };

          if (retry) {
            baseParams.retry = "true";
          }

          const rawData = data.data ?? {};
          const formattedData: Record<string, string> = {};

          // 각 필드를 순회하면서 문자열로 변환
          for (const key in rawData) {
            const value = rawData[key];
            if (typeof value === "object") {
              formattedData[key] = JSON.stringify(value); // 객체/배열은 JSON 문자열로
            } else {
              formattedData[key] = String(value); // 나머지는 그냥 문자열로
            }
          }

          const combinedParams = {
            ...formattedData,
            ...baseParams,
          };

          const urlParams = new URLSearchParams(combinedParams);

          router.push(`/matching/progress?${urlParams.toString()}`);
        };

        socket?.on("matching-count", handleMatchingCount);
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
        <HeaderTitle title="프로필 등록" />
        <Main>
          {user ? (
            <Profile
              profileType={profileType ? profileType : "normal"}
              user={user}
              backgroundColor={theme.colors.violet100}
            />
          ) : (
            <p>Loading...</p>
          )}
          <Button
            buttonType="primary"
            width={!isMobile ? "380px" : "100%"}
            text="매칭 시작하기"
            onClick={handleMatchStart}
          />
        </Main>
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
  @media (max-width: 700px) {
    padding-top: 0px;
  }
`;

const MatchContent = styled.div`
  max-width: 1440px;
  width: 100%;
  padding: 60px 80px 0px 80px;
  @media (max-width: 700px) {
    padding: 24px 20px;
  }
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
  gap: 14px;
  margin-top: 40px;
  margin-bottom: 65px;
  @media (max-width: 700px) {
    margin-top: 24px;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Warning = styled.div`
  color: ${theme.colors.red600};
  ${(props) => props.theme.fonts.regular16};
`;

"use client";

import styled from "styled-components";
import HeaderTitle from "@/components/common/HeaderTitle";
import SquareProfile from "@/components/match/SquareProfile";
import Button from "@/components/common/Button";
import { theme } from "@/styles/theme";
import { useRouter, useSearchParams } from "next/navigation";
import ChatButton from "@/components/common/ChatButton";
import { useEffect, useRef, useState } from "react";
import { sendMatchingQuitEvent, socket } from "@/socket";
import ConfirmModal from "@/components/common/ConfirmModal";
import { getProfile } from "@/api/user";

interface User {
  memberId: number;
  gameName: string;
  tag: string;
  tier: string;
  rank: number;
  mannerLevel: number;
  profileImg: number;
  gameMode: number;
  mainPosition: number;
  subPosition: number;
  wantPosition: number;
  mike: boolean;
  gameStyleList: string[];
}

const Complete = () => {
  const [timeLeft, setTimeLeft] = useState(10);
  const [showFailModal, setShowFailModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const rank = searchParams.get("rank");
  const [userMe, setUserMe] = useState<User>({
    memberId: 0,
    gameName: "",
    tag: "",
    tier: "",
    rank: 0,
    mannerLevel: 0,
    profileImg: 0,
    gameMode: 0,
    mainPosition: 0,
    subPosition: 0,
    wantPosition: 0,
    mike: false,
    gameStyleList: [],
  });

  const [user, setUser] = useState<User>({
    memberId: 0,
    gameName: "",
    tag: "",
    tier: "",
    rank: 0,
    mannerLevel: 0,
    profileImg: 0,
    gameMode: 0,
    mainPosition: 0,
    subPosition: 0,
    wantPosition: 0,
    mike: false,
    gameStyleList: [],
  });

  useEffect(() => {
    const userString = searchParams.get("user");

    if (userString) {
      try {
        const decodedUser = JSON.parse(decodeURIComponent(userString));
        setUser(decodedUser.data as User);
        console.log("decodedUser", decodedUser);
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchUserMe = async () => {
      try {
        const profileData = await getProfile();

        const transformedUserMe: User = {
          memberId: profileData.id,
          gameName: profileData.gameName,
          tag: profileData.tag,
          tier: profileData.tier,
          rank: profileData.rank,
          mannerLevel: profileData.mannerLevel,
          profileImg: profileData.profileImg,
          gameMode: 0,
          mainPosition: profileData.mainP,
          subPosition: profileData.subP,
          wantPosition: 0,
          mike: profileData.mike,
          gameStyleList: profileData.gameStyleResponseDTOList.map(
            (style: { gameStyleName: string }) => style.gameStyleName
          ),
        };

        setUserMe(transformedUserMe);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserMe();
  }, []);

  const role = searchParams.get("role") || "";
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const secondaryTimerRef = useRef<NodeJS.Timeout | null>(null);
  const finalTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sendMatchingQuitEvent();
    };

    const handlePopState = () => {
      sendMatchingQuitEvent();
      return true;
    };

    // 페이지 이탈 및 새로고침 감지
    window.addEventListener("beforeunload", handleBeforeUnload);

    // 뒤로가기를 감지
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    // 10초 타이머 시작
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 1) {
          clearInterval(timerRef.current!);
          handleTimeout();
        }
        return prevTime > 0 ? prevTime - 1 : 0;
      });
    }, 1000);

    // 소켓 이벤트 설정
    if (role === "sender") {
      socket?.on("matching-success-sender", handleMatchingSuccessSender);
    }

    socket?.on("matching-fail", handleMatchingFail);

    return () => {
      clearInterval(timerRef.current!);
      clearInterval(secondaryTimerRef.current!);
      clearInterval(finalTimerRef.current!);
      if (role === "sender") {
        socket?.off("matching-success-sender", handleMatchingSuccessSender);
      }
      socket?.off("matching-fail", handleMatchingFail);
    };
  }, []);

  // 타임아웃 처리
  const handleTimeout = () => {
    alert("타임 아웃 처리");
    if (role === "receiver") {
      socket?.emit("matching-success-receiver");
      startSecondaryTimer();
    } else if (role === "sender") {
      socket?.emit("matching-success-final");
      startFinalTimer();
    }
  };

  // 매칭 성공 (Sender) 이벤트 핸들러
  const handleMatchingSuccessSender = () => {
    clearInterval(timerRef.current!);
    alert("매칭 성공!");
    // router.push("/chat");
  };

  // 매칭 실패 이벤트 핸들러
  const handleMatchingFail = () => {
    clearAllTimers();
    setShowFailModal(true);
  };

  // 5초 후 매칭 최종 성공 emit (Receiver)
  const startSecondaryTimer = () => {
    secondaryTimerRef.current = setTimeout(() => {
      socket?.emit("matching-success-final");
      startFinalTimer();
    }, 5000);
  };

  // 3초 후 매칭 실패 emit (Final Timer)
  const startFinalTimer = () => {
    finalTimerRef.current = setTimeout(() => {
      socket?.emit("matching-fail");
      setShowFailModal(true);
    }, 3000);
  };

  // 모든 타이머 정리
  const clearAllTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (secondaryTimerRef.current) clearTimeout(secondaryTimerRef.current);
    if (finalTimerRef.current) clearTimeout(finalTimerRef.current);
  };

  // 매칭 나가기 버튼 클릭 핸들러
  const handleReject = () => {
    socket?.emit("matching-reject");
    clearAllTimers();
    console.log("매칭 나가기 클릭");
    router.push(`/match/profile?type=${type}&rank=${rank}`);

    // 소켓 연결 여부 확인
    if (!socket) {
      console.error("소켓이 연결되지 않았습니다.");
      return null;
    }
  };

  return (
    <Wrapper>
      <MatchContent>
        <HeaderTitle title="매칭 완료" sub="듀오 상대를 찾았어요!" />
        <Main>
          <SquareProfile user={userMe} />
          <Oppnent>
            <SquareProfile opponent={true} user={user} />
            <Button
              buttonType="secondary"
              text="매칭 거절하기"
              onClick={handleReject}
            />
            <Text>{timeLeft}초 뒤 자동으로 대화방이 생성됩니다.</Text>
          </Oppnent>
        </Main>
        <Footer>
          <ChatBoxContent>
            <ChatButton />
          </ChatBoxContent>
        </Footer>
      </MatchContent>
      {/* 매칭 실패 시 팝업 */}
      {showFailModal && (
        <ConfirmModal
          width="540px"
          primaryButtonText="닫기"
          onPrimaryClick={() => {
            setShowFailModal(false);
            router.push("/");
          }}
        >
          매칭에 실패했습니다.
        </ConfirmModal>
      )}
    </Wrapper>
  );
};

export default Complete;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 140px;
`;

const MatchContent = styled.div`
  max-width: 1440px;
  width: 100%;
  padding: 0 80px;
`;

const Main = styled.main`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: flex-start;
  width: 100%;
  gap: 72px;
  margin-bottom: 37px;
`;

const Oppnent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 17px;
`;

const Text = styled.div`
  color: ${theme.colors.purple100};
  ${(props) => props.theme.fonts.regular18};
`;

const Footer = styled.footer`
  display: flex;
  margin-bottom: 78px;
`;

const ChatBoxContent = styled.div`
  margin-left: auto;
`;

"use client";

import { Suspense } from "react";
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
import ChatLayout from "@/components/chat/ChatLayout";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { openChatRoom, setChatRoomUuid } from "@/redux/slices/chatSlice";
import { setComplete } from "@/redux/slices/matchingSlice";
import { setIsCompleted } from "@/utils/storage";

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
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const isChatRoomOpen = useSelector(
    (state: RootState) => state.chat.isChatRoomOpen
  );
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

  /* 새로고침 및 타 사이트 이동 방지 */
  // const handleBeforeunload = (e: BeforeUnloadEvent) => {
  //   console.log("새로고침 이벤트 발생");
  //   e.preventDefault();
  //   e.returnValue = "";
  // };

  // const redirectToInitialPage = () => {
  //   // 초기 페이지로 이동
  //   window.location.href = "/match";
  // };

  // useEffect(() => {
  //   window.addEventListener("beforeunload", handleBeforeunload);
  //   redirectToInitialPage();
  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeunload);
  //   };
  // }, []);

  useEffect(() => {
    const userString = searchParams.get("user");

    if (userString) {
      try {
        const decodedUser = JSON.parse(decodeURIComponent(userString));
        setUser(decodedUser as User);
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

    // 언제든 10초 내 matching-fail이 오면 실패 처리
    socket?.on("matching-fail", () => {
      handleMatchingFailWithTimerClear(); // 매칭 실패 처리
    });

    // 소켓 이벤트 설정
    if (role === "sender") {
      socket?.on("matching-success-sender", handleMatchingSuccessSender);
    }

    return () => {
      clearInterval(timerRef.current!);
      if (role === "sender") {
        socket?.off("matching-success-sender", handleMatchingSuccessSender);
      }
    };
  }, []);

  // 타임아웃 처리
  const handleTimeout = () => {
    if (role === "receiver") {
      socket?.emit("matching-success-receiver");
      startSecondaryTimer();
    }
  };

  // 매칭 성공 (Sender) 이벤트 핸들러
  const handleMatchingSuccessSender = () => {
    socket?.emit("matching-success-final");
    clearInterval(timerRef.current!);
    startFinalTimer();
  };

  // 5초 후 매칭 최종 성공 emit (Receiver)
  const startSecondaryTimer = () => {
    secondaryTimerRef.current = setTimeout(() => {
      socket?.emit("matching-fail");
      setShowFailModal(true);
    }, 5000);

    // 5초 이내 matching-success 혹은 matching-fail 수신 시 타이머 종료
    socket?.on("matching-success", (res: any) => {
      // receiver 입장
      if (secondaryTimerRef.current) {
        clearTimeout(secondaryTimerRef.current); // 타이머 종료
        clearAllTimers();
      }
      handleChatUuidgetWithTimerClear(res); // 매칭 성공 처리
    });

    socket?.on("matching-fail", () => {
      if (secondaryTimerRef.current) {
        clearTimeout(secondaryTimerRef.current); // 타이머 종료
        clearAllTimers();
      }
    });
  };

  // 3초 후 매칭 실패 emit (Final Timer)
  const startFinalTimer = () => {
    finalTimerRef.current = setTimeout(() => {
      socket?.emit("matching-fail");
      setShowFailModal(true);
    }, 3000);

    // 3초 이내 matching-success 혹은 matching-fail 수신 시 타이머 종료 및 실행
    socket?.on("matching-success", (res: any) => {
      // sender 입장
      if (finalTimerRef.current) {
        clearTimeout(finalTimerRef.current); // 타이머 종료
        clearAllTimers();
      }
      handleChatUuidgetWithTimerClear(res); // 매칭 성공 처리
    });

    socket?.on("matching-fail", () => {
      if (finalTimerRef.current) {
        clearTimeout(finalTimerRef.current); // 타이머 종료
        clearAllTimers();
      }
    });
  };

  // matching-success 수신 시 타이머 종료 및 채팅방 열기
  const handleChatUuidgetWithTimerClear = (res: any) => {
    clearAllTimers(); // 모든 타이머 정리
    setIsCompleted("true");
    // dispatch(setComplete(true));
    const data = res.data;
    dispatch(setChatRoomUuid(data.chatroomUuid)); // 채팅방 UUID 설정
    dispatch(openChatRoom()); // 채팅방 열기
  };

  // matching-fail 수신 시 타이머 종료 및 실패 모달 표시
  const handleMatchingFailWithTimerClear = () => {
    clearAllTimers(); // 모든 타이머 정리
    setIsCompleted("true");
    // dispatch(setComplete(false));
    setShowFailModal(true); // 매칭 실패 모달 표시
  };

  // 모든 타이머 정리
  const clearAllTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (secondaryTimerRef.current) clearTimeout(secondaryTimerRef.current);
    if (finalTimerRef.current) clearTimeout(finalTimerRef.current);

    socket?.off("matching-success", handleChatUuidgetWithTimerClear);
    socket?.off("matching-fail", handleMatchingFailWithTimerClear);
  };

  // 매칭 나가기 버튼 클릭 핸들러
  const handleReject = () => {
    socket?.emit("matching-reject");
    setIsCompleted("true");
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
    <Suspense>
      {isChatRoomOpen && <ChatLayout apiType={1} />}
      <Wrapper>
        <MatchContent>
          <HeaderTitle
            title="매칭 완료"
            sub="듀오 상대를 찾았어요!"
            isDoubleBack={role === "receiver"}
          />
          <Main>
            <SquareProfile user={userMe} />
            <Oppnent>
              <SquareProfile opponent={true} user={user} />
              {timeLeft > 0 && (
                <>
                  <Button
                    buttonType="secondary"
                    text="매칭 거절하기"
                    onClick={handleReject}
                  />
                  <Text>{timeLeft}초 뒤 자동으로 대화방이 생성됩니다.</Text>
                </>
              )}
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
            primaryButtonText="예"
            secondaryButtonText="아니요"
            onPrimaryClick={() => {
              router.push(
                `/match/profile?type=${type}&rank=${rank}&retry=true`
              );
            }}
            onSecondaryClick={() => {
              setShowFailModal(false);
              setTimeout(() => {
                router.push("/");
              }, 3000);
            }}
          >
            아쉽게도 상대방과 매칭이 성사되지 못했어요.
            <br />
            계속해서 매칭을 시도할까요?
          </ConfirmModal>
        )}
      </Wrapper>
    </Suspense>
  );
};

export default function CompletePaging() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Complete />
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

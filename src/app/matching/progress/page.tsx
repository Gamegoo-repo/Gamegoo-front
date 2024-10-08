"use client";

import { Suspense } from "react";
import styled, { keyframes } from "styled-components";
import HeaderTitle from "@/components/common/HeaderTitle";
import SquareProfile from "@/components/match/SquareProfile";
import Image from "next/image";
import { theme } from "@/styles/theme";
import { useEffect, useRef, useState } from "react";
import ConfirmModal from "@/components/common/ConfirmModal";
import ChatButton from "@/components/common/ChatButton";
import { sendMatchingQuitEvent, socket } from "@/socket";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { messagesWithN, messagesWithoutN } from "@/constants/messages";
import { getSystemMsg } from "@/api/socket";

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

const Progress = () => {
  /* 모달창 */
  const [isFirstRetry, setIsFirstRetry] = useState<boolean>(false);
  const [isSecondYes, setIsSecondYes] = useState<boolean>(false);
  const [isSecondNo, setIsSecondNo] = useState<boolean>(false);

  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [isRetrying, setIsRetrying] = useState<boolean>(false); // 매칭 재시도 여부
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const type = searchParams.get("matchingType");
  const rank = searchParams.get("gameRank");
  const retry = searchParams.get("retry");

  const user: User = {
    memberId: parseInt(searchParams.get("memberId") || "0", 10),
    gameName: searchParams.get("gameName") || "",
    tag: searchParams.get("tag") || "",
    tier: searchParams.get("tier") || "",
    rank: parseInt(searchParams.get("rank") || "1", 10),
    mannerLevel: parseInt(searchParams.get("mannerLevel") || "0", 10),
    profileImg: parseInt(searchParams.get("profileImg") || "0", 10),
    gameMode: parseInt(searchParams.get("gameMode") || "1", 10),
    mainPosition: parseInt(searchParams.get("mainPosition") || "1", 10),
    subPosition: parseInt(searchParams.get("subPosition") || "1", 10),
    wantPosition: parseInt(searchParams.get("wantPosition") || "1", 10),
    mike: searchParams.get("mike") === "true",
    gameStyleList: (searchParams.get("gameStyleList") || "").split(","),
  };

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [textVisible, setTextVisible] = useState<boolean>(true);

  const showMessage = async () => {
    /* 메세지 전환을 위해 0.5초 간 안 보이게 하기 */
    setTextVisible(false);

    setTimeout(async () => {
      const messages = Math.random() < 0.5 ? messagesWithN : messagesWithN;
      const randomMessage =
        messages[Math.floor(Math.random() * messages.length)];
      /* 나와 같은 티어의 매칭 인원이 필요할 때 */
      if (messagesWithN[1] === randomMessage) {
        const response = await getSystemMsg(user.tier);
        setCurrentMessage(
          randomMessage.replace(/n/g, response.result.number.toString())
        );
      } else if (messagesWithN.includes(randomMessage)) {
        /* 시스템 메세지 API로부터 n 호출 */
        const response = await getSystemMsg();
        if (response && response.isSuccess) {
          setCurrentMessage(
            randomMessage.replace(/n/g, response.result.number.toString())
          );
        } else {
          /* 에러 발생 시, messagesWithoutN에서 랜덤으로 메시지 설정 */
          const randomMessage =
            messagesWithoutN[
              Math.floor(Math.random() * messagesWithoutN.length)
            ];
          setCurrentMessage(randomMessage);
        }
      } else {
        setCurrentMessage(randomMessage);
      }

      setTextVisible(true);
    }, 500);
  };

  useEffect(() => {
    showMessage();
    const interval = setInterval(showMessage, 10000); // 10초 간격으로 메시지 변경

    return () => clearInterval(interval);
  }, []);

  // 새로고침 감지 안되는 문제 (수정 필요)
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      alert("새로고침 감지");
      sendMatchingQuitEvent();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (!socket) {
      console.error("Socket is not initialized.");
      return;
    }

    // 기존 리스너 제거
    socket.off("matching-found-sender");
    socket.off("matching-found-receiver");

    // 매칭 상대 찾기 성공 (sender)
    socket.on("matching-found-sender", (data) => {
      console.log("매칭 상대 발견(sender):", data);
      clearTimers();
      router.push(
        `/matching/complete?role=sender&opponent=true&type=${type}&rank=${rank}&user=${encodeURIComponent(
          JSON.stringify(data.data)
        )}`
      );
    });

    // 매칭 상대 찾기 성공 (receiver)
    socket.on("matching-found-receiver", (data) => {
      console.log("매칭 상대 발견(receiver):", data);
      clearTimers();
      socket?.emit("matching-found-success", {
        senderMemberId: data.data.memberId,
        gameMode: data.data.gameMode,
      });
      router.push(
        `/matching/complete?role=receiver&opponent=true&type=${type}&rank=${rank}&user=${encodeURIComponent(
          JSON.stringify(data.data)
        )}`
      );
    });

    // 5분 타이머
    startMatchingProcess();

    // 만약, /progress에서 매칭 성공, 실패 응답이 올 경우 (수정 필요)
    // socket?.on("matching-success", (res: any) => {
    //   // 매칭 성공 처리 (채팅)
    // });

    // socket?.on("matching-fail", () => {
    //   if (secondaryTimerRef.current) clearTimeout(secondaryTimerRef.current); // 타이머 종료
    //   // 매칭 실패 처리 (모달)
    // });

    return () => {
      socket?.off("matching-found-sender");
      socket?.off("matching-found-receiver");
      clearTimers();
    };
  }, []);

  const startMatchingProcess = () => {
    if (timerRef.current) return; // 이미 타이머가 실행 중이면 추가로 설정하지 않음

    // 매칭 재시도 여부에 따라 타이머 설정
    setTimeLeft(300);
    let priority = 51.5; // 초기 priority 값
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 1) {
          // 5분 타이머가 끝나면 매칭 실패 처리
          clearTimers(); // 타이머 정리
          socket?.emit("matching-not-found");
          retry
            ? type === "PRECISE" && setIsSecondYes(true) // 빡겜일 때, 게시판 모달 표시
            : setIsFirstRetry(true); // 매칭 실패 모달 표시
        } else if (prevTime < 300 && prevTime % 30 === 0) {
          // 30초마다 priority 값을 감소시키며 매칭 재시도
          priority -= 1.5;
          socket?.emit("matching-retry", { priority });
          console.log(`매칭 재시도 (priority: ${priority})`);
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const clearTimers = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // 남은 시간을 MM:SS 형식으로 변환
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <Suspense>
      <Wrapper>
        <MatchContent>
          <Header>
            <HeaderTitle title="매칭 중" sub="나와 꼭 맞는 상대를 찾는 중..." />
            <Time>
              <Span>{formatTime(timeLeft)}&nbsp;</Span>/5:00
            </Time>
          </Header>
          <Main>
            <SquareProfile user={user} />
            <Waiting>
              <AnimatedImage
                src="/assets/images/wait_heart.svg"
                width={225}
                height={225}
                alt="heart"
              />
              <AnimatedText $visible={textVisible}>
                {currentMessage}
              </AnimatedText>
            </Waiting>
          </Main>
          {/* 즐겜모드, 빡겜모드 매칭 실패 */}
          {isFirstRetry && (
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
                setIsFirstRetry(false);
                setTimeout(() => {
                  router.push("/");
                }, 3000);
              }}
            >
              계속해서 매칭을 시도하겠습니까?
            </ConfirmModal>
          )}
          {/* 빡겜모드 2번째 매칭 실패 시, 같은 조건으로 글을 올린 사람이 있을 때 */}
          {isSecondYes && (
            <ConfirmModal
              width="540px"
              onPrimaryClick={() => {
                setIsSecondYes(false);
                setTimeout(() => {
                  router.push("/");
                }, 3000);
              }}
              onSecondaryClick={() => {
                router.push("/borad");
                setIsSecondYes(false);
              }}
              primaryButtonText="닫기"
              secondaryButtonText="글 보러하기"
            >
              조건에 맞는 사람이 없습니다.
              <br />
              같은 조건으로 글을 올린 사람이 있어요!
            </ConfirmModal>
          )}
          {/* 빡겜모드 2번째 매칭 실패 시, 같은 조건으로 글을 쓴 사람이 없을 때 */}
          {isSecondNo && (
            <ConfirmModal
              width="540px"
              onPrimaryClick={() => {
                setIsSecondNo(false);
                setTimeout(() => {
                  router.push("/");
                }, 3000);
              }}
              onSecondaryClick={() => {
                router.push("/borad");
                setIsSecondNo(false);
              }}
              primaryButtonText="닫기"
              secondaryButtonText="글 작성하기"
            >
              조건에 맞는 사람이 없습니다.
              <br />
              게시판에 글을 작성할 수 있어요!
            </ConfirmModal>
          )}
        </MatchContent>
        <Footer>
          <ChatBoxContent>
            <ChatButton />
          </ChatBoxContent>
        </Footer>
      </Wrapper>
    </Suspense>
  );
};

export default function ProgressPaging() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Progress />
    </Suspense>
  );
}
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const growShrink = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
`;

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

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
`;

const Time = styled.div`
  color: ${theme.colors.gray700};
  ${(props) => props.theme.fonts.regular28}
  margin-bottom: 32px;
`;

const Span = styled.span`
  color: ${theme.colors.purple100};
  ${(props) => props.theme.fonts.bold45}
`;

const Main = styled.main`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: flex-start;
  width: 100%;
  gap: 72px;
  margin-bottom: 37px;
`;

const Waiting = styled.div`
  width: 100%;
  height: 580px;
  border-radius: 30px;
  background: var(--12, #f7f7f9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 42px;
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.regular25};

  animation: ${fadeIn} 0.5s ease-in forwards;
  transition: opacity 0.5s ease-in-out;
`;

const Footer = styled.footer`
  display: flex;
  margin-bottom: 78px;
`;

const ChatBoxContent = styled.div`
  margin-left: auto;
`;

const AnimatedImage = styled(Image)`
  animation: ${growShrink} 1.8s ease-in-out infinite;
`;

const AnimatedText = styled.div<{ $visible: boolean }>`
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
  animation: ${({ $visible }) => ($visible ? fadeIn : fadeOut)} 1s ease-in-out
    forwards;
`;

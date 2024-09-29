"use client";

import styled, { keyframes } from "styled-components";
import HeaderTitle from "@/components/common/HeaderTitle";
import SquareProfile from "@/components/match/SquareProfile";
import Image from "next/image";
import { theme } from "@/styles/theme";
import { useEffect, useRef, useState } from "react";
import ConfirmModal from "@/components/common/ConfirmModal";
import ChatButton from "@/components/common/ChatButton";
import { sendMatchingQuitEvent, socket } from "@/socket";
import { useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const rank = searchParams.get("rank");
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
    if (socket) {
      // 매칭 성공 핸들러
      const handleReceiverMatch = (data: any) => {
        console.log("매칭 상대 발견(receiver):", data);
        clearTimers();
        socket?.emit("matching-found-success", {
          senderMemberId: user.memberId,
          gameMode: user.gameMode,
        });
        router.push(
          `/matching/complete?role=receiver&opponent=true&user=${encodeURIComponent(
            JSON.stringify(data.data)
          )}&type=${type}&rank=${rank}`
        );
      };

      const handleSenderMatch = (data: any) => {
        console.log("매칭 상대 발견(sender):", data);
        clearTimers();
        router.push(
          `/matching/complete?role=sender&opponent=true&user=${encodeURIComponent(
            JSON.stringify(data)
          )}&type=${type}&rank=${rank}`
        );
      };

      // 소켓 이벤트 등록
      socket.on("matching-found-receiver", handleReceiverMatch);
      socket.on("matching-found-sender", handleSenderMatch);
    }

    // 2분 타이머 시작
    startMatchingProcess();

    // Clean up 함수: 타이머 및 소켓 이벤트 제거
    return () => {
      clearTimers();
      if (socket) {
        socket.off("matching-found-receiver");
        socket.off("matching-found-sender");
      }
    };
  }, [socket, user, router, type, rank]);

  const startMatchingProcess = () => {
    // 매칭 재시도 여부에 따라 타이머 설정
    setTimeLeft(300);
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 1) {
          // 5분 타이머가 끝나면 매칭 실패 처리
          clearTimers(); // 타이머 정리
          socket?.emit("matching-not-found");
          retry ? setIsSecondYes(true) : setIsFirstRetry(true); // 매칭 실패 모달 표시
        } else if (prevTime === 180) {
          // 첫 2분 타이머가 끝나면 매칭 재시도
          if (!isRetrying) {
            socket?.emit("matching-retry", { priority: 50 });
            setIsRetrying(true); // 재시도 상태로 변경
            console.log("매칭 재시도 (2분 후)");
          }
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
            <AnimatedText $visible={textVisible}>{currentMessage}</AnimatedText>
          </Waiting>
        </Main>
        {/* 즐겜모드, 빡겜모드 매칭 실패 */}
        {isFirstRetry && (
          <ConfirmModal
            width="540px"
            primaryButtonText="예"
            secondaryButtonText="아니요"
            onPrimaryClick={() => {
              setIsFirstRetry(true);
              router.push(`/match/profile?type=gamgoo&rank=fast&retry=true`);
            }}
            onSecondaryClick={() => setIsFirstRetry(false)}
          >
            계속해서 매칭을 시도하겠습니까?
          </ConfirmModal>
        )}
        {/* 빡겜모드 2번째 매칭 실패 시, 같은 조건으로 글을 올린 사람이 있을 때 */}
        {isSecondYes && (
          <ConfirmModal
            width="540px"
            onPrimaryClick={() => {
              router.push("/home");
              setIsSecondYes(false);
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
            onPrimaryClick={() => setIsSecondNo(false)}
            onSecondaryClick={() => setIsSecondNo(false)}
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
  );
};

export default Progress;

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
  padding-top: 140px;
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

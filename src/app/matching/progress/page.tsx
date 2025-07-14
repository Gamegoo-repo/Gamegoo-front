"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";

import { getBoardList } from "@/api";
import {
  ConfirmModal,
  HeaderTitle,
  LoadingSpinner,
  SquareProfile,
  WaitingBox,
} from "@/components";
import { GAME_STYLE } from "@/constants";
import { useMediaQueryContext } from "@/hooks";
import { setBoardFilters } from "@/redux/slices/boardSlice";
import { setOpenPostingModal } from "@/redux/slices/modalSlice";
import { socket } from "@/socket";
import { theme } from "@/styles/theme";
import {
  getEffectiveTier,
  getThresholdByGameMode,
  setIsCompleted,
} from "@/utils";

import type { GameMode, Mike, Position } from "@/types";

interface User {
  memberId: number;
  gameName: string;
  tag: string;
  soloTier: string;
  freeTier: string;
  soloRank: number;
  freeRank: number;
  mannerLevel: number;
  profileImg: number;
  gameMode: GameMode;
  mainP: Position;
  subP: Position;
  wantP: Position[];
  mike: Mike;
  gameStyleList: string[];
}

const messagesWithTierN = Object.freeze([
  "나와 같은 티어의 n명이 매칭 중이에요!",
]);

const messagesWithTotalN = Object.freeze([
  "지금 n명이 매칭을 기다리고 있어요!",
  "n명의 플레이어가 매칭을 기다리고 있어요!",
  "n명의 플레이어가 매칭 중입니다!",
]);

const messagesWithoutN = Object.freeze([
  "어떤 플레이어와 매칭될지 기대해보세요!",
  "매칭이 완료 되면 10초 후에 새로운 채팅방이 열려요!",
  "누가 팀원이 될지 설레지 않나요?",
  "매칭 지연 중? 게시판에서 친구를 찾아보세요!",
  "어떤 플레이어와 팀을 이룰지 기대하세요!",
  "매칭이 늦어지면 게시판을 활용해보세요!",
]);

const Progress = () => {
  /* 모달창 */
  const [isFirstRetry, setIsFirstRetry] = useState<boolean>(false);
  const [isSecondYes, setIsSecondYes] = useState<boolean>(false);
  const [isSecondNo, setIsSecondNo] = useState<boolean>(false);

  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [isRetrying, setIsRetrying] = useState<boolean>(false); // 매칭 재시도 여부
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { isMobile } = useMediaQueryContext();
  const type = searchParams.get("matchingType");
  const rank = searchParams.get("gameRank") as GameMode;
  const retry = searchParams.get("retry");

  const gameStyleRaw = searchParams.get("gameStyleIdList");
  const user: User = {
    memberId: parseInt(searchParams.get("memberId") || "0", 10),
    gameName: searchParams.get("gameName") || "",
    tag: searchParams.get("tag") || "",
    soloTier: searchParams.get("soloTier") || "",
    freeTier: searchParams.get("freeTier") || "",
    soloRank: parseInt(searchParams.get("soloRank") || "1", 10),
    freeRank: parseInt(searchParams.get("freeRank") || "1", 10),
    mannerLevel: parseInt(searchParams.get("mannerLevel") || "0", 10),
    profileImg: parseInt(searchParams.get("profileImg") || "0", 10),
    gameMode: (searchParams.get("gameMode") as GameMode) || "",
    mainP: (searchParams.get("mainP") as Position) || "ANY",
    subP: (searchParams.get("subP") as Position) || "ANY",
    wantP: searchParams.get("wantP")
      ? (searchParams.get("wantP")!.split(",") as Position[])
      : ["ANY"],
    mike: (searchParams.get("mike") as Mike) || "AVAILABLE",
    gameStyleList: gameStyleRaw
      ? (JSON.parse(gameStyleRaw) as number[]).map((id) => {
          const found = GAME_STYLE.find((style) => style.gameStyleId === id);
          return found ? found.gameStyleName : "";
        })
      : [],
  };

  // 파라미터에서 tierCounts 가져오기
  const tierCountsRaw = searchParams.get("tierCounts");

  // 안전하게 파싱 tierCount + userCount
  const parsedTierCounts = (() => {
    try {
      if (!tierCountsRaw) return {};
      const parsed = JSON.parse(tierCountsRaw);
      if (parsed && parsed.tierCount && parsed.userCount !== undefined) {
        return {
          ...parsed.tierCount,
          total: parsed.userCount,
        };
      }
      return {};
    } catch (e) {
      console.error("tierCounts 파싱 실패:", e);
      return {};
    }
  })();

  // 초기값으로 바로 사용
  const [tierCounts, setTierCounts] =
    useState<Record<string, number>>(parsedTierCounts); // 티어별 인원 수

  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [textVisible, setTextVisible] = useState<boolean>(true);

  const tierCountsRef = useRef(tierCountsRaw);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const thresholdRef = useRef(51.5);

  // const [showReloadModal, setShowReloadModal] = useState(false); // 새로고침 모달 상태

  useEffect(
    () => {
      if (!socket) return;

      const handleMatchingCount = (data: any) => {
        setTierCounts({ ...data.data.tierCount, total: data.data.userCount });
      };

      socket.on("matching-count", handleMatchingCount);
      return () => {
        socket?.off("matching-count", handleMatchingCount);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [socket]
  );

  const showMessage = () => {
    setTextVisible(false);

    setTimeout(() => {
      const totalMessages = [
        ...messagesWithTierN,
        ...messagesWithTotalN,
        ...messagesWithoutN,
      ];
      const randomMessage =
        totalMessages[Math.floor(Math.random() * totalMessages.length)];

      const tierKey =
        getEffectiveTier(
          { soloTier: user.soloTier, freeTier: user.freeTier },
          user.gameMode
        )?.toUpperCase() || "UNRANKED";

      const tierUserCount = tierCounts[tierKey] ?? 0;
      const totalUserCount = tierCounts["total"] ?? 0;

      console.log("tierCounts", tierCounts);
      console.log("tierUserCount", tierUserCount);
      console.log("totalUserCount", totalUserCount);

      if (messagesWithTierN.includes(randomMessage)) {
        setCurrentMessage(
          randomMessage.replace(/n/g, tierUserCount.toString())
        );
      } else if (messagesWithTotalN.includes(randomMessage)) {
        setCurrentMessage(
          randomMessage.replace(/n/g, totalUserCount.toString())
        );
      } else {
        setCurrentMessage(randomMessage);
      }

      setTextVisible(true);
    }, 500);
  };

  useEffect(
    () => {
      showMessage();
      const interval = setInterval(showMessage, 5000); // 5초 간격으로 랜덤 메세지 변경
      return () => clearInterval(interval);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /* 새로고침 및 타 사이트 이동 방지 */
  // const handleBeforeunload = (e: BeforeUnloadEvent) => {
  //   // setShowReloadModal(true);
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

  // // 모달에서 "매칭 종료" 클릭 시 처리
  // const handleReloadConfirm = () => {
  //   setShowReloadModal(false);
  //   // 실제로 새로고침을 수행하도록 강제
  //   // router.push("/match");
  // };

  // // 모달에서 "머무르기" 클릭 시 처리
  // const handleStay = () => {
  //   setShowReloadModal(false);
  // };

  useEffect(
    () => {
      if (!socket) {
        console.error("Socket is not initialized.");
        return;
      }

      // 기존 리스너 제거
      socket.off("matching-found-sender");
      socket.off("matching-found-receiver");

      // 매칭 상대 찾기 성공 (sender)
      socket.on("matching-found-sender", (data) => {
        console.log("매칭 상대 발견(sender):", data); // targetMatchingInfo
        clearTimers();
        router.push(
          `/matching/complete?role=sender&opponent=true&type=${type}&rank=${rank}&user=${encodeURIComponent(
            JSON.stringify(data.data)
          )}`
        );
      });

      // 매칭 상대 찾기 성공 (receiver)
      socket.on("matching-found-receiver", (data) => {
        console.log("매칭 상대 발견(receiver):", data); // senderMatchingInfo, receiverMatchingUuid
        clearTimers();
        socket?.emit("matching-found-success", {
          // senderMatchingUuid: data.data.receiverMatchingUuid,
          senderMatchingUuid: data.data.senderMatchingInfo.matchingUuid,
        });
        router.push(
          `/matching/complete?role=receiver&opponent=true&type=${type}&rank=${rank}&user=${encodeURIComponent(
            JSON.stringify(data.data.senderMatchingInfo)
          )}&uuid=${encodeURIComponent(data.data.senderMatchingInfo.matchingUuid)}
        )}`
        );
      });

      // 5분 타이머
      startMatchingProcess();

      return () => {
        socket?.off("matching-found-sender");
        socket?.off("matching-found-receiver");
        clearTimers();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const startMatchingProcess = async () => {
    if (timerRef.current) return; // 이미 타이머가 실행 중이면 추가로 설정하지 않음

    // 매칭 재시도 여부에 따라 타이머 설정
    thresholdRef.current = getThresholdByGameMode(rank) + 1.5; // 초기 threshold 값

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 1) {
          // 5분 타이머가 끝나면 매칭 실패 처리
          clearTimers(); // 타이머 정리
          socket?.emit("matching-not-found");
          handleRetry(); // 매칭 실패 모달 결정 함수
        } else if (prevTime < 300 && prevTime % 30 === 0) {
          // 30초마다 threshold 값을 감소시키며 매칭 재시도
          thresholdRef.current -= 1.5;
          socket?.emit("matching-retry", { threshold: thresholdRef.current });
          console.log(`매칭 재시도 (priority: ${thresholdRef.current})`);
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  // 매칭 실패 모달 결정
  const handleRetry = async () => {
    setIsCompleted("true");
    if (type === "gamegoo" || !retry) {
      setIsFirstRetry(true);
    } else {
      if (type === "custom") {
        const gameRank = searchParams.get("gameRank");

        const params = {
          page: 1,
          pageIdx: 1,
          gameMode: gameRank as GameMode,
          tier: getEffectiveTier(
            { soloTier: user.soloTier, freeTier: user.freeTier },
            user.gameMode
          ),
          mainP: user.mainP,
          mike: user.mike,
        };
        try {
          const response = await getBoardList(params);
          if (response.data.totalCount > 0) {
            dispatch(setBoardFilters(params));
            setIsSecondYes(true);
          } else {
            setIsSecondNo(true);
          }
        } catch (error) {
          console.error("해당 조건의 게시글 목록이 없습니다.", error);
          setIsSecondNo(true);
        }
      }
    }
  };

  const clearTimers = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <Suspense>
      {/* 새로고침 모달 */}
      {/* {showReloadModal && (
        <ConfirmModal
          width="540px"
          primaryButtonText="머무르기"
          secondaryButtonText="매칭 종료"
          onPrimaryClick={handleReloadConfirm}
          onSecondaryClick={handleStay}
        >
          매칭이 완료되지 않았습니다. 나가시겠습니까?
          <br />
          새로고침 시에는 매칭이 자동 종료되며, 매칭 초기 페이지로 이동합니다.
        </ConfirmModal>
      )} */}
      <Wrapper>
        <MatchContent>
          <Header>
            <HeaderTitle
              title="매칭 중"
              sub="나와 꼭 맞는 상대를 찾는 중..."
              isMatchProgressOrComplete={true}
            />
          </Header>
          <Main>
            <SquareProfile user={user} isToggleUI={true} />
            <WaitingBox
              isMobile={isMobile}
              textVisible={textVisible}
              currentMessage={currentMessage}
              timeLeft={timeLeft}
            />
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
                router.push("/board");
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
                router.push("/board");
                setIsSecondNo(false);
                dispatch(setOpenPostingModal());
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
      </Wrapper>
    </Suspense>
  );
};

export default function ProgressPaging() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Progress />
    </Suspense>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 110px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding-top: 0px;
  }
`;

const MatchContent = styled.div`
  max-width: 1440px;
  width: 100%;
  padding: 0 80px;
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 24px 20px;
  }
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
`;

const Main = styled.main`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: flex-start;
  width: 100%;
  gap: 72px;
  margin-bottom: 37px;
  @media (max-width: ${theme.breakpoints.mobile}) {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`;

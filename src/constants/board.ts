import { GameMode } from "@/types/game/gameMode";
import { Mike } from "@/types/user/mike";

export const BOARD_TITLE = [
  { id: 1, name: "소환사" },
  { id: 2, name: "매너 레벨" },
  { id: 3, name: "티어" },
  { id: 4, name: "주/부 포지션" },
  { id: 5, name: "내가 찾는 포지션" },
  { id: 6, name: "최근 선호 챔피언" },
  { id: 7, name: "승률" },
  { id: 8, name: "한마디" },
  { id: 9, name: "등록일시" },
];

export const GAME_MODE = [
  { id: 0, key: null, value: "모든 모드" },
  { id: 1, key: "FAST" as GameMode, value: "빠른대전" },
  { id: 2, key: "SOLO" as GameMode, value: "솔로랭크" },
  { id: 3, key: "FREE" as GameMode, value: "자유랭크" },
  { id: 4, key: "ARAM" as GameMode, value: "칼바람 나락" },
];

export const TIER = [
  { id: 0, key: null, value: "티어 전체" },
  { id: 1, key: "IRON", value: "아이언" },
  { id: 2, key: "BRONZE", value: "브론즈" },
  { id: 3, key: "SILVER", value: "실버" },
  { id: 4, key: "GOLD", value: "골드" },
  { id: 5, key: "PLATINUM", value: "플래티넘" },
  { id: 6, key: "EMERALD", value: "에메랄드" },
  { id: 7, key: "DIAMOND", value: "다이아몬드" },
  { id: 8, key: "MASTER", value: "마스터" },
  { id: 9, key: "GRANDMASTER", value: "그랜드마스터" },
  { id: 10, key: "CHALLENGER", value: "챌린저" },
];

export const MIC = [
  { id: 0, key: null, value: "음성 채팅" },
  { id: 1, key: "AVAILABLE" as Mike, value: "음성 ON" },
  { id: 2, key: "UNAVAILABLE" as Mike, value: "음성 OFF" },
];

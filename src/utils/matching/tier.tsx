import { TIER } from "@/constants/board";

import type { GameMode } from "@/types/game/gameMode";

// 티어 문자열 -> id 매핑
const getTierId = (tierKey: string | null | undefined): number => {
  const tier = TIER.find((t) => t.key === tierKey?.toUpperCase());
  return tier ? tier.id : 0; // 없으면 UNRANK 취급
};

// id -> 티어 문자열 반환
const getTierKeyFromId = (id: number): string => {
  const tier = TIER.find((t) => t.id === id);
  return tier?.key ?? "UNRANKED";
};

export const getEffectiveTier = (
  user: { soloTier: string | null; freeTier: string | null },
  gameMode: GameMode
): string => {
  const soloId = getTierId(user.soloTier);
  const freeId = getTierId(user.freeTier);

  if (gameMode === "SOLO" || gameMode === "ARAM") {
    return getTierKeyFromId(soloId);
  }

  if (gameMode === "FREE") {
    return getTierKeyFromId(freeId);
  }

  if (gameMode === "FAST") {
    if (soloId && freeId) {
      const avg = Math.ceil((soloId + freeId) / 2);
      return getTierKeyFromId(avg);
    } else if (soloId) {
      return getTierKeyFromId(soloId);
    } else if (freeId) {
      return getTierKeyFromId(freeId);
    } else {
      return "UNRANKED";
    }
  }

  return "UNRANKED";
};

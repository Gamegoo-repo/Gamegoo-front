import { GAME_MODE_THRESHOLD } from "@/constants/match";
import { GameMode } from "@/types/game/gameMode";

export function getThresholdByGameMode(mode: GameMode): number {
  return GAME_MODE_THRESHOLD[mode];
}

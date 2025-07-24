import type { GameMode } from "../game";
import type { Position } from "../position";
import type { Mike } from "./mike";

export interface MatchingUser {
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
import type { Position } from "@/types/position/position";
import type { ApiResponse } from "../../api";

interface PutPositionRequest {
  mainP: Position;
  subP: Position;
  wantP: (Position | null)[];
}

export interface PutProfileData {
  message: string;
}

export type PutProfileResponse = ApiResponse<PutProfileData>;

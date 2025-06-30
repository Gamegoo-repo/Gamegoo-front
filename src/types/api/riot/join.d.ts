import { ApiResponse } from "../api";

export interface RiotJoinRequest {
  puuid: string;
  isAgree: boolean;
}

export interface RiotJoinData {
  message: string;
}

export type RiotJoinResponse = ApiResponse<RiotJoinData>;

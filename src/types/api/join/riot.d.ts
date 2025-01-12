import { ApiResponse } from "../api";

export interface RiotRequest {
  gameName: string;
  tag: string;
}

export interface RiotData {
  message: string;
}

export type RiotResponse = ApiResponse<RiotData>;
import { ApiResponse } from "../api";

export interface JoinRequest {
  isAgree: boolean;
  email: string;
  password: string;
  gameName: string;
  tag: string;
}

export interface JoinData {
  message: string;
}

export type JoinResponse = ApiResponse<JoinData>;
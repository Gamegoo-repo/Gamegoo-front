import { ApiResponse } from "../../api";

interface PutPositionRequest {
  mainP: number;
  subP: number;
  wantP: number;
}

export interface PutProfileData {
  message: string;
}

export type PutProfileResponse = ApiResponse<PutProfileData>;
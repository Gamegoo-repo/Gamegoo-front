import type { ApiResponse } from "../api";

export interface ReissueData {
  id: number;
  accessToken: string;
  refreshToken: string;
}

export type ReissueResponse = ApiResponse<ReissueData>;

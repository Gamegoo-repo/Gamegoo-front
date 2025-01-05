import { ApiResponse } from "../api";

export interface ReissueData {
  id: 0;
  accessToken: "string";
  refreshToken: "string";
}

export type ReissueResponse = ApiResponse<ReissueData>;
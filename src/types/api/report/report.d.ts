import { ApiResponse } from "../api";

export interface ReportRequest {
  memberId: number;
  reportCodeList: number[];
  contents: string;
  pathCode: number; // BOARD: 1, CHAT: 2, PROFILE: 3
  boardId?: number;
}

export interface ReportData {
  reportId: number;
  message: string;
}

export type ReportResponse = ApiResponse<ReportData>;
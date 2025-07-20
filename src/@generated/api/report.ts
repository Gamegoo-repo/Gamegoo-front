import { Axios } from "@/api";

import type {
  ApiResponse,
  ReportInsertResponse,
  ReportPageResponse,
  ReportProcessRequest,
  ReportProcessResponse,
  ReportRequest,
} from "../types";

/* putReportReportIdProcess - 수정 */
export const putReportReportIdProcess = async (
  reportId: number | string,
  data: ReportProcessRequest
): Promise<ApiResponse<ReportProcessResponse>> => {
  const endpoint = `/api/v2/report/${reportId}/process`;
  try {
    const response = await Axios.put(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("putReportReportIdProcess failed:", error);
    throw error;
  }
};

/* postReportMemberId - 생성 */
export const postReportMemberId = async (
  memberId: number | string,
  data: ReportRequest
): Promise<ApiResponse<ReportInsertResponse>> => {
  const endpoint = `/api/v2/report/${memberId}`;
  try {
    const response = await Axios.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("postReportMemberId failed:", error);
    throw error;
  }
};

/* getReportList - 조회 */
export const getReportList = async (
  reportedMemberKeyword?: string,
  reporterKeyword?: string,
  contentKeyword?: string,
  reportPaths?: string[],
  reportTypes?: number[],
  startDate?: string,
  endDate?: string,
  reportCountMin?: number,
  reportCountMax?: number,
  reportCountExact?: number,
  isDeleted?: boolean,
  banTypes?: string[],
  pageable: any
): Promise<ApiResponse<ReportPageResponse>> => {
  const endpoint = "/api/v2/report/list";
  try {
    const response = await Axios.get(endpoint, {
      params: {
        reportedMemberKeyword,
        reporterKeyword,
        contentKeyword,
        reportPaths,
        reportTypes,
        startDate,
        endDate,
        reportCountMin,
        reportCountMax,
        reportCountExact,
        isDeleted,
        banTypes,
      },
    });
    return response.data;
  } catch (error) {
    console.error("getReportList failed:", error);
    throw error;
  }
};

/* deleteReportReportIdPost - 삭제 */
export const deleteReportReportIdPost = async (
  reportId: number | string
): Promise<ApiResponse<string>> => {
  const endpoint = `/api/v2/report/${reportId}/post`;
  try {
    const response = await Axios.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error("deleteReportReportIdPost failed:", error);
    throw error;
  }
};

import Axios from "@/api/api";

import type {
  ApiResponse,
  ReportInsertResponse,
  ReportListResponse,
  ReportRequest,
} from "../types";

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
export const getReportList = async (): Promise<
  ApiResponse<ReportListResponse[]>
> => {
  const endpoint = "/api/v2/report/list";
  try {
    const response = await Axios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("getReportList failed:", error);
    throw error;
  }
};

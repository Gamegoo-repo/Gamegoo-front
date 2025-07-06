import { ReportRequest, ReportResponse } from "@/types/api/report/report";

import { AuthAxios } from "../auth";

/* 신고하기 */
export const reportMember = async ({
  memberId,
  reportCodeList,
  contents,
  pathCode,
  boardId,
}: ReportRequest): Promise<ReportResponse> => {
  const endpoint = `/api/v2/report/${memberId}`;
  try {
    const response = await AuthAxios.post(endpoint, {
      reportCodeList,
      contents,
      pathCode,
      boardId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

import { AuthAxios } from "./auth";

interface ReportInterface {
    targetMemberId: number;
    reportTypeIdList: number[];
    contents: string;
}

/* 신고하기 */
export const reportMember = async (params: ReportInterface) => {
    try {
        const response = await AuthAxios.post("/v1/reports", params);
        return response.data;
    } catch (error) {
        throw error;
    }
};

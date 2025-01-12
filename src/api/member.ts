import { AuthAxios } from "./auth";

interface ReportInterface {
    targetMemberId: number;
    reportTypeIdList: number[];
    contents: string;
}

/* 차단하기 */
export const blockMember = async (memberId: number) => {
    try {
        const response = await AuthAxios.post(`/v1/member/block/${memberId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/* 차단 해제 */
export const unblockMember = async (memberId: number) => {
    try {
        const response = await AuthAxios.delete(`/v1/member/block/${memberId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/* 차단 목록 삭제 (탈퇴 회원의 경우) */
export const deleteBlockMember = async (memberId: number) => {
    try {
        const response = await AuthAxios.delete(`/v1/member/block/delete/${memberId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/* 신고하기 */
export const reportMember = async (params: ReportInterface) => {
    try {
        const response = await AuthAxios.post("/v1/reports", params);
        return response.data;
    } catch (error) {
        throw error;
    }
};

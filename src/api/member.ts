import Axios from ".";

interface ReportInterface {
    targetMemberId: number;
    reportTypeIdList: number[];
    contents: string;
}

let token = JSON.stringify(localStorage.getItem('refreshToken'));

const headers = {
    Authorization: `Bearer ${token}`
};

export const getUserInfo = async () => {
    try {
        const response = await Axios.get("/v1/member/profile", { headers });
        console.log("유저 데이터 성공:", response.data);
        return response.data;
    } catch (error) {
        console.error("유저 데이터 불러오기 실패:", error);
        throw error;
    }
};

export const blockMember = async (memberId: number) => {
    try {
        const response = await Axios.post(`/v1/member/block/${memberId}`);
        console.log("차단 성공:", response.data);
        return response.data;
    } catch (error) {
        console.error("차단 실패:", error);
        throw error;
    }
};

export const unblockMember = async (memberId: number) => {
    try {
        const response = await Axios.delete(`/v1/member/block/${memberId}`);
        console.log("차단 해제 성공:", response.data);
        return response.data;
    } catch (error) {
        console.error("차단 해제 실패:", error);
        throw error;
    }
};

export const reportMember = async (params: ReportInterface) => {
    try {
        const response = await Axios.post("/v1/reports", params);
        console.log("신고 성공:", response.data);
        return response.data;
    } catch (error) {
        console.error("신고 실패:", error);
        throw error;
    }
};

// export const getBlockedMemberList = async (page: number) => {
//     try {
//         const response = await Axios.get("/v1/member/block", { page });
//         console.log("차단 리스트 가져오기 성공:", response.data);
//         return response.data;
//     } catch (error) {
//         console.error("차단 리스트 가져오기 실패:", error);
//         throw error;
//     }
// };
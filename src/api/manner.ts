import { AuthAxios } from "./auth";

/* 매너평가 조회 */
export const getMannerValues = async (memberId: number) => {
    try {
        const response = await AuthAxios.get(`/v1/manner/good/${memberId}`);
        console.log("매너 평가 조회 완료:", response.data);
        return response.data;
    } catch (error) {
        console.error("매너 평가 조회 실패:", error);
        throw error;
    }
};

/* 비매너평가 조회 */
export const getBadMannerValues = async (memberId: number) => {
    try {
        const response = await AuthAxios.get(`/v1/manner/bad/${memberId}`);
        console.log("비매너 평가 조회 완료:", response.data);
        return response.data;
    } catch (error) {
        console.error("비매너 평가 조회 실패:", error);
        throw error;
    }
};

/* 다른 유저 매너평가 조회 */
export const getOtherManner = async (memberId: number) => {
    try {
        const response = await AuthAxios.get(`/v1/manner/${memberId}`);
        console.log("다른 유저 매너 평가 조회 완료:", response.data);
        return response.data;
    } catch (error) {
        console.error("다른 유저 평가 조회 실패:", error);
        throw error;
    }
};

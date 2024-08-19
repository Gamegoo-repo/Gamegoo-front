import Axios from ".";

interface MannerInterface {
    toMemberId: number;
    mannerRatingKeywordList: number[];
}

/* 매너평가 조회 (매너 평가 수정 시 확인용) */
export const getMannerValues = async (memberId: number) => {
    try {
        const response = await Axios.get(`/v1/manner/good/${memberId}`);
        console.log("매너 평가 조회 완료:", response.data);
        return response.data;
    } catch (error) {
        console.error("매너 평가 조회 실패:", error);
        throw error;
    }
};

/* 비매너평가 조회 (비매너 평가 수정 시 확인용) */
export const getBadMannerValues = async (memberId: number) => {
    try {
        const response = await Axios.get(`/v1/manner/bad/${memberId}`);
        console.log("비매너 평가 조회 완료:", response.data);
        return response.data;
    } catch (error) {
        console.error("비매너 평가 조회 실패:", error);
        throw error;
    }
};

/* 다른 사람 매너/비매너 평가 조회 */
export const getOthersManner = async (memberId: number) => {
    try {
        const response = await Axios.get(`/v1/manner/${memberId}`);
        console.log("평가 조회 완료:", response.data);
        return response.data;
    } catch (error) {
        console.error("평가 조회 실패:", error);
        throw error;
    }
};

/* 매너 평가 등록 */
export const postMannerValue = async (params: MannerInterface) => {
    try {
        const response = await Axios.post(`/v1/manner/good`, params);
        console.log("매너 평가 등록 성공:", response.data);
        return response.data;
    } catch (error) {
        console.error("매너 평가 등록 실패:", error);
        throw error;
    }
};

/* 비매너 평가 등록 */
export const postBadMannerValue = async (params: MannerInterface) => {
    try {
        const response = await Axios.post(`/v1/manner/good`, params);
        console.log("비매너 평가 등록 성공:", response.data);
        return response.data;
    } catch (error) {
        console.error("비매너 평가 등록 실패:", error);
        throw error;
    }
};
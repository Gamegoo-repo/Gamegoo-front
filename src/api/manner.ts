import Axios from ".";
import { AuthAxios } from "./auth";

interface MannerInterface {
    toMemberId: number;
    mannerRatingKeywordList: number[];
}

interface MannerReqInterface {
    mannerRatingKeywordList: number[];
}

/* 매너평가 조회 (매너평가 수정 시) */
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

/* 비매너평가 조회 */
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

/* 다른 사람 매너, 비매너 평가 조회 */
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
        await localStorage.setItem('mannerId', response.data.result.mannerId);
        return response.data;
    } catch (error) {
        console.error("매너 평가 등록 실패:", error);
        throw error;
    }
};

/* 비매너 평가 등록 */
export const postBadMannerValue = async (params: MannerInterface) => {
    try {
        const response = await Axios.post(`/v1/manner/bad`, params);
        console.log("비매너 평가 등록 성공:", response.data);
        await localStorage.setItem('badMannerId', response.data.result.mannerId);
        return response.data;
    } catch (error) {
        console.error("비매너 평가 등록 실패:", error);
        throw error;
    }
};

/* 매너, 비매너 평가 수정 */
export const editManners = async (mannerId: number, params: MannerReqInterface) => {
    try {
        const response = await Axios.put(`/v1/manner/${mannerId}`, params);
        console.log('수정')
        return response.data;
    } catch (error) {
        throw error;
    }
}
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

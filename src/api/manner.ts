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
        const response = await AuthAxios.get(`/v1/manner/good/${memberId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/* 비매너평가 조회 */
export const getBadMannerValues = async (memberId: number) => {
    try {
        const response = await AuthAxios.get(`/v1/manner/bad/${memberId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/* 다른 사람 매너, 비매너 평가 조회 */
export const getOthersManner = async (memberId: number) => {
    try {
        const response = await AuthAxios.get(`/v1/manner/${memberId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/* 매너 평가 등록 */
export const postMannerValue = async (params: MannerInterface) => {
    try {
        const response = await AuthAxios.post(`/v1/manner/good`, params);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/* 비매너 평가 등록 */
export const postBadMannerValue = async (params: MannerInterface) => {
    try {
        const response = await AuthAxios.post(`/v1/manner/bad`, params);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/* 매너, 비매너 평가 수정 */
export const editManners = async (mannerId: number, params: MannerReqInterface) => {
    try {
        const response = await AuthAxios.put(`/v1/manner/${mannerId}`, params);
        return response.data;
    } catch (error) {
        throw error;
    }
}
/* 다른 유저 매너평가 조회 */
export const getOtherManner = async (memberId: number) => {
    try {
        const response = await AuthAxios.get(`/v1/manner/${memberId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

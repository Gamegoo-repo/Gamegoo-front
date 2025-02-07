import {
  MannerResponse,
  MemberMannerKeywordsResponse,
  MemberMannerLevelResponse,
  MemberPositiveNegativeMannerResponse,
} from "@/types/api/manner/manner";
import { AuthAxios } from "./auth";

interface MannerInterface {
  memberId: number;
  mannerKeywordIdList: number[];
}

interface MannerReqInterface {
  mannerId: number;
  mannerKeywordIdList: number[];
}

/* 특정 회원에 대한 나의 매너 평가 조회 */
export const getMannerValues = async (
  memberId: number
): Promise<MannerResponse> => {
  try {
    const response = await AuthAxios.get(`/api/v2/manner/positive/${memberId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* 특정 회원에 대한 나의 비매너 평가 조회 */
export const getBadMannerValues = async (
  memberId: number
): Promise<MannerResponse> => {
  try {
    const response = await AuthAxios.get(`/api/v2/manner/negative/${memberId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* 매너 레벨 정보 조회 */
export const getMemberMannerLevel = async (
  memberId: number
): Promise<MemberMannerLevelResponse> => {
  try {
    const response = await AuthAxios.get(`/api/v2/manner/level/${memberId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* 매너 키워드 개수 조회 */
export const getMemberMannerKeyword = async (
  memberId: number
): Promise<MemberMannerKeywordsResponse> => {
  try {
    const response = await AuthAxios.get(`/api/v2/manner/keyword/${memberId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* 매너 평가 등록 */
export const postMannerValue = async (
  params: MannerInterface
): Promise<MemberPositiveNegativeMannerResponse> => {
  try {
    const response = await AuthAxios.post(
      `/api/v2/manner/positive/${params.memberId}`,
      params.mannerKeywordIdList
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* 비매너 평가 등록 */
export const postBadMannerValue = async (
  params: MannerInterface
): Promise<MemberPositiveNegativeMannerResponse> => {
  try {
    const response = await AuthAxios.post(
      `/api/v2/manner/negative/${params.memberId}`,
      params.mannerKeywordIdList
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* 매너/비매너 평가 수정 */
export const editManners = async ({
  mannerId,
  mannerKeywordIdList,
}: MannerReqInterface): Promise<MemberPositiveNegativeMannerResponse> => {
  try {
    const response = await AuthAxios.put(
      `/api/v2/manner/${mannerId}`,
      mannerKeywordIdList
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
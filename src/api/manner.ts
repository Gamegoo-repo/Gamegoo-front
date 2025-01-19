import {
  MannerResponse,
  MemberPositiveNegativeMannerResponse,
  OtherKeywordsMannerResponse,
  UserMannerResponse,
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

/**
 * 특정 회원의 긍정적인 매너 평가 내역을 조회합니다.
 * 매너 평가 수정을 위한 평가 ID와 관련 키워드 ID 목록을 반환합니다.
 * @param memberId - 매너 평가를 조회할 회원의 ID
 * @returns 매너 평가 ID와 매너 키워드 ID 목록을 포함한 Promise 객체
 */
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

/**
 * 특정 회원의 부정적인 매너 평가 내역을 조회합니다.
 * 매너 평가 수정을 위한 평가 ID와 관련 키워드 ID 목록을 반환합니다.
 * @param memberId - 매너 평가를 조회할 회원의 ID
 * @returns 매너 평가 ID와 매너 키워드 ID 목록을 포함한 Promise 객체
 */
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

/**
 * 특정 회원의 전체적인 매너 평가 통계를 조회합니다.
 * 매너 레벨, 순위, 전체 평가 횟수 정보를 반환합니다.
 * @param memberId - 매너 통계를 조회할 회원의 ID
 * @returns 매너 레벨, 순위, 평가 횟수를 포함한 Promise 객체
 */
export const getOthersManner = async (
  memberId: number
): Promise<UserMannerResponse> => {
  try {
    const response = await AuthAxios.get(`/api/v2/manner/level/${memberId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 특정 회원에 대한 새로운 긍정적 매너 평가를 등록합니다.
 * @param params - 평가 대상 회원 ID와 매너 키워드 ID 배열을 포함한 객체
 * @returns 생성된 매너 평가 상세 정보와 대상 회원 ID를 포함한 Promise 객체
 */
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

/**
 * 특정 회원에 대한 새로운 부정적 매너 평가를 등록합니다.
 * @param params - 평가 대상 회원 ID와 매너 키워드 ID 배열을 포함한 객체
 * @returns 생성된 매너 평가 상세 정보와 대상 회원 ID를 포함한 Promise 객체
 */
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

/**
 * 기존의 매너 평가를 수정합니다 (긍정/부정 모두 적용).
 * @param params - 매너 평가 ID와 새로운 매너 키워드 ID 배열을 포함한 객체
 * @returns 업데이트된 매너 평가 상세 정보와 대상 회원 ID를 포함한 Promise 객체
 */
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

/**
 * 특정 회원의 매너 키워드와 각 키워드의 사용 횟수를 조회합니다.
 * 각 매너 키워드의 ID와 사용된 횟수 정보를 반환합니다.
 * @param memberId - 매너 키워드를 조회할 회원의 ID
 * @returns 매너 키워드 배열과 각각의 사용 횟수를 포함한 Promise 객체
 */
export const getOtherManner = async (
  memberId: number
): Promise<OtherKeywordsMannerResponse> => {
  try {
    const response = await AuthAxios.get(`/api/v2/manner/keyword/${memberId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

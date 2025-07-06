import { BlockStatusResponse } from "@/types/api/block/status";

import { AuthAxios } from "../auth";

/* 차단하기 */
export const blockMember = async (
  memberId: number
): Promise<BlockStatusResponse> => {
  const endpoint = `/api/v2/block/${memberId}`;
  try {
    const response = await AuthAxios.post(endpoint);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* 차단 해제 */
export const unblockMember = async (
  memberId: number
): Promise<BlockStatusResponse> => {
  const endpoint = `/api/v2/block/${memberId}`;
  try {
    const response = await AuthAxios.delete(endpoint);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* 차단 목록 삭제 (탈퇴 회원의 경우) */
export const deleteBlockMember = async (
  memberId: number
): Promise<BlockStatusResponse> => {
  const endpoint = `/api/v2/block/delete/${memberId}`;
  try {
    const response = await AuthAxios.delete(endpoint);
    return response.data;
  } catch (error) {
    throw error;
  }
};

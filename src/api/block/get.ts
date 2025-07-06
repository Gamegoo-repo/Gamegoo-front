import { AuthAxios } from "../auth";

import type { GetBlockListResponse } from "@/types/api/block/get";

/* 차단 목록 조회 */
export const getBlockList = async (
  page: number
): Promise<GetBlockListResponse> => {
  const endpoint = `/api/v2/block?page=${page}`;
  try {
    const response = await AuthAxios.get(endpoint);
    return response.data;
  } catch (error) {
    throw error;
  }
};

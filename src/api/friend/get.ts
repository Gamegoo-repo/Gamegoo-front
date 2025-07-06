import {
  GetFriendListResponse,
  GetSearchFriendResponse,
} from "@/types/api/friend/get";

import { AuthAxios } from "../auth";

/* 친구 목록 조회 */
export const getFriendsList = async (): Promise<GetFriendListResponse> => {
  const endpoint = `/api/v2/friend`;
  try {
    const response = await AuthAxios.get(endpoint);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* 소환사명으로 친구 검색 */
export const getSearchFriend = async (
  query: string
): Promise<GetSearchFriendResponse> => {
  const endpoint = `/api/v2/friend/search?query=${query}`;
  try {
    const response = await AuthAxios.get(endpoint);
    return response.data;
  } catch (error) {
    throw error;
  }
};

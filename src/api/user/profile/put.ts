import { AuthAxios } from "../../auth";

import type {
  PutPositionRequest,
  PutProfileResponse,
} from "@/types/api/user/profile/put";
import type { Mike } from "@/types/user/mike";

export const putProfileImage = async (
  profileImage: number
): Promise<PutProfileResponse> => {
  const endpoint = "/api/v2/profile/profileImage";
  try {
    const response = await AuthAxios.put(endpoint, { profileImage });
    return response.data;
  } catch (error) {
    console.error("프로필 이미지 수정 실패:", error);
    throw error;
  }
};

export const putGameStyle = async (
  gameStyleIdList: number[]
): Promise<PutProfileResponse> => {
  const endpoint = "/api/v2/profile/gamestyle";
  try {
    const response = await AuthAxios.put(endpoint, { gameStyleIdList });
    return response.data;
  } catch (error) {
    console.error("게임스타일 수정 실패:", error);
    throw error;
  }
};

export const putPosition = async ({
  mainP,
  subP,
  wantP,
}: PutPositionRequest): Promise<PutProfileResponse> => {
  const endpoint = "/api/v2/profile/position";
  try {
    const response = await AuthAxios.put(endpoint, { mainP, subP, wantP });
    return response.data;
  } catch (error) {
    console.error("포지션 수정 실패:", error);
    throw error;
  }
};

export const putMike = async (mike: Mike): Promise<PutProfileResponse> => {
  const endpoint = "/api/v2/profile/mike";
  try {
    const response = await AuthAxios.put(endpoint, { mike });
    return response.data;
  } catch (error) {
    console.error("마이크 수정 실패:", error);
    throw error;
  }
};

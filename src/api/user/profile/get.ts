import {
  GetMyProfileResponse,
  GetOtherProfileResponse,
} from "@/types/api/user/profile/get";

import { AuthAxios } from "../../auth";

export const getMyProfile = async (): Promise<GetMyProfileResponse> => {
  const endpoint = "/api/v2/profile";
  try {
    const response = await AuthAxios.get(endpoint);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOtherProfile = async (
  id: number
): Promise<GetOtherProfileResponse> => {
  const endpoint = "/api/v2/profile/other";
  try {
    const response = await AuthAxios.get(endpoint, {
      params: { id },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

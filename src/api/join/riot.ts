import Axios from "../api";

import type { RiotRequest, RiotResponse } from "@/types/api/join/riot";

export const verifyRiot = async ({
  gameName,
  tag,
}: RiotRequest): Promise<RiotResponse> => {
  const endpoint = "/api/v2/riot/verify";
  try {
    const response = await Axios.post(endpoint, { gameName, tag });
    return response.data;
  } catch (error) {
    console.error("Riot 계정 확인 실패:", error);
    throw error;
  }
};

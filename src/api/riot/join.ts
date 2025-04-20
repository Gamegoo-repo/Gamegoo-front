import Axios from "..";
import { RiotJoinRequest } from "@/types/api/riot/join";

export const postRiotJoin = async ({
    puuid,
    isAgree
}: RiotJoinRequest): Promise<RiotJoinRequest> => {
  const endpoint = "/api/v2/riot/join";

  try {
    const response = await Axios.post(endpoint, {
      puuid,
      isAgree,
    });
    return response.data;
  } catch (error) {
    console.error("RIOT 회원가입 실패:", error);
    throw error;
  }
};

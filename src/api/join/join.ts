import { JoinRequest, JoinResponse } from "@/types/api/join/join";
import Axios from "..";

export const postJoin = async ({
  isAgree,
  email,
  password,
  gameName,
  tag,
}: JoinRequest): Promise<JoinResponse> => {
  const endpoint = "/api/v2/auth/join";

  try {
    const response = await Axios.post(endpoint, {
      isAgree,
      email,
      password,
      gameName,
      tag,
    });
    return response.data;
  } catch (error) {
    console.error("회원가입 실패:", error);
    throw error;
  }
};
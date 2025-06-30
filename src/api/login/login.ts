import Axios from "..";
import { LoginRequest, LoginResponse } from "@/types/api/login/login";

export const postLogin = async ({
  email,
  password,
}: LoginRequest): Promise<LoginResponse> => {
  const endpoint = "/api/v2/auth/login";

  try {
    const response = await Axios.post(endpoint, { email, password });
    return response.data;
  } catch (error) {
    console.error("로그인 실패:", error);
    throw error;
  }
};

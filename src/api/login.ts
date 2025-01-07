import axios from "axios";
import { BASE_URL } from ".";

interface loginProps {
  email: string;
  password: string;
}

export const postLogin = async ({ email, password }: loginProps) => {
  try {
    const formData = new URLSearchParams();
    formData.append("email", email);
    formData.append("password", password);

    const response = await axios.post("/v1/member/login", formData, {
      baseURL: BASE_URL,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data;
  } catch (error) {
    console.error("로그인 실패:", error);
    throw error;
  }
};

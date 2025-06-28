import {
  EmailResponse,
  SendEmailRequest,
  VerifyEmailRequest,
} from "@/types/api/email/email";
import Axios from "..";

export const sendJoinEmail = async ({
  email,
}: SendEmailRequest): Promise<EmailResponse> => {
  const endpoint = "/api/v2/email/send/join";

  try {
    const response = await Axios.post(endpoint, { email });
    return response.data;
  } catch (error) {
    console.error("인증코드 전송 실패:", error);
    throw error;
  }
};

export const sendPasswordEmail = async ({
  email,
}: SendEmailRequest): Promise<EmailResponse> => {
  const endpoint = "/api/v2/email/send/pwd";

  try {
    const response = await Axios.post(endpoint, { email });
    return response.data;
  } catch (error) {
    console.error("인증코드 전송 실패:", error);
    throw error;
  }
};

export const verifyEmailCode = async ({
  email,
  code,
}: VerifyEmailRequest): Promise<EmailResponse> => {
  const endpoint = "/api/v2/email/verify";
  try {
    const response = await Axios.post(endpoint, { email, code });
    return response.data;
  } catch (error) {
    console.error("인증코드 확인 실패:", error);
    throw error;
  }
};

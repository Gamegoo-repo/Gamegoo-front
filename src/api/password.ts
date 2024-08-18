import Axios from ".";
import { AuthAxios } from "./auth";

export const sendEmail= async ({ email }: { email: string }) => {
  const endpoint = '/v1/member/email/send';

  try {
    const response = await Axios.post(endpoint, { email });
    console.log("인증코드 전송 성공:", response);
    return response.data;
  } catch (error) {
    console.error("인증코드 전송 실패:", error);
    throw error;
  }
};

export const sendAuth= async ({ email, code }: { email: string, code: string }) => {
  const endpoint = '/v1/member/email/verify';
  try {
    const response = await Axios.post(endpoint, { email, code });
    console.log("인증코드 확인 성공:", response);
    return response.data;
  } catch (error) {
    console.error("인증코드 확인 실패:", error);
    throw error;
  }
};

export const resetPassword = async ({ email, password }: { email: string, password: string }) => {
  const endpoint = '/v1/member/password/reset';
    try {
      const response = await Axios.post(endpoint, {email, password});
      console.log('비밀번호 재설정 성공:', response.data);
      return response.data;
    } catch (error) {
      console.error('비밀번호 재설정 실패:', error);
      throw error;
    }
};

export const checkPassword = async (password: string) => {
    const endpoint = '/v1/member/password/check';
    try {
      const response = await AuthAxios.post(endpoint, {password});
      console.log('비밀번호 확인 성공:', response.data);
      return response.data;
    } catch (error) {
      console.error('비밀번호 확인 실패:', error);
      throw error;
    }
  };

  export const resetJwtPassword = async (password: string) => {
    const endpoint = '/v1/member/password/reset/jwt';
    try {
      const response = await AuthAxios.post(endpoint, {password});
      console.log('비밀번호 재설정 성공:', response.data);
      return response.data;
    } catch (error) {
      console.error('비밀번호 재설정 실패:', error);
      throw error;
    }
  };
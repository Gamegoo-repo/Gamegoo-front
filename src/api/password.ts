import Axios from ".";
import { AuthAxios } from "./auth";

export const sendEmail= async ({ email }: { email: string }) => {
  const endpoint = '/v1/member/email/send/user';
  try {
    const response = await Axios.post(endpoint, { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendAuth = async ({ email, code }: { email: string, code: string }) => {
  const endpoint = '/v1/member/email/verify';
  try {
    const response = await Axios.post(endpoint, { email, code });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async ({ email, password }: { email: string, password: string }) => {
  const endpoint = '/v1/member/password/reset';
  try {
    const response = await Axios.post(endpoint, { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkPassword = async (password: string) => {
  const endpoint = '/v1/member/password/check';
  try {
    const response = await AuthAxios.post(endpoint, { password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetJwtPassword = async (password: string) => {
  const endpoint = '/v1/member/password/jwt/reset';
  try {
    const response = await AuthAxios.post(endpoint, { password });
    return response.data;
  } catch (error) {
    throw error;
  }
};
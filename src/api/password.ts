import { AuthAxios } from "./auth";

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

  export const resetPassword = async (password: string) => {
    const endpoint = '/v1/member/password/reset';
    try {
      const response = await AuthAxios.post(endpoint, {password});
      console.log('비밀번호 재설정 성공:', response.data);
      return response.data;
    } catch (error) {
      console.error('비밀번호 재설정 실패:', error);
      throw error;
    }
  };
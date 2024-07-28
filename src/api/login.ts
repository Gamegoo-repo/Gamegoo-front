import Axios from ".";

interface loginProps {
    email: string;
    password: string;
}

export const postLogin = async ({
    email,
    password,
  }: loginProps) => {
    try {
      const response = await Axios.post('/api/member/login', {
        email, password
      });
      console.log('로그인 성공:', response.data);
      return response.data;
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
    }
  };
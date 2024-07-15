import Axios from ".";

interface joinProps {
    email: string;
    password: string;
}

export const sendEmail= async ({ email }: { email: string }) => {
  const endpoint = '/api/member/email/send';

  try {
    const response = await Axios.post(endpoint, { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendAuth= async ({ email, code }: { email: string, code: string }) => {
  const endpoint = '/api/member/email/verify';
  try {
    const response = await Axios.post(endpoint, { email, code });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const joinMember = async ({
    email,
    password,
  }: joinProps) => {
    try {
      const response = await Axios.post('/api/member/join', {
        email, password
      });
      console.log('회원가입 성공:', response.data);
      return response.data;
    } catch (error) {
      console.error('회원가입 실패:', error);
      throw error;
    }
  };
import Axios from ".";

interface joinProps {
  isAgree: boolean;
  email: string;
  password: string;
  gameName: string;
  tag: string;
}

export const sendJoinEmail = async ({ email }: { email: string }) => {
  const endpoint = '/v1/member/email/send/join';

  try {
    const response = await Axios.post(endpoint, { email });
    console.log("인증코드 전송 성공:", response);
    return response.data;
  } catch (error) {
    console.error("인증코드 전송 실패:", error);
    throw error;
  }
};

export const sendAuth = async ({ email, code }: { email: string, code: string }) => {
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

export const checkRiot = async ({ gameName, tag }: { gameName: string, tag: string }) => {
  const endpoint = '/v1/member/riot';
  try {
    const response = await Axios.post(endpoint, { gameName, tag });
    console.log("Riot 계정 확인 성공:", response);
    return response.data;
  } catch (error) {
    console.error("Riot 계정 확인 실패:", error);
    throw error;
  }
};

export const joinMember = async ({
  isAgree,
  email,
  password,
  gameName,
  tag
}: joinProps) => {
  try {
    const response = await Axios.post('/v1/member/join', {
      isAgree, email, password, gameName, tag
    });
    console.log('회원가입 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('회원가입 실패:', error);
    throw error;
  }
};
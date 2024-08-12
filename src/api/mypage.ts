import { AuthAxios } from "./auth";

export const getProfile= async () => {
  const endpoint = '/v1/member/profile';
  try {
    const response = await AuthAxios.get(endpoint);
    console.log("유저 프로필 조회 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("유저 프로필 조회 실패:", error);
    throw error;
  }
};

export const putProfileImg= async (profileImage: number) => {
  const endpoint = '/v1/member/profile_image';
  try {
    console.log("선택한 프로필 이미지", profileImage);
    const response = await AuthAxios.put(endpoint, { profileImage });
    console.log("프로필 이미지 수정 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("프로필 이미지 수정 실패:", error);
    throw error;
  }
};

export const putGameStyle = async (gameStyleIdList: number[]) => {
  const endpoint = '/v1/member/gamestyle';
  try {
    const response = await AuthAxios.put(endpoint, { gameStyleIdList });
    console.log("게임스타일 수정 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("게임스타일 수정 실패:", error);
    throw error;
  }
};

export const putPosition = async ({ minP, subP }: { minP: string, subP: string }) => {
  const endpoint = '/v1/member/position';
  try {
    const response = await AuthAxios.put(endpoint, { minP, subP});
    console.log("포지션 수정 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("포지션 수정 실패:", error);
    throw error;
  }
};

export const deleteMember = async () => {
    const endpoint = '/v1/member';
    try {
      const response = await AuthAxios.delete(endpoint);
      console.log('회원탈퇴 성공:', response.data);
      return response.data;
    } catch (error) {
      console.error('회원탈퇴 실패:', error);
      throw error;
    }
  };
import { AuthAxios } from "./auth";

export const getProfile = async () => {
  const endpoint = '/v1/member/profile';
  try {
    const response = await AuthAxios.get(endpoint);
    console.log("유저 프로필 조회 성공:", response.data);
    return response.data.result;
  } catch (error) {
    console.error("유저 프로필 조회 실패:", error);
    throw error;
  }
};

export const putProfileImg = async (profileImage: number) => {
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

export const putPosition = async ({ mainP, subP }: { mainP: number, subP: number }) => {
  const endpoint = '/v1/member/position';
  try {
    const response = await AuthAxios.put(endpoint, { mainP, subP});
    console.log("포지션 수정 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("포지션 수정 실패:", error);
    throw error;
  }
};

export const putMike = async (isMike: boolean) => {
  const endpoint = '/v1/member/mike';
  try {
    const response = await AuthAxios.put(endpoint, { isMike });
    console.log("마이크 수정 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("마이크 수정 실패:", error);
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

  export const getMyPost= async (pageIdx:number) => {
    const endpoint = `/v1/posts/my?pageIdx=${pageIdx}`;
    try {
      const response = await AuthAxios.get(endpoint);
      console.log("내가 작성한 글 목록 조회 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("내가 작성한 글 목록 조회 실패:", error);
      throw error;
    }
  };
  
  export const getMyManner= async () => {
    const endpoint = '/v1/manner';
    try {
      const response = await AuthAxios.get(endpoint);
      console.log("내가 받은 매너평가 조회 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("내가 받은 매너평가 조회 실패:", error);
      throw error;
    }
  };
  
  export const getMyBlocked= async (page: number) => {
    const endpoint = `/v1/member/block?page=${page}`;
    try {
      const response = await AuthAxios.get(endpoint);
      console.log("내가 차단한 회원 목록 조회 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("내가 차단한 회원 목록 조회 실패:", error);
      throw error;
    }
  };
  
import { useSelector } from "react-redux";
import { AuthAxios } from "./auth";
import { RootState } from "@/redux/store";

export const deleteMember = async () => {
  const endpoint = "/v1/member";
  try {
    const response = await AuthAxios.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error("회원탈퇴 실패:", error);
    throw error;
  }
};

export const getMyPost = async (pageIdx: number) => {
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

export const getMyManner = async (memberId: number) => {
  try {
    const response = await AuthAxios.get(`/api/v2/manner/level/${memberId}`);
    console.log("내가 받은 매너평가 조회 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("내가 받은 매너평가 조회 실패:", error);
    throw error;
  }
};

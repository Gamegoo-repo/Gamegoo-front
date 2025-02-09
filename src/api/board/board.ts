import { PostReq } from "@/interface/board";
import { AuthAxios } from "../auth";
import Axios from "..";
import {
  BoardDeleteResponse,
  BoardEditResponse,
  GetBoardListResponse,
  GetMyBoardListResponse,
  MemberPostBoardResponse,
  NotMemberBoardResponse,
  PostsResponse,
} from "@/types/api/board/board";
import { Position } from "@/types/position/position";

interface ListInterface {
  page: number;
  mode: string | number | null;
  tier: string | null;
  mainPosition: Position
  mike: string | boolean | null;
}

/* 글쓰기 */
export const postBoard = async (params: PostReq): Promise<PostsResponse> => {
  try {
    const response = await AuthAxios.post("/api/v2/posts", params);
    return response.data;
  } catch (error) {
    console.error("글쓰기 실패:", error);
    throw error;
  }
};

/* 게시글 목록 조회 */
export const getBoardList = async (
  params: ListInterface
): Promise<GetBoardListResponse> => {
  try {
    const response = await AuthAxios.get("/api/v2/posts/list", { params });
    return response.data;
  } catch (error) {
    console.error("게시판 목록 불러오기 실패:", error);
    throw error;
  }
};

/* 회원 게시글 조회 */
export const getMemberPost = async (
  postId: number
): Promise<MemberPostBoardResponse> => {
  try {
    const response = await AuthAxios.get(`/api/v2/posts/member/list/${postId}`);
    return response.data;
  } catch (error) {
    console.error("로그인 상태 게시글 조회 실패:", error);
    throw error;
  }
};

/* 비회원 게시글 조회 */
export const getNonMemberPost = async (
  postId: number
): Promise<NotMemberBoardResponse> => {
  try {
    const response = await Axios.get(`/api/v2/posts/list/${postId}`);
    return response.data;
  } catch (error) {
    console.error("로그아웃 상태 게시글 조회 실패:", error);
    throw error;
  }
};

/* 게시글 수정 */
export const editPost = async (
  postId: number,
  params: PostReq
): Promise<BoardEditResponse> => {
  try {
    const response = await AuthAxios.put(`/api/v2/posts/${postId}`, params);
    return response.data;
  } catch (error) {
    console.error("게시글 수정 실패:", error);
    throw error;
  }
};

/* 게시글 삭제 */
export const deletePost = async (
  postId: number
): Promise<BoardDeleteResponse> => {
  try {
    const response = await AuthAxios.delete(`/api/v2/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error("게시글 삭제 실패:", error);
    throw error;
  }
};

/* 내가 쓴 글 목록 조회 */
export const getMyPost = async (pageIdx: number): Promise<GetMyBoardListResponse> => {
  const endpoint = `/api/v2/posts/my?pageIdx=${pageIdx}`;
  try {
    const response = await AuthAxios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("내가 작성한 글 목록 조회 실패:", error);
    throw error;
  }
};
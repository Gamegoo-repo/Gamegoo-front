import { PostReq } from "@/interface/board";
import { AuthAxios } from "../auth";
import Axios from "..";
import {
  BoardDeleteResponse,
  BoardEditResponse,
  BoardPullUpResponse,
  GetBoardListResponse,
  GetMyBoardListResponse,
  GetBoardListCursorResponse,
  GetMyBoardListCursorResponse,
  MemberPostBoardResponse,
  NotMemberBoardResponse,
  PostsResponse,
} from "@/types/api/board/board";
import { Position } from "@/types/position/position";
import { GameMode } from "@/types/game/gameMode";
import { notify } from "@/hooks/notify";
import { BOARD } from "@/constants/messages";

interface ListInterface {
  page: number;
  gameMode: GameMode | null;
  tier: string | null;
  mainP: Position;
  mike: string | boolean | null;
}

interface CursorListInterface {
  cursor: string | null;
  cursorId: number | null;
  gameMode: GameMode | null;
  tier: string | null;
  position1: Position;
}

/* 글쓰기 */
export const postBoard = async (params: PostReq): Promise<PostsResponse> => {
  try {
    const response = await AuthAxios.post("/api/v2/posts", params);
    return response.data;
  } catch (error: any) {
    console.error("글쓰기 실패:", error);
    if (error.response.data.code === "BOARD_412") {
      notify({
        text: BOARD.MESSAGE.COOLTIME,
        icon: "🚫",
        type: "error",
      });
    }
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

/* 커서 기반 게시글 목록 조회 */
export const getBoardListCursor = async (
  params: CursorListInterface
): Promise<GetBoardListCursorResponse> => {
  try {
    const response = await AuthAxios.get("/api/v2/posts/cursor", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("커서 기반 게시판 목록 불러오기 실패:", error);
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

/* 게시글 끌올 */
export const pullUpPost = async (
  postId: number
): Promise<BoardPullUpResponse> => {
  try {
    const response = await AuthAxios.post(`/api/v2/posts/${postId}/bump`);
    return response.data;
  } catch (error: any) {
    console.error("게시글 끌올 실패:", error);
    if (error.response.data.code === "BOARD_411") {
      // 끌올 1시간 제한
      notify({
        text: error.response.data.message,
        icon: "🚫",
        type: "error",
      });
    }
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
export const getMyPost = async (
  page: number
): Promise<GetMyBoardListResponse> => {
  const endpoint = `/api/v2/posts/my?page=${page}`;
  try {
    const response = await AuthAxios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("내가 작성한 글 목록 조회 실패:", error);
    throw error;
  }
};

export const getMyPostCursor = async (
  cursor: string | null
): Promise<GetMyBoardListCursorResponse> => {
  const endpoint = `/api/v2/posts/my/cursor`;
  try {
    const response = await AuthAxios.get(endpoint, { params: { cursor } });
    return response.data;
  } catch (error) {
    console.error("내가 작성한 글 목록 커서 조회 실패:", error);
    throw error;
  }
};

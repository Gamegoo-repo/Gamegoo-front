import { PostReq } from "@/interface/board";
import { AuthAxios } from "./auth";
import Axios from ".";

interface ListInterface {
    pageIdx: number;
}

/* 글쓰기 */
export const postBoard = async (params: PostReq) => {
    try {
        const response = await AuthAxios.post("/v1/posts", params);
        return response.data;
    } catch (error) {
        console.error("글쓰기 실패:", error);
        throw error;
    }
};

/* 게시글 목록 조회 */
export const getBoardList = async (params: ListInterface) => {
    try {
        const response = await AuthAxios.get("/v1/posts/list", { params });
        return response.data;
    } catch (error) {
        console.error("게시판 목록 불러오기 실패:", error);
        throw error;
    }
};

/* 회원 게시글 조회 */
export const getMemberPost = async (postId: number) => {
    try {
        const response = await AuthAxios.get(`/v1/posts/member/list/${postId}`);
        return response.data;
    } catch (error) {
        console.error("로그인 상태 게시글 조회 실패:", error);
        throw error;
    }
};

/* 비회원 게시글 조회 */
export const getNonMemberPost = async (postId: number) => {
    try {
        const response = await Axios.get(`/v1/posts/list/${postId}`);
        return response.data;
    } catch (error) {
        console.error("로그아웃 상태 게시글 조회 실패:", error);
        throw error;
    }
};

/* 게시글 수정 */
export const editPost = async (postId: number, params: PostReq) => {
    try {
        const response = await AuthAxios.put(`/v1/posts/${postId}`, params);
        return response.data;
    } catch (error) {
        console.error("게시글 수정 실패:", error);
        throw error;
    }
};

/* 게시글 삭제 */
export const deletePost = async (postId: number) => {
    try {
        const response = await AuthAxios.delete(`/v1/posts/${postId}`);
        return response.data;
    } catch (error) {
        console.error("게시글 삭제 실패:", error);
        throw error;
    }
};

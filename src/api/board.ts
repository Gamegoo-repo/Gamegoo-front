import { PostReq } from "@/interface/board";
import Axios from ".";

interface ListInterface {
    pageIdx: number;
}

let token = JSON.stringify(localStorage.getItem('refreshToken'));

const headers = {
    Authorization: `Bearer ${token}`
};

/* 글쓰기 */
export const postBoard = async (params: PostReq) => {
    try {
        const response = await Axios.post("/v1/posts", params, { headers });
        console.log("글쓰기 완료:", response.data);
        return response.data;
    } catch (error) {
        console.error("글쓰기 실패:", error);
        throw error;
    }
};

/* 게시글 목록 조회 */
export const getBoardList = async (params: ListInterface) => {
    try {
        const response = await Axios.get("/v1/posts/list", { params });
        console.log("게시판 목록:", response.data);
        return response.data;
    } catch (error) {
        console.error("게시판 목록 불러오기 실패:", error);
        throw error;
    }
};

/* 게시글 조회 */
export const getPost = async (postId: number) => {
    try {
        const response = await Axios.get(`/v1/posts/list/${postId}`);
        console.log("게시글 조회 성공:", response.data);
        return response.data;

    } catch (error) {
        console.error("게시글 조회 실패:", error);
        throw error;
    }
};

/* 게시글 수정 */
export const editPost = async (postId: number, params:PostInterface) => {
    try {
        const response = await Axios.put(`/v1/posts/${postId}`, params);
        console.log("게시글 수정 성공:", response.data);
        return response.data;

    } catch (error) {
        console.error("게시글 수정 실패:", error);
        throw error;
    }
};

/*게시글 삭제 */
export const deletePost = async (postId: number) => {
    try {
        const response = await Axios.delete(`/v1/posts/${postId}`);
        console.log("게시글 삭제 성공:", response.data);
        return response.data;

    } catch (error) {
        console.error("게시글 삭제 실패:", error);
        throw error;
    }
};

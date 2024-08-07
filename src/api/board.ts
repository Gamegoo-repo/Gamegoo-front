import Axios from ".";

interface PostInterface {
    gameMode: number;
    mainPosition: number;
    subPosition: number;
    wantPosition: number;
    voice: boolean;
    gameStyles: number[];
    contents: string;
}

interface ListInterface {
    pageIdx: number;
}

let token = JSON.stringify(localStorage.getItem('refreshToken'));

const headers = {
    Authorization: `Bearer ${token}`
};

export const postBoard = async (params: PostInterface) => {
    try {
        const response = await Axios.post("/v1/posts", params, { headers });
        console.log("글쓰기 완료:", response.data);
        return response.data;
    } catch (error) {
        console.error("글쓰기 실패:", error);
        throw error;
    }
};

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


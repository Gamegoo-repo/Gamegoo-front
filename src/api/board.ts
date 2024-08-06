import Axios from ".";

interface PostProps {
    gameMode: number;
    mainPosition: number;
    subPosition: number;
    wantPosition: number;
    voice: boolean;
    gameStyles: number[];
    contents: string;
}

interface ListProps {
    pageIdx: number;
}

let token = localStorage.getItem('refreshToken')
const headers = {
    Authorization: `Bearer ${token}`
};

export const postBoard = async (params: PostProps) => {
    try {
        const response = await Axios.post("/v1/posts", params, { headers });
        console.log("글쓰기 완료:", response.data);
        return response.data;
    } catch (error) {
        console.error("글쓰기 실패:", error);
        throw error;
    }
};

export const getBoardList = async (params: ListProps) => {
    try {
        const response = await Axios.get("/v1/posts/list", { params });
        console.log("게시판 목록:", response.data);
        return response.data;
    } catch (error) {
        console.error("게시판 목록 불러오기 실패:", error)
    }
};


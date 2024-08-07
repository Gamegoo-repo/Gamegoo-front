import Axios from ".";

let token = JSON.stringify(localStorage.getItem('refreshToken'));

const headers = {
    Authorization: `Bearer ${token}`
};

export const getUserInfo = async () => {
    try {
        const response = await Axios.get("/v1/member/profile", { headers });
        console.log("유저 데이터 성공:", response.data);
        return response.data;
    } catch (error) {
        console.error("유저 데이터 불러오기 실패:", error)
    }
};

export const blockMember = async (memberId: number) => {
    try {
        const response = await Axios.post(`/v1/member/block/${memberId}`);
        console.log("차단 성공:", response.data);
        return response.data;
    } catch (error) {
        console.error("차단 실패:", error)
    }
};
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatState {
    memberId: number;
    onlineFriends: number[];
}

const initialState: ChatState = {
    memberId: 0,
    onlineFriends: [],
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        memberId: (state, action: PayloadAction<number>) => {
            state.memberId = action.payload;
        },
        friendOnline: (state, action: PayloadAction<number | number[]>) => {
            if (Array.isArray(action.payload)) {
                // 배열인 경우 전체를 업데이트
                state.onlineFriends = action.payload;
            } else {
                // 개별 온라인 친구 id 추가
                if (!state.onlineFriends.includes(action.payload)) {
                    state.onlineFriends.push(action.payload);
                }
            }
        },
        friendOffline: (state, action: PayloadAction<number>) => {
            // id를 배열에서 제거
            state.onlineFriends = state.onlineFriends.filter(id => id !== action.payload);
        },
    },
});

export const {
    memberId,
    friendOnline,
    friendOffline
} = chatSlice.actions;
export default chatSlice.reducer;
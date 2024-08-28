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
        friendOnline: (state, action: PayloadAction<number[]>) => {
            state.onlineFriends = action.payload;
        },
    },
});

export const {
    memberId,
    friendOnline
} = chatSlice.actions;
export default chatSlice.reducer;
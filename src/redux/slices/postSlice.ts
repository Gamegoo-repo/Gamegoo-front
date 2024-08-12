import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MemberPost, NonMemberPost } from '@/interface/board';

interface SetCurrentPostPayload {
    currentPost: MemberPost | NonMemberPost;
    currentPostId: number;
}

interface PostState {
    currentPost: MemberPost | NonMemberPost | null;
    currentPostId: number | null;
}

const initialState: PostState = {
    currentPost: null,
    currentPostId: null,
};

const postSlice = createSlice({
    name: 'postSlice',
    initialState,
    reducers: {
        setCurrentPost(state, action: PayloadAction<SetCurrentPostPayload>) {
            state.currentPost = action.payload.currentPost;
            state.currentPostId = action.payload.currentPostId;
        },
        clearCurrentPost(state) {
            state.currentPost = null;
            state.currentPostId = null;
        },
    },
});

export const { setCurrentPost, clearCurrentPost } = postSlice.actions;
export default postSlice.reducer;
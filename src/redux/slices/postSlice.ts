import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post } from '@/interface/board';

interface SetCurrentPostPayload {
    currentPost: Post;
    currentPostId: number;
}

interface PostState {
    currentPost: Post | null;
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
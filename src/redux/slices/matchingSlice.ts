import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MatchingState {
  isComplete: boolean;
}

const initialState: MatchingState = {
  isComplete: false,
};

const matchingSlice = createSlice({
  name: 'matching',
  initialState,
  reducers: {
    setComplete(state, action: PayloadAction<boolean>) {
      state.isComplete = action.payload;
    },
  },
});

export const { setComplete } = matchingSlice.actions;
export default matchingSlice.reducer;

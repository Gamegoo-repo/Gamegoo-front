import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BoardState {
  pageIdx: number;
  mode: number | null;
  tier: string | null;
  mainPosition: number | null;
  mike: boolean | null;
}

const initialState: BoardState = {
  pageIdx: 1,
  mode: null,
  tier: null,
  mainPosition: null,
  mike: null,
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setBoardFilters: (state, action: PayloadAction<BoardState>) => {
      return { ...state, ...action.payload };
    },
    resetBoardFilters: (state) => initialState,
  },
});

export const { setBoardFilters, resetBoardFilters } = boardSlice.actions;
export default boardSlice.reducer;

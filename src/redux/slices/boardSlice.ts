import { GameMode } from '@/types/game/gameMode';
import { Position } from '@/types/position/position';
import { Mike } from '@/types/user/mike';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BoardState {
  pageIdx: number;
  gameMode: number | GameMode | null;
  tier: string | null;
  mainP: Position;
  mike: Mike | null;
}

const initialState: BoardState = {
  pageIdx: 1,
  gameMode: null,
  tier: null,
  mainP: "ANY",
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

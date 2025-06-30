import { GameMode } from "@/types/game/gameMode";
import { Position } from "@/types/position/position";
import { Mike } from "@/types/user/mike";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BoardState {
  pageIdx: number;
  gameMode: GameMode | null;
  tier: string | null;
  mainP: Position;
  mike: Mike | null;
  refresh?: number;
}

const initialState: BoardState = {
  pageIdx: 1,
  gameMode: null,
  tier: null,
  mainP: "ANY",
  mike: null,
  refresh: 0,
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setBoardFilters: (state, action: PayloadAction<BoardState>) => {
      const { refresh, ...rest } = action.payload;
      return { ...state, ...rest };
    },
    resetBoardFilters: () => initialState,
    setRefresh: (state) => {
      state.refresh = Date.now();
    },
  },
});

export const { setBoardFilters, resetBoardFilters, setRefresh } =
  boardSlice.actions;
export default boardSlice.reducer;

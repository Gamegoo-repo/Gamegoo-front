import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MatchInfoState {
  mike: boolean | null;                         // 마이크 사용 여부
  mainP: number | null;                         // 주 포지션
  subP: number | null;                          // 부 포지션
  wantP: number | null;                         // 원하는 포지션
  gameStyleResponseDTOList: number[];        // 게임 스타일 목록
}

const initialState: MatchInfoState = {
  mike: false,
  mainP: null,
  subP: null,
  wantP: null,
  gameStyleResponseDTOList: [],
};

const matchInfoSlice = createSlice({
  name: 'matchInfo',
  initialState,
  reducers: {
    // MatchInfo 업데이트
    setMatchInfo: (state, action: PayloadAction<MatchInfoState>) => {
      state.mike = action.payload.mike;
      state.mainP = action.payload.mainP;
      state.subP = action.payload.subP;
      state.wantP = action.payload.wantP;
      state.gameStyleResponseDTOList = action.payload.gameStyleResponseDTOList;
    },
    
    updateMatchInfo: (state, action: PayloadAction<Partial<MatchInfoState>>) => {
      const updates = action.payload;
      if (updates.mike !== undefined) state.mike = updates.mike;
      if (updates.mainP !== undefined) state.mainP = updates.mainP;
      if (updates.subP !== undefined) state.subP = updates.subP;
      if (updates.wantP !== undefined) state.wantP = updates.wantP;
      if (updates.gameStyleResponseDTOList !== undefined) 
        state.gameStyleResponseDTOList = updates.gameStyleResponseDTOList;
    },

    // 게임 스타일만 업데이트
    updateGameStyles: (state, action: PayloadAction<number[]>) => {
      state.gameStyleResponseDTOList = action.payload;
    },

     // 마이크만 업데이트
    updateMike: (state, action: PayloadAction<boolean>) => {
      state.mike = action.payload;
    },
  },
});

export const { setMatchInfo, updateMatchInfo, updateGameStyles, updateMike } = matchInfoSlice.actions;
export default matchInfoSlice.reducer;

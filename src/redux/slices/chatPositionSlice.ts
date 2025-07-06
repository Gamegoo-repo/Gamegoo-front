import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface ChatPosition {
  top: string;
  left: string;
}

const initialState: ChatPosition = {
  top: "10%",
  left: "100% - 450px",
};

const chatPositionSlice = createSlice({
  name: "chatPosition",
  initialState,
  reducers: {
    setPosition: (state, action: PayloadAction<ChatPosition>) => {
      state.top = action.payload.top;
      state.left = action.payload.left;
    },
    resetPosition: (state) => {
      state.top = initialState.top;
      state.left = initialState.left;
    },
  },
});

export const { setPosition, resetPosition } = chatPositionSlice.actions;
export default chatPositionSlice.reducer;

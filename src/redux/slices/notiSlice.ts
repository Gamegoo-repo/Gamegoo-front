import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  count: 0,
};

const notiSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotiCount(state, action: PayloadAction<number>) {
      state.count = action.payload;
    },
  },
});

export const { setNotiCount } = notiSlice.actions;
export default notiSlice.reducer;

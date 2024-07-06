import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MannerState {
    mannerStatus:''|'manner'|'badManner';
}

const initialState: MannerState = {
    mannerStatus:'',
};

const mannerStatusSlice = createSlice({
    name: 'mannerStatusSlice',
    initialState,
    reducers: {
        setMannerStatus: (state, action: PayloadAction<'' | 'manner' | 'badManner'>) => {
            state.mannerStatus = action.payload;
        },
    }
});

export const {
    setMannerStatus
} = mannerStatusSlice.actions;

export default mannerStatusSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

interface ModalState {
    isOpen: boolean;
    mannerModal: boolean;
    badMannerModal: boolean;
    evaluationModal: boolean;
}

const initialState: ModalState = {
    isOpen: false,
    mannerModal: false,
    badMannerModal: false,
    evaluationModal: false
};

const confirmModalSlice = createSlice({
    name: 'confirmModalSlice',
    initialState,
    reducers: {
        setOpenConfirmModal: (state) => {
            state.isOpen = true;
        },
        setCloseConfirmModal: (state) => {
            state.isOpen = false;
        },
        setOpenEvaluationModal: (state) => {
            state.evaluationModal = true;
        },
        setCloseEvaluationModal: (state) => {
            state.evaluationModal = false;
        },
        setOpenMannerModal: (state) => {
            state.mannerModal = true;
        },
        setCloseMannerModal: (state) => {
            state.mannerModal = false;
        },
        setOpenBadMannerModal: (state) => {
            state.badMannerModal = true;
        },
        setCloseBadMannerModal: (state) => {
            state.badMannerModal = false;
        },
    },
});

export const {
    setOpenConfirmModal,
    setCloseConfirmModal,
    setOpenMannerModal,
    setCloseMannerModal,
    setOpenBadMannerModal,
    setCloseBadMannerModal,
    setOpenEvaluationModal,
    setCloseEvaluationModal
} = confirmModalSlice.actions;

export default confirmModalSlice.reducer;

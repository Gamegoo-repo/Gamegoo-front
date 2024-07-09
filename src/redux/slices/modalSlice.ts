import { createSlice } from '@reduxjs/toolkit';

interface ModalState {
    isOpen: boolean;
    mannerModal: boolean;
    badMannerModal: boolean;
    evaluationModal: boolean;
    moreModal: string;
}

const initialState: ModalState = {
    isOpen: false,
    mannerModal: false,
    badMannerModal: false,
    evaluationModal: false,
    moreModal: ""
};

const modalSlice = createSlice({
    name: 'modalSlice',
    initialState,
    reducers: {
        setOpenMannerStatusModal: (state) => {
            state.isOpen = true;
        },
        setCloseMannerStatusModal: (state) => {
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
        setOpenMoreModal: (state, action) => {
            state.moreModal = action.payload;
        },
        setCloseMoreModal: (state) => {
            state.moreModal = "";
        }
    },
});

export const {
    setOpenMannerStatusModal,
    setCloseMannerStatusModal,
    setOpenMannerModal,
    setCloseMannerModal,
    setOpenBadMannerModal,
    setCloseBadMannerModal,
    setOpenEvaluationModal,
    setCloseEvaluationModal,
    setOpenMoreModal,
    setCloseMoreModal
} = modalSlice.actions;

export default modalSlice.reducer;

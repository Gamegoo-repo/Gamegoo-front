import { createSlice } from '@reduxjs/toolkit';

interface ModalState {
    isOpen: boolean;
    evaluationModal: boolean;
    moreModal: string;
    readingModal: boolean;
}

const initialState: ModalState = {
    isOpen: false,
    evaluationModal: false,
    moreModal: "",
    readingModal: false,
};

const modalSlice = createSlice({
    name: 'modalSlice',
    initialState,
    reducers: {
        /* 매너,비매너 선택 모달 */
        setOpenMannerStatusModal: (state) => {
            state.isOpen = true;
        },
        setCloseMannerStatusModal: (state) => {
            state.isOpen = false;
        },
        /* 매너,비매너 평가하기 모달 */
        setOpenEvaluationModal: (state) => {
            state.evaluationModal = true;
        },
        setCloseEvaluationModal: (state) => {
            state.evaluationModal = false;
        },
        setOpenMoreModal: (state, action) => {
            state.moreModal = action.payload;
        },
        setCloseMoreModal: (state) => {
            state.moreModal = "";
        },
        /* 게시판 읽기 모달 */
        setOpenReadingModal: (state) => {
            state.readingModal = true;
        },
        setCloseReadingModal: (state) => {
            state.readingModal = false;
        },
    },
});

export const {
    setOpenMannerStatusModal,
    setCloseMannerStatusModal,
    setOpenEvaluationModal,
    setCloseEvaluationModal,
    setOpenMoreModal,
    setCloseMoreModal,
    setOpenReadingModal,
    setCloseReadingModal
} = modalSlice.actions;

export default modalSlice.reducer;

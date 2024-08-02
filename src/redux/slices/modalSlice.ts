import { createSlice } from '@reduxjs/toolkit';

interface ModalState {
    isOpen: boolean;
    evaluationModal: boolean;
    modalType: string;
    readingModal: boolean;
    postingModal: boolean;
}

const initialState: ModalState = {
    isOpen: false,
    evaluationModal: false,
    modalType: "",
    readingModal: false,
    postingModal: false
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
        setOpenModal: (state, action) => {
            state.modalType = action.payload;
        },
        setCloseModal: (state) => {
            state.modalType = "";
        },
        /* 게시판 읽기 모달 */
        setOpenReadingModal: (state) => {
            state.readingModal = true;
        },
        setCloseReadingModal: (state) => {
            state.readingModal = false;
        },
        /* 게시판 쓰기 모달 */
        setOpenPostingModal: (state) => {
            state.postingModal = true;
        },
        setClosePostingModal: (state) => {
            state.postingModal = false;
        },

    },
});

export const {
    setOpenMannerStatusModal,
    setCloseMannerStatusModal,
    setOpenEvaluationModal,
    setCloseEvaluationModal,
    setOpenModal,
    setCloseModal,
    setOpenReadingModal,
    setCloseReadingModal,
    setOpenPostingModal,
    setClosePostingModal
} = modalSlice.actions;

export default modalSlice.reducer;

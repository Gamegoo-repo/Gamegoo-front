import { createSlice } from "@reduxjs/toolkit";
import { lockBodyScroll, unlockBodyScroll } from "@/utils";

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
  postingModal: false,
};

const modalSlice = createSlice({
  name: "modalSlice",
  initialState,
  reducers: {
    /* 매너,비매너 선택 모달 */
    setOpenMannerStatusModal: (state) => {
      state.isOpen = true;
      lockBodyScroll();
    },
    setCloseMannerStatusModal: (state) => {
      state.isOpen = false;
      unlockBodyScroll();
    },
    /* 매너,비매너 평가하기 모달 */
    setOpenEvaluationModal: (state) => {
      state.evaluationModal = true;
      lockBodyScroll();
    },
    setCloseEvaluationModal: (state) => {
      state.evaluationModal = false;
      unlockBodyScroll();
    },
    setOpenModal: (state, action) => {
      state.modalType = action.payload;
      lockBodyScroll();
    },
    setCloseModal: (state) => {
      state.modalType = "";
      unlockBodyScroll();
    },
    /* 게시판 읽기 모달 */
    setOpenReadingModal: (state) => {
      state.readingModal = true;
      lockBodyScroll();
    },
    setCloseReadingModal: (state) => {
      state.readingModal = false;
      unlockBodyScroll();
    },
    /* 게시판 쓰기 모달 */
    setOpenPostingModal: (state) => {
      state.postingModal = true;
      lockBodyScroll();
    },
    setClosePostingModal: (state) => {
      state.postingModal = false;
      unlockBodyScroll();
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
  setClosePostingModal,
} = modalSlice.actions;

export default modalSlice.reducer;

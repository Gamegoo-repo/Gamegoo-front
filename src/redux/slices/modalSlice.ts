import { createSlice } from "@reduxjs/toolkit";

import { decrementModalCount, incrementModalCount } from "@/utils";

import type { PayloadAction } from "@reduxjs/toolkit";

interface AlertPayload {
  icon: string;
  width: number;
  height: number;
  content: string;
  alt: string;
  buttonText: string;
  onClose?: () => void;
}
export interface ModalState {
  isOpen: boolean;
  mannerStatusModal: boolean;
  evaluationModal: boolean;
  modalType: string;
  readingModal: boolean;
  postingModal: boolean;
  alertProps: AlertPayload | undefined;
  openCount: number;
}

const initialState: ModalState = {
  isOpen: false,
  mannerStatusModal: false,
  evaluationModal: false,
  modalType: "",
  readingModal: false,
  postingModal: false,
  alertProps: undefined,
  openCount: 0,
};

const modalSlice = createSlice({
  name: "modalSlice",
  initialState,
  reducers: {
    /* 매너,비매너 선택 모달 */
    setOpenMannerStatusModal: (state) => {
      state.mannerStatusModal = true;
      incrementModalCount(state);
    },
    setCloseMannerStatusModal: (state) => {
      state.mannerStatusModal = false;
      decrementModalCount(state);
    },
    /* 매너,비매너 평가하기 모달 */
    setOpenEvaluationModal: (state) => {
      state.evaluationModal = true;
      incrementModalCount(state);
    },
    setCloseEvaluationModal: (state) => {
      state.evaluationModal = false;
      decrementModalCount(state);
    },
    setOpenModal: (state, action) => {
      state.modalType = action.payload;
      incrementModalCount(state);
    },
    setCloseModal: (state) => {
      state.modalType = "";
      decrementModalCount(state);
    },
    /* 게시판 읽기 모달 */
    setOpenReadingModal: (state) => {
      state.readingModal = true;
      incrementModalCount(state);
    },
    setCloseReadingModal: (state) => {
      state.readingModal = false;
      decrementModalCount(state);
    },
    /* 게시판 쓰기 모달 */
    setOpenPostingModal: (state) => {
      state.postingModal = true;
      incrementModalCount(state);
    },
    setClosePostingModal: (state) => {
      state.postingModal = false;
      decrementModalCount(state);
    },
    /* Alert Component */
    setOpenAlertModal: (state, action: PayloadAction<AlertPayload>) => {
      state.isOpen = true;
      state.alertProps = action.payload;
      incrementModalCount(state);
    },
    setCloseAlertModal: (state) => {
      state.isOpen = false;
      state.alertProps = undefined;
      decrementModalCount(state);
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
  setOpenAlertModal,
  setCloseAlertModal,
} = modalSlice.actions;

export default modalSlice.reducer;

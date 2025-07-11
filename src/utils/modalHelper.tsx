import { type ModalState } from "@/redux/slices/modalSlice";

const lockBodyScroll = () => {
  document.body.style.overflow = "hidden";
};

const unlockBodyScroll = () => {
  document.body.style.overflow = "unset";
};

export function incrementModalCount(state: ModalState) {
  state.openCount += 1;
  if (state.openCount === 1) {
    lockBodyScroll();
  }
}

export function decrementModalCount(state: ModalState) {
  state.openCount = Math.max(state.openCount - 1, 0);
  if (state.openCount === 0) {
    unlockBodyScroll();
  }
}

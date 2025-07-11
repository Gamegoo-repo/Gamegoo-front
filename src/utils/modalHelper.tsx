import { type ModalState } from "@/redux/slices/modalSlice";

export const lockBodyScroll = () => {
  document.body.style.overflow = "hidden";
};

export const unlockBodyScroll = () => {
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

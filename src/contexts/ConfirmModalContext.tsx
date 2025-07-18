import { createContext, useCallback, useState } from "react";

import ConfirmModal from "@/components/common/ConfirmModal";

import type { ReactNode } from "react";
import type {
  ConfirmModalContextState,
  ConfirmModalContextValue,
  OpenConfirmModalProps,
} from "@/types/modal/confirmModal";

export const ConfirmModalContext =
  createContext<ConfirmModalContextValue | null>(null);

export const ConfirmModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalState, setModalState] = useState<ConfirmModalContextState>({
    isOpen: false,
    width: "540px",
    primaryButtonText: "확인",
    onPrimaryClick: () => {},
  });

  const openConfirmModal = useCallback((props: OpenConfirmModalProps) => {
    setModalState({ ...props, isOpen: true });
  }, []);

  const closeConfirmModal = useCallback(() => {
    setModalState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  return (
    <ConfirmModalContext.Provider
      value={{
        openConfirmModal,
        closeConfirmModal,
      }}
    >
      {children}

      {modalState.isOpen && (
        <ConfirmModal
          type={modalState.type}
          width={modalState.width}
          primaryButtonText={modalState.primaryButtonText}
          secondaryButtonText={modalState.secondaryButtonText}
          onPrimaryClick={() => {
            modalState.onPrimaryClick();
            closeConfirmModal();
          }}
          onSecondaryClick={() => {
            modalState.onSecondaryClick?.();
            closeConfirmModal();
          }}
        >
          {modalState.children}
        </ConfirmModal>
      )}
    </ConfirmModalContext.Provider>
  );
};

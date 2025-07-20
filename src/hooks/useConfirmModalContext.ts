import { useContext } from "react";

import { ConfirmModalContext } from "@/contexts/ConfirmModalContext";

import type { ConfirmModalContextValue } from "@/types/modal/confirmModal";

const useConfirmModalContext = (): ConfirmModalContextValue => {
  const context = useContext(ConfirmModalContext);
  if (!context) {
    throw new Error(
      "useConfirmModalContext 훅은 ConfirmModalProvider 내에서 사용되어야 합니다."
    );
  }
  return context;
};

export default useConfirmModalContext;

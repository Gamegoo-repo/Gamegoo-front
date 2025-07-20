import type { ReactNode } from "react";

type ButtonText =
  | "취소"
  | "나가기"
  | "차단"
  | "확인"
  | "예"
  | "아니요"
  | "닫기"
  | "글 작성하기"
  | "글 보러하기"
  | "머무르기"
  | "매칭 종료"
  | "회원 탈퇴";

export type ConfirmModalContextState = {
  isOpen: boolean;
  type?: "manner" | string;
  width: string;
  primaryButtonText: ButtonText;
  secondaryButtonText?: ButtonText;
  onPrimaryClick: () => void;
  onSecondaryClick?: () => void;
  children?: string | ReactNode;
};

export type OpenConfirmModalProps = Omit<ConfirmModalContextState, "isOpen">;

export type ConfirmModalContextValue = {
  openConfirmModal: (props: OpenConfirmModalProps) => void;
  closeConfirmModal: () => void;
};

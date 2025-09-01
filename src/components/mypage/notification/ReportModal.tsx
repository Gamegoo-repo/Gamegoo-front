import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

import { theme } from "@/styles/theme";
import { lockBodyScroll, unlockBodyScroll } from "@/utils";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

interface ParsedReportData {
  type: "report" | "restriction";
  reason: string;
  result: string;
}

const parseReportContent = (content: string): ParsedReportData => {
  const lines = content.split("\n").filter((line) => line.trim() !== "");
  let reason = "";
  let result = "";
  let type: "report" | "restriction" = "report";

  for (const line of lines) {
    if (line.includes("제한 사유:")) {
      type = "restriction";
      reason = line.split(":")[1]?.trim() || "";
    } else if (line.includes("신고 사유:")) {
      type = "report";
      reason = line.split(":")[1]?.trim() || "";
    } else if (line.includes("제한 기간:") || line.includes("처리 결과:")) {
      result = line.split(":")[1]?.trim() || "";
    }
  }

  return { type, reason, result };
};

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  content,
}) => {
  const modalRoot = document.getElementById("modal-root") as HTMLElement;
  const { type, reason, result } = parseReportContent(content);

  const getMainMessage = () => {
    return type === "report"
      ? "귀하가 신고한 게시물이 검토되었어요."
      : "귀하의 계정은 다음 사유로 인해\n 제한이 적용되었어요.";
  };

  const getReasonLabel = () => {
    return type === "report" ? "신고 사유" : "제한 사유";
  };

  const getResultLabel = () => {
    return type === "report" ? "처리 결과" : "제재 내용";
  };

  const getBottomMessage = () => {
    return type === "report"
      ? "신고해 주신 내용을 바탕으로 조치가 완료되었음을 안내드려요.\n소중한 협조에 감사드려요!"
      : "커뮤니티 규정을 준수하여 더 이상 제재가 발생하지 않도록 주의해 주세요. 제재에 이의가 있으시면 고객센터를 통해 문의해 주세요.";
  };

  const renderReportContent = () => {
    return (
      <>
        <InfoSection>
          <ContentTitle>{getReasonLabel()}</ContentTitle>
          <Value>{reason}</Value>
        </InfoSection>
        <InfoSection>
          <ContentTitle>{getResultLabel()}</ContentTitle>
          <Chip>{result}</Chip>
        </InfoSection>
      </>
    );
  };

  const renderRestrictionContent = () => {
    return (
      <InfoSection>
        <ContentTitle>{getReasonLabel()}</ContentTitle>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Value style={{ flex: 3 }}>{reason}</Value>
          <Chip style={{ flex: 1 }}>{result}</Chip>
        </div>
      </InfoSection>
    );
  };

  useEffect(() => {
    if (isOpen) {
      lockBodyScroll();
    }
    return () => {
      unlockBodyScroll();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <Overlay onClick={onClose}>
      <ModalWrapper onClick={(e) => e.stopPropagation()}>
        <Content>
          <MainMessage>{getMainMessage()}</MainMessage>
          {type === "report"
            ? renderReportContent()
            : renderRestrictionContent()}
          <BottomMessage>{getBottomMessage()}</BottomMessage>
        </Content>
        <ConfirmButton onClick={onClose}>확인</ConfirmButton>
      </ModalWrapper>
    </Overlay>,
    modalRoot
  );
};

export default ReportModal;

const Overlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  background: rgba(0, 0, 0, 0.6);
  inset: 0;
  z-index: ${theme.zIndex.popup};
`;

const ModalWrapper = styled.div`
  width: 540px;
  background: ${theme.colors.white};
  border-radius: 20px;
  overflow: hidden;

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 320px;
  }
`;

const Content = styled.div`
  display: flex;
  padding: 32px 40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  align-self: stretch;
  border-bottom: 1px solid ${theme.colors.gray400};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 32px 20px;
    gap: 8px;
  }
`;

const MainMessage = styled.div`
  ${theme.fonts.regular25};
  color: ${theme.colors.gray800};
  text-align: center;
  line-height: 1.5;
  @media (max-width: ${theme.breakpoints.mobile}) {
    ${theme.fonts.regular14}
  }
`;

const InfoSection = styled.div`
  display: flex;
  padding: 20px 28px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  align-self: stretch;
  border-radius: 12px;
  background: ${theme.colors.red100};
`;

const ContentTitle = styled.div`
  ${theme.fonts.medium16};
  color: ${theme.colors.red600};

  @media (max-width: ${theme.breakpoints.mobile}) {
    ${theme.fonts.medium14}
  }
`;

const Value = styled.div`
  ${theme.fonts.bold20};
  color: ${theme.colors.gray800};
  tex-align: center;

  @media (max-width: ${theme.breakpoints.mobile}) {
    ${theme.fonts.bold16}
  }
`;

const BottomMessage = styled.div`
  ${theme.fonts.regular18};
  color: ${theme.colors.gray800};
  text-align: center;
  white-space: pre-line;

  @media (max-width: ${theme.breakpoints.mobile}) {
    ${theme.fonts.regular13}
  }
`;

const ConfirmButton = styled.button`
  width: 100%;
  height: 79px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  border-radius: 0 0 20px 20px;
  ${theme.fonts.semiBold18};
  cursor: pointer;
  color: ${theme.colors.gray800};
`;

const Chip = styled.div`
  display: flex;
  padding: 0 6px;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  border: 1px solid ${theme.colors.gray700};
  ${theme.fonts.medium16};

  @media (max-width: ${theme.breakpoints.mobile}) {
    ${theme.fonts.medium13}
  }
`;

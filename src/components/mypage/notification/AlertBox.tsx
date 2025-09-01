import React, { useState } from "react";
import styled, { css } from "styled-components";

import { theme } from "@/styles/theme";
import { formatTimeAgo } from "@/utils";

import ReportModal from "./ReportModal";

interface AlertBoxProps {
  notificationId: number | undefined;
  notificationType: number | undefined;
  pageUrl: string | null | undefined;
  content: string | undefined;
  createdAt: string | undefined;
  read: boolean | undefined;
  size?: "small" | "medium";
  onClick: (
    notificationId: number | undefined,
    pageUrl: string | null | undefined
  ) => void;
}

const AlertBox: React.FC<AlertBoxProps> = ({
  notificationId,
  notificationType,
  pageUrl = "/",
  content,
  createdAt = "",
  read = false,
  size = "medium",
  onClick,
}) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleChangeRead = () => {
    if (notificationType === 4) {
      setIsReportModalOpen(true);
    } else {
      onClick(notificationId, pageUrl);
    }
  };

  const handleCloseModal = () => {
    setIsReportModalOpen(false);
    onClick(notificationId, null);
  };
  return (
    <>
      <Container $read={read} onClick={handleChangeRead} size={size}>
        <AlertImage size={size}>
          <StyledObject
            data={`/assets/images/notification/noti_${notificationType}.svg`}
            width={46}
            height={46}
            size={size}
          />
          <Read $read={read} size={size} type={notificationType || 0}></Read>
        </AlertImage>
        <Div>
          <Text size={size}>
            {notificationType === 4 ? "신고 및 제재 조치" : content}
          </Text>
          <Time size={size}>{formatTimeAgo(createdAt)}</Time>
        </Div>
      </Container>
      {notificationType === 4 && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={handleCloseModal}
          content={content || ""}
        />
      )}
    </>
  );
};

export default AlertBox;

const Container = styled.div<{ $read: boolean; size: string }>`
  width: 100%;
  border-radius: 10px;
  padding: 32px 23px;
  box-sizing: border-box;
  background: ${theme.colors.white};
  box-shadow: 0px 0px 16.8px 0px rgba(0, 0, 0, 0.15);
  display: flex;
  opacity: ${(props) => (props.$read ? 0.5 : 1)};
  cursor: pointer;

  ${(props) =>
    props.size === "small" &&
    css`
      padding: 22px 10px;
    `}

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 12px 20px;
  }
`;

const AlertImage = styled.div<{ size: string }>`
  min-width: 50px;
  min-height: 50px;
  position: relative;

  margin-right: 26px;

  @media (max-width: 1200px) {
    margin-right: 16px;
  }

  ${(props) =>
    props.size === "small" &&
    css`
      min-width: 38px;
      min-height: 38px;
      margin-right: 20px;
    `}
`;

const StyledObject = styled.object<{ size: string }>`
  width: 46px;
  height: 46px;
  background: ${theme.colors.gray300};
  border-radius: 100px;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;

  ${(props) =>
    props.size === "small" &&
    css`
      width: 33px;
      height: 33px;
    `}
`;

const Read = styled.div<{ $read: boolean; size: string; type: number }>`
  width: 10px;
  height: 10px;
  background: ${(props) =>
    props.type === 4 ? theme.colors.red600 : theme.colors.violet600};
  opacity: ${(props) => (props.$read ? 0 : 1)};
  border-radius: 100px;
  position: absolute;
  top: 5px;
  right: 5px;

  ${(props) =>
    props.size === "small" &&
    css`
      width: 7px;
      height: 7px;
    `}
`;

const Div = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

const Text = styled.div<{ size: string }>`
  color: ${theme.colors.gray800};
  ${(props) => props.theme.fonts.semiBold18};

  ${(props) =>
    props.size === "small" &&
    css`
      ${(props) => props.theme.fonts.semiBold14};
    `}

  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) => props.theme.fonts.semiBold14};
  }
`;

const Time = styled.div<{ size: string }>`
  color: ${theme.colors.gray500};
  ${(props) => props.theme.fonts.medium16};

  ${(props) =>
    props.size === "small" &&
    css`
      ${(props) => props.theme.fonts.medium11};
    `}

  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) => props.theme.fonts.medium11};
  }
`;

import { theme } from "@/styles/theme";
import { formatTimeAgo } from "@/utils/custom";
import React from "react";
import styled, { css } from "styled-components";

interface AlertBoxProps {
  notificationId: number;
  pageUrl: string | null;
  content: string;
  createdAt: string;
  read: boolean;
  size?: "small" | "medium";
  onClick: (notificationId: number, pageUrl: string | null) => void;
}

const AlertBox: React.FC<AlertBoxProps> = ({
  notificationId,
  pageUrl,
  content,
  createdAt,
  read,
  size = "medium",
  onClick,
}) => {
  const handleChangeRead = () => {
    onClick(notificationId, pageUrl);
  };
  return (
    <Container $read={read} onClick={handleChangeRead} size={size}>
      <AlertImage size={size}>
        <Round size={size}></Round>
        <Read $read={read} size={size}></Read>
      </AlertImage>
      <Div>
        <Text size={size}>{content}</Text>
        <Time size={size}>{formatTimeAgo(createdAt)}</Time>
      </Div>
    </Container>
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

const Round = styled.div<{ size: string }>`
  width: 46px;
  height: 46px;
  background: ${theme.colors.gray300};
  border-radius: 100px;
  position: absolute;
  top: 0;
  left: 0;

  ${(props) =>
    props.size === "small" &&
    css`
      width: 33px;
      height: 33px;
    `}
`;

const Read = styled.div<{ $read: boolean; size: string }>`
  width: 10px;
  height: 10px;
  background: ${theme.colors.purple100};
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
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.semiBold18};

  ${(props) =>
    props.size === "small" &&
    css`
      ${(props) => props.theme.fonts.semiBold14};
    `}
`;

const Time = styled.div<{ size: string }>`
  color: ${theme.colors.gray200};
  ${(props) => props.theme.fonts.medium16};

  ${(props) =>
    props.size === "small" &&
    css`
      ${(props) => props.theme.fonts.medium11};
    `}
`;

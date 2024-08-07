import { theme } from "@/styles/theme";
import React, { useState } from "react";
import styled, { css } from "styled-components";

interface AlertBoxProps {
  content: string;
  time: string;
  read: boolean;
  size?: "small" | "medium";
}

const AlertBox: React.FC<AlertBoxProps> = ({
  content,
  time,
  read: initialRead,
  size = "medium",
}) => {
  const [read, setRead] = useState(initialRead);

  const handleChangeRead = () => {
    !read && setRead((prevRead) => !prevRead);
  };

  return (
    <Container $read={read} onClick={handleChangeRead} size={size}>
      <AlertImage>
        <Round size={size}></Round>
        <Read size={size}></Read>
      </AlertImage>
      <Div>
        <Text size={size}>{content}</Text>
        <Time size={size}>{time} 전</Time>
      </Div>
    </Container>
  );
};

export default AlertBox;

const Container = styled.div<{ $read: boolean; size: string }>`
  width: 100%;
  height: 110px;
  border-radius: 10px;
  padding: 32px 23px;
  background: ${theme.colors.white};
  box-shadow: 0px 0px 16.8px 0px rgba(0, 0, 0, 0.15);
  display: flex;
  gap: 26px;
  opacity: ${(props) => (props.$read ? 0.5 : 1)};

  ${(props) =>
    props.size === "small" &&
    css`
      height: 80px;
      padding: 22px 10px;
    `}
`;

const AlertImage = styled.div`
  width: 46px;
  height: 46px;
  position: relative;
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

const Read = styled.div<{ size: string }>`
  width: 10px;
  height: 10px;
  background: ${theme.colors.purple100};
  border-radius: 100px;
  position: absolute;
  top: 2px;
  right: 2px;

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

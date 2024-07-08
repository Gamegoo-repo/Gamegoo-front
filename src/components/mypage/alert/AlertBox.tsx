import { theme } from "@/styles/theme";
import React, { useState } from "react";
import styled from "styled-components";

interface AlertBoxProps {
  content: string;
  time: string;
  read: boolean;
}

const AlertBox: React.FC<AlertBoxProps> = ({
  content,
  time,
  read: initialRead,
}) => {
  const [read, setRead] = useState(initialRead);

  const handleChangeRead = () => {
    !read && setRead((prevRead) => !prevRead);
  };

  return (
    <Container read={read} onClick={handleChangeRead}>
      <AlertImage>
        <Round></Round>
        <Read></Read>
      </AlertImage>
      <Div>
        <Text>{content}</Text>
        <Time>{time} 전</Time>
      </Div>
    </Container>
  );
};

export default AlertBox;

const Container = styled.div<{ read: boolean }>`
  width: 100%;
  height: 110px;
  border-radius: 10px;
  padding: 32px 23px;
  background: ${theme.colors.white};
  box-shadow: 0px 0px 16.8px 0px rgba(0, 0, 0, 0.15);
  display: flex;
  gap: 26px;
  opacity: ${(props) => (props.read ? 0.5 : 1)};
`;

const AlertImage = styled.div`
  width: 46px;
  height: 46px;
  position: relative;
`;

const Round = styled.div`
  width: 46px;
  height: 46px;
  background: ${theme.colors.gray300};
  border-radius: 100px;
  position: absolute;
  top: 0;
  left: 0;
`;

const Read = styled.div`
  width: 10px;
  height: 10px;
  background: ${theme.colors.purple100};
  border-radius: 100px;
  position: absolute;
  top: 2px;
  right: 2px;
`;

const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Text = styled.div`
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.semiBold18};
`;

const Time = styled.div`
  color: ${theme.colors.gray200};
  ${(props) => props.theme.fonts.medium16};
`;

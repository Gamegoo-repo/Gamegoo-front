"use client";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { useState } from "react";
import styled from "styled-components";

const Find = () => {
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState<boolean | undefined>(undefined);
  const [isSend, setIsSend] = useState(false);
  const [isPopup, setIsPopup] = useState(false);

  const emailRegEx =
    /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;

  const validateEmail = (email: string) => {
    setEmailValid(emailRegEx.test(email));
  };

  const handleSendEmail = () => {
    setIsSend(true);
    setIsPopup(true);
  };

  return (
    <Container>
      <Div>
        <Title>비밀번호 재설정하기</Title>
        <Input
          inputType="input"
          value={email}
          onChange={(value) => {
            setEmail(value);
            validateEmail(value);
          }}
          placeholder="이메일 주소"
          isValid={emailValid}
          disabled={isSend}
        />
        <Button
          buttonType="primary"
          text="비밀번호 재설정하기"
          onClick={handleSendEmail}
          disabled={!emailValid}
        />
        {/* {isPopup && <Popup/>} */}
      </Div>
    </Container>
  );
};

export default Find;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Div = styled.div`
  max-width: 467px;
  width: 100%;
  padding-top: 300px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 22px;
`;

const Title = styled.div`
  color: #44515c;
  ${(props) => props.theme.fonts.regular35};
`;

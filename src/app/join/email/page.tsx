"use client";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";

const Email = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [emailValid, setEmailValid] = useState<boolean | undefined>(undefined);
  const [isSend, setIsSend] = useState(false);

  const emailRegEx =
    /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;

  const validateEmail = (email: string) => {
    setEmailValid(emailRegEx.test(email));
  };

  const handleSendEmail = () => {
    setIsSend(true);
  };

  const handleSendCode = () => {
    router.push("/join/password");
  };

  return (
    <Div>
      <Label>이메일을 입력해주세요.</Label>
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
      {isSend && (
        <Input
          inputType="input"
          value={authCode}
          onChange={(value) => {
            setAuthCode(value);
          }}
          placeholder="인증 코드 입력"
        />
      )}
      {isSend ? (
        <Button buttonType="primary" text="확인" onClick={handleSendCode} />
      ) : (
        <Button
          buttonType="primary"
          text="인증코드 전송"
          onClick={handleSendEmail}
          disabled={!emailValid}
        />
      )}
    </Div>
  );
};

export default Email;

const Div = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

const Label = styled.div`
  color: #44515c;
  ${(props) => props.theme.fonts.regular25};
`;

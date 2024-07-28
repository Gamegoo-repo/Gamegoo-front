"use client";

import { sendAuth, sendEmail } from "@/api/join";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { emailRegEx } from "@/constants/regEx";
import {
  updateAuthStatus,
  updateEmail,
  updateEmailAuth,
} from "@/redux/slices/signInSlice";
import { theme } from "@/styles/theme";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

const Email = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState<string>("");
  const [emailValid, setEmailValid] = useState<boolean | undefined>(undefined);
  const [authCodeValid, setAuthCodeValid] = useState<boolean | undefined>(
    undefined
  );
  const [isSend, setIsSend] = useState(false);

  const validateEmail = (email: string) => {
    setEmailValid(emailRegEx.test(email));
  };

  const handleSendEmail = async () => {
    try {
      const response = await sendEmail({ email });
      console.log("인증코드 전송 성공:", response);
      setIsSend(true);
    } catch (error) {
      console.error("인증코드 전송 실패:", error);
      setEmailValid(false);
    }
  };

  const handleSendCode = async () => {
    try {
      const response = await sendAuth({ email, code: authCode });
      console.log("인증코드 확인 성공:", response);

      // Redux 상태 업데이트
      dispatch(updateEmail(email));
      dispatch(updateEmailAuth(authCode));
      dispatch(updateAuthStatus(true));

      setAuthCodeValid(true);
      router.push("/join/password");
    } catch (error) {
      setAuthCodeValid(false);
      console.error("인증코드 확인 실패:", error);
    }
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
          isValid={authCodeValid}
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
  color: ${theme.colors.gray700};
  ${(props) => props.theme.fonts.regular25};
`;

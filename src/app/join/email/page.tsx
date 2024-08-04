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
import { RootState } from "@/redux/store";
import { theme } from "@/styles/theme";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

  const emailRedux = useSelector((state: RootState) => state.signIn.email);
  const authCodeRedux = useSelector(
    (state: RootState) => state.signIn.emailAuth
  );
  const authStatusRedux = useSelector(
    (state: RootState) => state.signIn.authStatus
  );

  /* redux 업데이트 */
  useEffect(() => {
    setEmail(emailRedux);
    setAuthCode(authCodeRedux);
    setAuthCodeValid(authStatusRedux);
  }, [emailRedux, authCodeRedux, authStatusRedux]);

  const validateEmail = (email: string) => {
    setEmailValid(emailRegEx.test(email));
    if (emailRegEx.test(email)) {
      dispatch(updateEmail(email));
    }
  };

  const handleSendEmail = async () => {
    try {
      await sendEmail({ email });
      setAuthCode("");
      setAuthCodeValid(false);
      dispatch(updateEmailAuth(""));
      dispatch(updateAuthStatus(false));
      setIsSend(true);
    } catch (error) {
      setEmailValid(false);
    }
  };

  const handleSendCode = async () => {
    try {
      await sendAuth({ email, code: authCode });

      // Redux 상태 업데이트
      dispatch(updateEmail(email));
      dispatch(updateEmailAuth(authCode));
      dispatch(updateAuthStatus(true));

      setAuthCodeValid(true);
      router.push("/join/password");
    } catch (error) {
      setAuthCodeValid(false);
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
          setIsSend(false);
          validateEmail(value);
        }}
        placeholder="이메일 주소"
        isValid={emailValid}
      />
      {(isSend || authCodeRedux) && (
        <Input
          inputType="input"
          value={authCode}
          onChange={(value) => {
            setAuthCode(value);
            if (value.length === 5) {
              setAuthCodeValid(true);
            } else {
              setAuthCodeValid(false);
            }
          }}
          placeholder="인증 코드 입력"
          isValid={authCodeValid}
        />
      )}
      {isSend || authCodeRedux ? (
        <Button
          buttonType="primary"
          text="인증 완료"
          onClick={handleSendCode}
        />
      ) : (
        <Button
          buttonType="primary"
          text="인증코드 전송"
          onClick={handleSendEmail}
          disabled={!emailValid}
        />
      )}
      {isSend && (
        <ReButton onClick={handleSendEmail}>인증 코드 재전송</ReButton>
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

const ReButton = styled.button`
  color: ${theme.colors.purple100};
  ${(props) => props.theme.fonts.medium16};
  text-decoration-line: underline;
  text-align: left;
  margin-top: 10px;
`;

"use client";

import { sendEmail } from "@/api/password";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import {
  updateAuthStatus,
  updateEmail,
  updateEmailAuth,
} from "@/redux/slices/passwordSlice";
import { RootState } from "@/redux/store";
import { theme } from "@/styles/theme";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

const Find = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState<boolean | undefined>(undefined);

  const emailRedux = useSelector((state: RootState) => state.password.email);

  /* redux 업데이트 */
  useEffect(() => {
    setEmail(emailRedux);
    if (emailRedux.length !== 0) {
      validateEmail(emailRedux);
    }
  }, [emailRedux]);

  const emailRegEx =
    /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;

  const validateEmail = (email: string) => {
    setEmailValid(emailRegEx.test(email));
  };

  const handleSendEmail = async () => {
    try {
      await sendEmail({ email });
      dispatch(updateEmail(email));
      dispatch(updateEmailAuth(""));
      dispatch(updateAuthStatus(false));
    } catch (error) {
      setEmailValid(false);
    }
    router.push("/password/auth");
  };

  return (
    <Container>
      <Div>
        <Title>
          비밀번호 재설정하기
          <Sub>비밀번호 찾기를 위한 이메일 주소를 입력해주세요.</Sub>
        </Title>
        <Input
          inputType="input"
          value={email}
          onChange={(value) => {
            setEmail(value);
            validateEmail(value);
          }}
          placeholder="이메일 주소"
          isValid={emailValid}
        />
        <Button
          buttonType="primary"
          text="비밀번호 재설정하기"
          onClick={handleSendEmail}
          disabled={!emailValid}
        />
      </Div>
    </Container>
  );
};

export default Find;

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 140px);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Div = styled.div`
  max-width: 467px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 22px;
`;

const Title = styled.div`
  color: ${theme.colors.gray700};
  ${(props) => props.theme.fonts.regular35};
  margin-bottom: 13px;
`;

const Sub = styled.div`
  color: ${theme.colors.gray200};
  ${(props) => props.theme.fonts.regular18};
`;

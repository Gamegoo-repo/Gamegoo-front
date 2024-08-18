"use client";

import { sendAuth } from "@/api/password";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { theme } from "@/styles/theme";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import styled from "styled-components";
import {
  updateAuthStatus,
  updateEmailAuth,
} from "@/redux/slices/passwordSlice";

const Auth = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [auth, setAuth] = useState("");
  const [authValid, setAuthValid] = useState<boolean | undefined>(undefined);
  const [authStatus, setAuthStatus] = useState(false);
  const emailRedux = useSelector((state: RootState) => state.password.email);
  const authRedux = useSelector((state: RootState) => state.password.emailAuth);
  const authStatusRedux = useSelector(
    (state: RootState) => state.password.authStatus
  );

  /* 타이머 */
  const [timer, setTimer] = useState<number>(180);
  const [timerColor, setTimerColor] = useState<string>(theme.colors.purple100);

  useEffect(() => {
    setAuth(authRedux);
    if (authRedux.length !== 0) {
      validateAuth(authRedux);
    }
  }, [emailRedux, authRedux, authStatusRedux]);

  /* redux 업데이트 */
  useEffect(() => {
    setAuth(authRedux);
    setAuthStatus(authStatus);
  }, [authRedux, authStatus]);

  const validateAuth = (auth: string) => {
    if (auth.length === 5) {
      setAuthValid(true);
    } else {
      setAuthValid(false);
    }
  };

  /* 타이머 */
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    intervalId = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0) {
          clearInterval(intervalId);
          setAuthValid(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 타이머 색상 업데이트
    if (timer <= 30) {
      setTimerColor(theme.colors.error100);
    } else {
      setTimerColor(theme.colors.purple100);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [timer]);

  const handleSendCode = async () => {
    try {
      await sendAuth({ email: emailRedux, code: auth });
      setAuthValid(true);
      dispatch(updateEmailAuth(auth));
      dispatch(updateAuthStatus(true));
      router.push("/password/new");
    } catch (error) {
      setAuthValid(false);
    }
  };

  return (
    <Container>
      <Div>
        <Title>
          비밀번호 재설정하기
          <Sub>이메일로 전송된 인증 코드를 입력해주세요.</Sub>
        </Title>
        <CodeBox>
          <Input
            inputType="input"
            value={auth}
            onChange={(value) => {
              setAuth(value);
              validateAuth(value);
              console.log();
            }}
            placeholder="인증코드 입력"
            disabled={authStatusRedux}
            isValid={authValid}
            errorMsg=""
            checkIcon={false}
          />
          {!authStatusRedux && (
            <Timer color={timerColor}>{`${Math.floor(timer / 60)}:${String(
              timer % 60
            ).padStart(2, "0")}`}</Timer>
          )}
        </CodeBox>
        <Button
          buttonType="primary"
          text="인증 완료"
          onClick={handleSendCode}
          disabled={!authValid && !authStatusRedux}
        />
      </Div>
    </Container>
  );
};

export default Auth;

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

const CodeBox = styled.div`
  width: 100%;
  height: 58px;
  position: relative;
`;

const Timer = styled.div<{ color: string }>`
  position: absolute;
  top: 20px;
  right: 20px;
  transform: translate(0, -50%);
  font-size: 16px;
  color: ${(props) => props.color};
  margin-top: 10px;
`;

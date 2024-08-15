"use client";

import { sendAuth, sendJoinEmail } from "@/api/join";
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
import { useCallback, useEffect, useState } from "react";
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
  const [isSendClick, setIsSendClick] = useState(false);
  const [isSend, setIsSend] = useState(false);
  /* 타이머 */
  const [timer, setTimer] = useState<number>(180);
  const [timerColor, setTimerColor] = useState<string>(theme.colors.purple100);

  const emailRedux = useSelector((state: RootState) => state.signIn.email);
  const authCodeRedux = useSelector(
    (state: RootState) => state.signIn.emailAuth
  );
  const authStatusRedux = useSelector(
    (state: RootState) => state.signIn.authStatus
  );

  const handlePopState = useCallback(() => {
    setAuthCode("");
    setEmailValid(undefined);
    setAuthCodeValid(undefined);
    setIsSendClick(false);
    setIsSend(false);
    dispatch(updateEmailAuth(""));
    dispatch(updateAuthStatus(false));
  }, [dispatch, isSendClick, authStatusRedux]);

  /* 뒤로가기 이벤트 감지 */
  useEffect(() => {
    if (isSendClick && !authStatusRedux) {
      console.log(isSendClick, authStatusRedux);
      history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", handlePopState);
    }

    console.log(isSendClick, authStatusRedux);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [handlePopState, isSendClick, authStatusRedux]);

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
    setIsSendClick(true);
    try {
      await sendJoinEmail({ email });
      setAuthCode("");
      setAuthCodeValid(undefined);
      dispatch(updateEmailAuth(""));
      dispatch(updateAuthStatus(false));
      setIsSend(true);
      setTimer(180);
    } catch (error) {
      setEmailValid(false);
    }
  };

  /* 타이머 */
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isSend) {
      intervalId = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 0) {
            clearInterval(intervalId);
            setIsSend(false);
            setAuthCodeValid(false);
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
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isSend, timer]);

  const handleSendCode = async () => {
    if (authCodeRedux) {
      router.push("/join/password");
    } else {
      try {
        await sendAuth({ email, code: authCode });

        console.log("여기", email, authCode);
        // Redux 상태 업데이트
        dispatch(updateEmail(email));
        dispatch(updateEmailAuth(authCode));
        dispatch(updateAuthStatus(true));
        console.log("ㅎㅎ", authStatusRedux);

        setAuthCodeValid(true);
        router.push("/join/password");
      } catch (error) {
        setAuthCodeValid(false);
      }
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
          if (authCodeRedux) {
            setIsSend(false);
            dispatch(updateAuthStatus(false));
          }
        }}
        placeholder="이메일 주소"
        isValid={emailValid}
        disabled={isSend}
      />
      {isSend && !authCodeRedux && (
        <CodeBox>
          <Input
            inputType="input"
            value={authCode}
            onChange={(value) => {
              setAuthCode(value);
              if (value.length === 5) {
                setAuthCodeValid(true);
              } else if (value.length === 0) {
                setAuthCodeValid(undefined);
              } else {
                setAuthCodeValid(false);
              }
            }}
            placeholder="인증 코드 입력"
            isValid={authCodeValid}
            errorMsg=""
            checkIcon={false}
          />
          {!authCodeRedux && (
            <Timer color={timerColor}>{`${Math.floor(timer / 60)}:${String(
              timer % 60
            ).padStart(2, "0")}`}</Timer>
          )}
        </CodeBox>
      )}
      {isSend || authStatusRedux ? (
        <Button
          buttonType="primary"
          text="인증 완료"
          onClick={handleSendCode}
          disabled={!authCodeValid}
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

const ReButton = styled.button`
  color: ${theme.colors.purple100};
  ${(props) => props.theme.fonts.medium16};
  text-decoration-line: underline;
  text-align: left;
  margin-top: 10px;
`;

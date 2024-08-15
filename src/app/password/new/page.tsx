"use client";

import { resetPassword } from "@/api/password";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { RootState } from "@/redux/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

interface StyledValid {
  isLengthValid?: boolean;
  isMixValid?: boolean;
}

const New = () => {
  const router = useRouter();
  const [password, setPassword] = useState<string>("");
  const [repassword, setRepassword] = useState<string>("");
  const [passwordValid, setPasswordValid] = useState<boolean | undefined>(
    undefined
  );
  const [repasswordValid, setRepasswordValid] = useState<boolean | undefined>(
    undefined
  );

  const email = useSelector((state: RootState) => state.password.email);

  const passwordRegEx =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  let isLengthValid = password.length >= 8;
  let isMixValid =
    !!password.match(/[a-z]/) &&
    !!password.match(/[A-Z]/) &&
    !!password.match(/\d/) &&
    !!password.match(/[@$!%*?&]/);

  const validatePassword = (password: string) => {
    const isValid = passwordRegEx.test(password);
    setPasswordValid(isValid);
    if (isValid) {
      setPassword(password);
    }
  };

  const validateRepassword = (repassword: string) => {
    const isValid = repassword === password && repassword.length >= 8;
    setRepasswordValid(isValid);
  };

  const handleComplete = async () => {
    if (passwordValid && repasswordValid) {
      try {
        await resetPassword({ email, password });
        router.push("/");
      } catch {}
    }
  };

  return (
    <Container>
      <Div>
        <Title>신규 비밀번호 입력</Title>
        <Input
          inputType="password"
          value={password}
          onChange={(value) => {
            setPassword(value);
            validatePassword(value);
          }}
          placeholder="비밀번호"
          isValid={passwordValid}
        />
        <Valid>
          비밀번호 요구사항
          <Conditon isLengthValid={isLengthValid}>
            <Image
              src={
                isLengthValid
                  ? "/assets/icons/valid_check_purple.svg"
                  : "/assets/icons/valid_check_gray.svg"
              }
              width={8}
              height={5}
              alt="check"
            />
            8자리 이상
          </Conditon>
          <Conditon isMixValid={isMixValid}>
            <Image
              src={
                isMixValid
                  ? "/assets/icons/valid_check_purple.svg"
                  : "/assets/icons/valid_check_gray.svg"
              }
              width={8}
              height={5}
              alt="check"
            />
            영어, 숫자, 특수문자 포함 (대/소문자 구분)
          </Conditon>
        </Valid>
        <Input
          inputType="password"
          value={repassword}
          onChange={(value) => {
            setRepassword(value);
            validateRepassword(value);
          }}
          placeholder="비밀번호 재입력"
          isValid={repasswordValid}
        />
        <Button
          buttonType="primary"
          text="확인"
          onClick={handleComplete}
          disabled={!passwordValid || !repasswordValid}
        />
      </Div>
    </Container>
  );
};

export default New;

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
  padding-top: 140px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 22px;
`;

const Title = styled.div`
  color: #44515c;
  ${(props) => props.theme.fonts.regular35};
`;

const Valid = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  color: #737373;
  ${(props) => props.theme.fonts.semiBold14}
`;

const Conditon = styled.div<StyledValid>`
  display: flex;
  align-items: center;
  gap: 7px;
  ${(props) => props.theme.fonts.regular14}
  color: ${({ isLengthValid, isMixValid }) =>
    isLengthValid || isMixValid ? "#5A42EE" : "inherit"};
`;

"use client";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";

interface StyledValid {
  isLengthValid?: boolean;
  isMixValid?: boolean;
}
const Password = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [passwordValid, setPasswordValid] = useState<boolean | undefined>(
    undefined
  );
  const [repasswordValid, setRepasswordValid] = useState<boolean | undefined>(
    undefined
  );

  const passwordRegEx =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  let isLengthValid = password.length >= 8;
  let isMixValid =
    !!password.match(/[a-z]/) &&
    !!password.match(/[A-Z]/) &&
    !!password.match(/\d/) &&
    !!password.match(/[@$!%*?&]/);

  const validatePassword = (password: string) => {
    setPasswordValid(passwordRegEx.test(password));
  };

  const validateRepassword = (repassword: string) => {
    setRepasswordValid(repassword === password && repassword.length >= 8);
  };

  const handleSendPassword = () => {
    router.push("/join/summoner");
  };

  return (
    <Div>
      <Label>비밀번호 입력</Label>
      <Input
        inputType="password"
        value={password}
        onChange={(value) => {
          setPassword(value);
          validatePassword(value);
        }}
        placeholder="비밀번호"
      />
      <Valid>
        비밀번호 요구사항
        <Conditon isLengthValid={isLengthValid}>
          {isMixValid ? (
            <Image
              src="/assets/icons/valid_check_purple.svg"
              width={8}
              height={5}
              alt="check"
            />
          ) : (
            <Image
              src="/assets/icons/valid_check_gray.svg"
              width={8}
              height={5}
              alt="check"
            />
          )}
          8자리 이상
        </Conditon>
        <Conditon isMixValid={isMixValid}>
          {isMixValid ? (
            <Image
              src="/assets/icons/valid_check_purple.svg"
              width={8}
              height={5}
              alt="check"
            />
          ) : (
            <Image
              src="/assets/icons/valid_check_gray.svg"
              width={8}
              height={5}
              alt="check"
            />
          )}
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
      />
      <Button
        buttonType="primary"
        text="확인"
        onClick={handleSendPassword}
        disabled={!passwordValid || !repasswordValid}
      />
    </Div>
  );
};

export default Password;

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

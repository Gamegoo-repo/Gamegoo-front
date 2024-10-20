"use client";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { updatePassword } from "@/redux/slices/signInSlice";
import { RootState } from "@/redux/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

interface StyledValid {
  isLengthValid?: boolean;
  isMixValid?: boolean;
}
const Password = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [passwordValid, setPasswordValid] = useState<boolean | undefined>(
    undefined
  );
  const [repasswordValid, setRepasswordValid] = useState<boolean | undefined>(
    undefined
  );

  const passwordRedux = useSelector(
    (state: RootState) => state.signIn.password
  );

  /* redux 업데이트 */
  useEffect(() => {
    setPassword(passwordRedux);
  }, [passwordRedux]);

  const passwordRegEx =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&#^()])[A-Za-z\d@$!%*?&#^()]{8,16}$/;

  let isLengthValid = password.length >= 8 && password.length <= 16;
  let isMixValid =
    !!password.match(/[a-zA-Z]/) &&
    !!password.match(/\d/) &&
    !!password.match(/[@$!%*?&#^()]/);

  const validatePassword = (password: string) => {
    const isValid = passwordRegEx.test(password);
    setPasswordValid(isValid);
    if (isValid) {
      dispatch(updatePassword(password));
    }
  };

  const validateRepassword = (repassword: string) => {
    const isValid =
      repassword === password &&
      repassword.length >= 8 &&
      repassword.length <= 16;
    setRepasswordValid(isValid);
  };

  const handleSendPassword = () => {
    if (passwordValid && repasswordValid) {
      router.push("/join/summoner");
    }
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
          8자리 이상 ~ 16자리 이하
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

"use client";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";

const New = () => {
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

  const validatePassword = (password: string) => {
    setPasswordValid(passwordRegEx.test(password));
    console.log(password);
    passwordRegEx.test(password);
  };
  const validateRepassword = (repassword: string) => {
    setRepasswordValid(repassword === password && repassword.length >= 8);
  };

  const handleComplete = () => {
    router.push("/");
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
          placeholder="신규 비밀번호 입력"
          isValid={passwordValid}
        />
        <Input
          inputType="password"
          value={repassword}
          onChange={(value) => {
            setRepassword(value);
            validateRepassword(value);
          }}
          placeholder="신규 비밀번호 재입력"
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

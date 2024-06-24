"use client";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { theme } from "@/styles/theme";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";

const Find = () => {
  const router = useRouter();
  const [auth, setAuth] = useState("");
  const [authValid, setAuthValid] = useState<boolean | undefined>(undefined);
  const [isSend, setIsSend] = useState(false);

  const emailRegEx =
    /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;

  const validateAuth = (auth: string) => {
    if (auth.length === 6) {
      setAuthValid(true);
    } else {
      setAuthValid(false);
    }
  };

  const handleSendEmail = () => {
    setIsSend(true);
    router.push("/password/new");
  };

  return (
    <Container>
      <Div>
        <Title>
          비밀번호 재설정하기
          <Sub>이메일로 전송된 인증 코드를 입력해주세요.</Sub>
        </Title>
        <Input
          inputType="input"
          value={auth}
          onChange={(value) => {
            setAuth(value);
            validateAuth(value);
          }}
          placeholder="인증코드 입력"
          isValid={authValid}
          disabled={isSend}
          errorMsg="잘못된 인증 코드입니다."
        />
        <Button
          buttonType="primary"
          text="인증 완료"
          onClick={handleSendEmail}
          disabled={!authValid}
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

"use client";

import Button from "@/components/common/Button";
import FormModal from "@/components/common/FormModal";
import Input from "@/components/common/Input";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";

const Find = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState<boolean | undefined>(undefined);
  const [isSend, setIsSend] = useState(false);
  const [isPopup, setIsPopup] = useState(false);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [isLengthValid, setIsLengthValid] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);

  const emailRegEx =
    /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;

  const validateEmail = (email: string) => {
    setEmailValid(emailRegEx.test(email));
  };

  const handleSendEmail = () => {
    setIsSend(true);
    setIsPopup(true);
  };

  const validateNewPassword = (password: string) => {
    const lengthValid = password.length >= 8;
    const specialCharValid =
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*]/.test(password);
    setIsLengthValid(lengthValid);
    setHasSpecialChar(specialCharValid);
  };

  return (
    <Container>
      <Div>
        <Title>비밀번호 재설정하기</Title>
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
        <Button
          buttonType="primary"
          text="비밀번호 재설정하기"
          onClick={handleSendEmail}
          disabled={!emailValid}
        />
        {isPopup && (
          <FormModal
            type="text"
            title="비밀번호 재설정하기"
            width="492px"
            closeButtonWidth={17}
            closeButtonHeight={17}
            borderRadius="10px"
            buttonText="완료"
            onClose={() => {
              setIsPopup(false);
              router.push("/");
            }}
            disabled
          >
            <Content>
              <Input
                inputType="password"
                value={password}
                label="현재 비밀번호"
                onChange={(value) => {
                  setPassword(value);
                }}
                placeholder="현재 비밀번호 입력"
              />
              <Input
                inputType="password"
                value={newPassword}
                label="신규 비밀번호"
                onChange={(value) => {
                  setNewPassword(value);
                  validateNewPassword(value);
                }}
                placeholder="신규 비밀번호 입력"
                isValid={isLengthValid && hasSpecialChar}
              />
              {newPassword && (
                <Valid>
                  비밀번호 요구사항
                  <Span $selected={isLengthValid}>
                    {isLengthValid ? (
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
                  </Span>
                  <Span $selected={hasSpecialChar}>
                    {hasSpecialChar ? (
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
                  </Span>
                </Valid>
              )}
              <Input
                inputType="password"
                value={rePassword}
                onChange={(value) => {
                  setRePassword(value);
                }}
                placeholder="신규 비밀번호 재입력"
                isValid={newPassword.length > 0 && newPassword === rePassword}
              />
            </Content>
          </FormModal>
        )}
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
  color: #44515c;
  ${(props) => props.theme.fonts.regular35};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

const Valid = styled.div`
  color: #737373;
  font-size: ${theme.fonts.semiBold14};
  z-index: 10;
`;

const Span = styled.div<{ $selected: boolean }>`
  display: flex;
  gap: 7px;
  align-items: center;
  color: ${({ theme, $selected }) =>
    $selected ? theme.colors.purple100 : "#737373"};
  font-weight: 400;
`;

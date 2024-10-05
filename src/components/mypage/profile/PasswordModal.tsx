import { theme } from "@/styles/theme";
import styled from "styled-components";
import { useState } from "react";
import Image from "next/image";
import Input from "@/components/common/Input";
import FormModal from "@/components/common/FormModal";
import Button from "@/components/common/Button";
import { checkPassword, resetJwtPassword } from "@/api/password";

interface PasswordModalProps {
  onClose: () => void;
}
const PasswordModal = (props: PasswordModalProps) => {
  const { onClose } = props;

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [isLengthValid, setIsLengthValid] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  /* 현재 비밀번호 일치 여부 */
  const [isPasswordValid, setIsPasswordValid] = useState<boolean | undefined>();

  const validateNewPassword = (password: string) => {
    const lengthValid = password.length >= 8 && password.length <= 16;
    const specialCharValid =
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*]/.test(password);
    setIsLengthValid(lengthValid);
    setHasSpecialChar(specialCharValid);
  };

  /* 비밀번호 재설정 함수 */
  const handleChangePassword = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    try {
      await checkPassword(password);
      setIsPasswordValid(true);

      if (validation) {
        await resetJwtPassword(newPassword);
        onClose();
      } else {
        console.log("신규 비밀번호 확인 실패");
      }
    } catch (error) {
      setIsPasswordValid(false);
      console.log("현재 비밀번호가 일치하지 않습니다.");
    }
  };

  /* 현재 비밀번호 일치 여부 추가 */
  const validation =
    isLengthValid &&
    hasSpecialChar &&
    newPassword.length > 0 &&
    newPassword === rePassword;

  return (
    <FormModal
      type="text"
      title="비밀번호 재설정하기"
      width="492px"
      closeButtonWidth={17}
      closeButtonHeight={17}
      borderRadius="10px"
      onClose={onClose}
      disabled={!validation}
    >
      <Content>
        <Input
          inputType="password"
          value={password}
          label="현재 비밀번호"
          onChange={(value) => {
            setPassword(value);
            setIsPasswordValid(undefined);
          }}
          placeholder="현재 비밀번호 입력"
          isValid={isPasswordValid}
          errorMsg="비밀번호 불일치"
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
          isValid={
            newPassword === "" ? undefined : isLengthValid && hasSpecialChar
          }
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
          isValid={
            rePassword === ""
              ? undefined
              : newPassword.length > 0 && newPassword === rePassword
          }
        />
        <ButtonContent>
          <Button
            onClick={handleChangePassword}
            buttonType="primary"
            text="완료"
            disabled={!validation}
          />
        </ButtonContent>
      </Content>
    </FormModal>
  );
};

export default PasswordModal;

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

const ButtonContent = styled.div`
  margin-top: 34px;
`;

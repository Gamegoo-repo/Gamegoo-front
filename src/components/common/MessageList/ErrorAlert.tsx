import styled from "styled-components";

interface ErrorAlertProps {
  isUnregister: boolean;
}

const ErrorAlert = ({ isUnregister }: ErrorAlertProps) => (
  <ErrorBox>
    {isUnregister ? "탈퇴한 회원의 글입니다." : "차단한 회원의 글입니다."}
  </ErrorBox>
);

export default ErrorAlert;

const ErrorBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 10px 28px;
  ${(props) => props.theme.fonts.regular14};
  background: ${(props) => props.theme.colors.white};
  color: rgba(45, 45, 45, 1);
  box-shadow: 0 0 25.3px 0 rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  white-space: nowrap;
`;

"use client";

import Button from "@/components/common/Button";
import Checkbox from "@/components/common/Checkbox";
import Input from "@/components/common/Input";
import { theme } from "@/styles/theme";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailDisable, setEmailDisable] = useState(false);
  const [password, setPassword] = useState("");

  /* 이메일 존재 여부 검사 */
  // API 연동

  /* 이메일 수정하기 */
  const handleModify = () => {
    setEmailDisable(false);
  };

  /* 로그인 */
  const handleLogin = () => {
    router.push("/home");
  };

  return (
    <Container>
      <Box>
        <Image
          src="/assets/icons/logo_m.svg"
          width={277}
          height={88}
          alt="logo"
        />
        <Title>로그인</Title>
        <P>GAMGOO에 오신 것을 환영합니다.</P>
        <Content>
          <Div>
            <Input
              inputType="input"
              value={email}
              onChange={(value) => {
                setEmail(value);
              }}
              placeholder="이메일 주소"
              disabled={emailDisable}
            />
            {email && <Modify onClick={handleModify}>수정</Modify>}
            {email && (
              <Input
                inputType="password"
                value={password}
                onChange={(value) => {
                  setPassword(value);
                }}
                placeholder="비밀번호"
              />
            )}
            <Button
              buttonType="primary"
              text="이메일로 시작하기"
              onClick={handleLogin}
              disabled={!email}
            />
          </Div>
          <Check>
            <P>
              <Checkbox value="autoLogin"></Checkbox>
              자동 로그인
              <Bar />
              <Link href="/password/find">비밀번호 찾기</Link>
            </P>
          </Check>
        </Content>
        <Line />
        <SocialIcons>
          <Image
            src="/assets/icons/naver.svg"
            width={58}
            height={58}
            alt="naver"
          />
          <Image
            src="/assets/icons/kakao.svg"
            width={58}
            height={58}
            alt="kakao"
          />
          <Image
            src="/assets/icons/google.svg"
            width={58}
            height={58}
            alt="google"
          />
        </SocialIcons>
        <P>
          아직 GAMMGOO 회원이 아니신가요?{`   `}
          <Join href="/join/email">회원가입</Join>
        </P>
      </Box>
    </Container>
  );
};

export default Login;

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Box = styled.div`
  max-width: 540px;
  width: 100%;
  padding: 35px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.div`
  margin-top: 26px;
  color: #44515c;
  ${(props) => props.theme.fonts.regular35};
`;

const P = styled.div`
  display: flex;
  color: #737373;
  ${(props) => props.theme.fonts.regular14};
  gap: 10px;
`;

const Content = styled.div`
  width: 100%;
  margin-top: 49px;
`;

const Div = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 17px;
  position: relative;
`;

const Modify = styled.div`
  position: absolute;
  top: 30px;
  right: 20px;
  transform: translate(0, -50%);
  color: ${theme.colors.purple100};
  font-size: ${theme.fonts.semiBold14};
  z-index: 100;
  cursor: pointer;
`;

const Check = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 22px;
`;

const Bar = styled.div`
  width: 1px;
  height: 20px;
  background: #c5c5c7;
`;
const Line = styled.div`
  width: 100%;
  height: 1px;
  background: #d4d4d4;
  margin: 54px 0 74px 0;
`;

const SocialIcons = styled.div`
  width: 250px;
  display: flex;
  justify-content: space-around;
  margin-bottom: 57px;
`;

const Join = styled(Link)`
  color: #bcbcbc;
  font-weight: 500;
  text-decoration-line: underline;
`;

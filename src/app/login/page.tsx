"use client";

import { getUnreadUuid } from "@/api/chat";
import { postLogin } from "@/api/login";
import { socketLogin } from "@/api/socket";
import Button from "@/components/common/Button";
import Checkbox from "@/components/common/Checkbox";
import Input from "@/components/common/Input";
import { emailRegEx } from "@/constants/regEx";
import { setUnreadUuid } from "@/redux/slices/chatSlice";
import { setUserName, setUserProfileImg } from "@/redux/slices/userSlice";
import { theme } from "@/styles/theme";
import { clearTokens, setToken } from "@/utils/storage";
import { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailValid, setEmailValid] = useState<boolean | undefined>(undefined);
  const [passwordValid, setPasswordValid] = useState<boolean | undefined>(
    undefined
  );
  const [autoLogin, setAutoLogin] = useState(false);

  const validateEmail = (email: string) => {
    setEmailValid(emailRegEx.test(email));
  };

  const validatePassword = (password: string) => {
    if (password.length === 0) {
      setPasswordValid(undefined);
    } else {
      setPasswordValid(true);
    }
  };

  useEffect(() => {
    if (email.length !== 0) {
      validateEmail(email);
    } else if (password.length !== 0) {
      validatePassword(password);
    }
  }, [email, password]);

  /* 로그인 */
  const handleLogin = async () => {
    try {
      const response = await postLogin({ email, password });
      const accessToken = response.result.accessToken;
      const refreshToken = response.result.refreshToken;

      clearTokens();
      /* 자동 로그인 체크 여부에 따라 토큰 저장 위치 결정 */
      setToken(accessToken, refreshToken, autoLogin);

      /* 로켓 로그인 */
      socketLogin();
      console.log("???????????");
      const data = await getUnreadUuid();
      if (data.isSuccess) {
        // 실시간 안읽은 채팅방 수 가져오기 위함
        dispatch(setUnreadUuid(data.result));
        // 새로고침시 채팅방 수 가져오기 위함
        localStorage.setItem("unreadChatUuids", JSON.stringify(data.result));
      }

      dispatch(setUserName(response.result.name));
      dispatch(setUserProfileImg(response.result.profileImage));
      localStorage.setItem("name", response.result.name);
      localStorage.setItem("profileImg", response.result.profileImage);

      router.push("/");
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status === 401) {
          // 401 Unauthorized 처리
          setPasswordValid(false);
        } else {
          // 기타 에러 처리
          setEmailValid(false);
          setPasswordValid(false);
        }
      } else {
        // 예상치 못한 에러 처리
        setEmailValid(false);
        setPasswordValid(false);
      }
    }
  };

  return (
    <Container>
      <Box>
        <button
          onClick={() => {
            router.push("/");
          }}
        >
          <Image
            src="/assets/icons/logo_m.svg"
            width={277}
            height={88}
            alt="logo"
          />
        </button>
        <Title>로그인</Title>
        <P>GAMGOO에 오신 것을 환영합니다.</P>
        <Content>
          <Div>
            <InputList>
              <Input
                inputType="input"
                value={email}
                onChange={(value) => {
                  setEmail(value);
                  validateEmail(value);
                }}
                placeholder="이메일 주소"
                isValid={emailValid}
              />
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
            </InputList>
            <Button
              buttonType="primary"
              text="이메일로 시작하기"
              onClick={handleLogin}
              disabled={!email || !password || !emailValid || !passwordValid}
            />
          </Div>
          <Check>
            <P>
              <Checkbox
                value="autoLogin"
                isChecked={autoLogin}
                onChange={(isChecked) => setAutoLogin(isChecked)}
                gap="0px"
              />
              자동 로그인
              <Bar />
              <Link href="/password/find">비밀번호 찾기</Link>
            </P>
          </Check>
        </Content>
        <Line />
        {/* <SocialIcons>
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
        </SocialIcons> */}
        <P>
          아직 GAMMGOO 회원이 아니신가요?{`   `}
          <Join href="/join/terms">회원가입</Join>
        </P>
      </Box>
    </Container>
  );
};

export default Login;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Box = styled.div`
  max-width: 540px;
  width: 100%;
  padding: 35px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.div`
  margin-top: 26px;
  color: #44515c;
  ${(props) => props.theme.fonts.regular35};
`;

const Content = styled.div`
  width: 100%;
  margin-top: 49px;
`;

const P = styled.div`
  display: flex;
  color: ${theme.colors.gray200};
  ${(props) => props.theme.fonts.regular14};
  gap: 10px;
`;

const Div = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 17px;
  position: relative;
`;

const InputList = styled(Div)`
  gap: 8px;
`;

const Check = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 22px;
`;

const Bar = styled.div`
  width: 1px;
  height: 20px;
  background: ${theme.colors.gray300};
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  background: #d4d4d4;
  /* margin: 54px 0 74px 0; */
  margin: 30px 0 45px 0;
`;

const SocialIcons = styled.div`
  width: 250px;
  display: flex;
  justify-content: space-around;
  margin-bottom: 57px;
`;

const Join = styled(Link)`
  color: ${theme.colors.gray300};
  font-weight: 500;
`;

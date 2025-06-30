"use client";

import { getUnreadUuid } from "@/api/chat/chat";
import { postLogin } from "@/api/login/login";
import { socketLogin } from "@/api/socket";
import Button from "@/components/common/Button";
import Checkbox from "@/components/common/Checkbox";
import Input from "@/components/common/Input";
import { emailRegEx } from "@/constants/regEx";
import { STORAGE_KEY } from "@/constants/storage";
import { setUnreadUuid } from "@/redux/slices/chatSlice";
import { clearSignIn } from "@/redux/slices/signInSlice";
import {
  clearUserProfile,
  setUserName,
  setUserProfileImg,
  setUserId,
} from "@/redux/slices/userSlice";
import { theme } from "@/styles/theme";
import {
  clearTokens,
  setName,
  setProfileImg,
  setId,
} from "@/utils/storage";
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

  useEffect(() => {
    dispatch(clearSignIn());
    dispatch(clearUserProfile());
    clearTokens();
  }, []);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  /* 로그인 */
  const handleLogin = async () => {
    try {
      const response = await postLogin({ email, password });
      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken;

      /* 자동 로그인 체크 여부에 따라 토큰 저장 위치 결정 */
      const storage = autoLogin ? localStorage : sessionStorage;
      storage.setItem(STORAGE_KEY.accessToken, accessToken);
      storage.setItem(STORAGE_KEY.refreshToken, refreshToken);

      dispatch(setUserName(response.data.name));
      dispatch(setUserProfileImg(response.data.profileImage));
      dispatch(setUserId(response.data.id));
      setName(response.data.name, autoLogin);
      setProfileImg(response.data.profileImage, autoLogin);
      setId(response.data.id, autoLogin);

      router.push("/");

      socketLogin();

      /* 소켓 로그인 */
      const data = await getUnreadUuid();
      if (data.status === 200) {
        // 실시간 안읽은 채팅방 수 가져오기 위함
        dispatch(setUnreadUuid(data.data.data));
        // 새로고침시 채팅방 수 가져오기 위함
        sessionStorage.setItem(
          STORAGE_KEY.unreadChatUuids,
          JSON.stringify(data.data.data)
        );
      }
    } catch (error: any) {
      const data = error.response.data;
      if (error.response) {
        if (data.code === "MEMBER_401") {
          // 이메일이 DB에 없을 경우
          setEmailValid(false);
          setPasswordValid(false);
        } else if (data.code === "MEMBER_404") {
          // 비밀번호가 틀렸을 경우
          setPasswordValid(false);
        } else {
          // 기타 에러 처리
          setEmailValid(false);
          setPasswordValid(false);
        }
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
            src="/assets/icons/logo.svg"
            width={277}
            height={88}
            alt="logo"
          />
        </button>
        <Title>로그인</Title>
        <P>GAMEGOO에 오신 것을 환영합니다.</P>
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
                errorMsg="정보 불일치"
                placeholder="이메일 주소"
                isvalid={emailValid}
              />
              <Input
                inputType="password"
                value={password}
                onChange={(value) => {
                  setPassword(value);
                  validatePassword(value);
                }}
                errorMsg="정보 불일치"
                placeholder="비밀번호"
                isvalid={passwordValid}
                onKeyDown={handleKeyDown}
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
          아직 GAMEGOO 회원이 아니신가요?{`   `}
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
  color: ${theme.colors.gray800};
  ${(props) => props.theme.fonts.regular35};
`;

const Content = styled.div`
  width: 100%;
  margin-top: 49px;
`;

const P = styled.div`
  display: flex;
  color: ${theme.colors.gray500};
  ${(props) => props.theme.fonts.regular16};
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
  margin: 30px 0 45px 0;
`;

const SocialIcons = styled.div`
  width: 250px;
  display: flex;
  justify-content: space-around;
  margin-bottom: 57px;
`;

const Join = styled(Link)`
  color: ${theme.colors.gray700};
  font-weight: 500;
`;

"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import crypto from "crypto-js";
import { encode as base64urlEncode } from "js-base64";
import styled from "styled-components";

import Button from "@/components/common/Button";
import Checkbox from "@/components/common/Checkbox";
import { clearSignIn } from "@/redux/slices/signInSlice";
import { clearUserProfile } from "@/redux/slices/userSlice";
import { theme } from "@/styles/theme";
import { clearTokens } from "@/utils/storage";

const RiotLogin = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [autoLogin, setAutoLogin] = useState(false);

  useEffect(() => {
    dispatch(clearSignIn());
    dispatch(clearUserProfile());
    clearTokens();
  }, []);

  /* 로그인 */
  const handleLogin = async () => {
    // 라이엇 로그인으로 이동
    const csrfToken = crypto.lib.WordArray.random(16).toString();
    sessionStorage.setItem("csrfToken", csrfToken);

    const redirect = process.env.NEXT_PUBLIC_RIOT_REDIRECT_AFTER_LOGIN!;
    const state = {
      redirect,
      csrfToken,
    };
    const encodedState = base64urlEncode(JSON.stringify(state));

    const riotAuthUrl = process.env.NEXT_PUBLIC_RIOT_AUTH_URL!;
    const redirectUri = process.env.NEXT_PUBLIC_RIOT_REDIRECT_URI!;
    const clientId = process.env.NEXT_PUBLIC_RIOT_CLIENT_ID!;
    const responseType = process.env.NEXT_PUBLIC_RIOT_RESPONSE_TYPE!;
    const scope = process.env.NEXT_PUBLIC_RIOT_SCOPE!;

    const authUrl = `${riotAuthUrl}?redirect_uri=${encodeURIComponent(
      redirectUri
    )}&client_id=${clientId}&response_type=${responseType}&scope=${scope}&state=${encodeURIComponent(
      encodedState
    )}&prompt=login`;

    window.location.href = authUrl;
  };

  const handleDirectMain = () => {
    router.push("/");
  };

  return (
    <Layout>
      <Container>
        <Box>
          <Logo onClick={handleDirectMain}>
            <Image src="/assets/icons/logo.svg" fill alt="GAMEGOO" />
          </Logo>
          <P>GAMEGOO에 오신 것을 환영합니다.</P>
        </Box>
        <Box>
          <Title>{`서비스를 이용하려면\n라이엇 계정으로 로그인하세요`}</Title>
          <Content>
            <LoginButton>
              <Button
                buttonType="riot"
                text="라이엇 계정으로 시작하기"
                icon="/assets/icons/riot.svg"
                onClick={handleLogin}
              />
            </LoginButton>

            <Check>
              <Checkbox
                value="autoLogin"
                isChecked={autoLogin}
                onChange={(isChecked) => setAutoLogin(isChecked)}
                gap="0px"
              />
              자동 로그인
            </Check>
          </Content>
        </Box>
        <Box>
          <Line />
          <Join href="https://signup.kr.riotgames.com">
            라이엇 계정 만들기
            <Image
              src="/assets/icons/chevron_right.svg"
              width={16}
              height={16}
              alt=""
            />
          </Join>
        </Box>
      </Container>
    </Layout>
  );
};

export default RiotLogin;

const Logo = styled.button`
  position: relative;
  width: 374px;
  height: 87px;
  border-radius: 8px;
  margin-bottom: 16px;
  @media (max-width: 420px) {
    width: 234px;
    height: 40px;
    margin-bottom: 12px;
  }
`;

const Layout = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 420px) {
    width: 90%;
  }
`;

const Container = styled.div`
  width: 374px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Box = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const P = styled.p`
  color: ${theme.colors.gray500};
  ${theme.fonts.regular16};
  margin-bottom: 100px;
  @media (max-width: 420px) {
    font-size: 13px;
    margin-bottom: 70px;
  }
`;

const Title = styled.div`
  display: flex;
  color: ${theme.colors.gray800};
  ${theme.fonts.regular25};
  padding: 0 40px;
  margin-bottom: 36px;
  text-align: center;
  @media (max-width: 420px) {
    font-size: 18px;
    margin-bottom: 30px;
    letter-spacing: -1px;
  }
`;

const Content = styled.div`
  width: 100%;
`;

const LoginButton = styled.div`
  width: 374px;
  @media (max-width: 420px) {
    width: 272px;
    margin: 0 auto;
  }
`;
const Check = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
  margin-top: 28px;
  color: ${theme.colors.gray800};
  ${theme.fonts.regular16};
  @media (max-width: 420px) {
    font-size: 14px;
  }
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  background: ${theme.colors.gray300};
  margin: 80px 0 26px 0;
`;

const Join = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${theme.colors.gray800};
  ${theme.fonts.medium16};
`;

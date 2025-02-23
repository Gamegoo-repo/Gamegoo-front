"use client";

import Button from "@/components/common/Button";
import Checkbox from "@/components/common/Checkbox";
import { clearSignIn } from "@/redux/slices/signInSlice";
import { clearUserProfile } from "@/redux/slices/userSlice";
import { theme } from "@/styles/theme";
import { clearTokens } from "@/utils/storage";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

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
    // 추후 Riot 로그인 기능 구현
    router.push("/join/terms");
  };

  const handleDirectMain = () => {
    router.push("/");
  };

  return (
    <Layout>
      <Container>
        <Box>
          <button onClick={handleDirectMain}>
            <Image
              src="/assets/icons/logo.svg"
              width={318}
              height={87}
              alt="GAMEGOO"
            />
          </button>
          <P>GAMEGOO에 오신 것을 환영합니다.</P>
        </Box>
        <Box>
          <Title>{`서비스를 이용하려면\n라이엇 계정으로 로그인하세요`}</Title>
          <Content>
            <Button
              buttonType="riot"
              text="라이엇 계정으로 시작하기"
              icon="/assets/icons/riot.svg"
              width="374px"
              borderRadius="8px"
              onClick={handleLogin}
            />
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
            라이엇 계정을 보유하고 있지 않습니다
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

const Layout = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
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
`;

const Title = styled.div`
  display: flex;
  color: ${theme.colors.gray800};
  ${theme.fonts.regular25};
  padding: 0 40px;
  margin-bottom: 36px;
  text-align: center;
`;

const Content = styled.div`
  width: 100%;
`;

const Check = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
  margin-top: 28px;
  color: ${theme.colors.gray800};
  ${theme.fonts.regular16};
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

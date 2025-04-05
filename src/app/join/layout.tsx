"use client";

import { theme } from "@/styles/theme";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import styled from "styled-components";

const Layout = (props: any) => {
  const router = useRouter();

  const pathname = usePathname();
  const isTerm = pathname === "/join/terms";
  return (
    <Container>
      <Box>
        <Logo
          onClick={() => {
            router.push("/login");
          }}
        >
          <Image src="/assets/icons/logo.svg" fill alt="logo" />
        </Logo>

        <Title>{isTerm ? "이용 약관 동의" : "회원가입"}</Title>
        <Content>{props.children}</Content>
      </Box>
    </Container>
  );
};

export default Layout;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Box = styled.div`
  max-width: 468px;
  width: 100%;
  margin-top: 173px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  @media (max-width: 500px) {
    width: 90%;
  }
`;
const Logo = styled.button`
  position: relative;
  width: 318px;
  height: 88px;
  @media (max-width: 420px) {
    width: 186px;
    height: 46px;
  }
`;
const Title = styled.div`
  color: ${theme.colors.gray700};
  ${(props) => props.theme.fonts.light32};
  margin-bottom: 188px;
  @media (max-width: 420px) {
    ${(props) => props.theme.fonts.regular20};
    margin-bottom: 0;
  }
`;

const Content = styled.div`
  width: 100%;
  margin-top: 100px;
  height: 500px;
  display: flex;
  justify-content: flex-start;
`;

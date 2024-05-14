"use client";

import Image from "next/image";
import styled from "styled-components";

const Layout = (props: any) => {
  return (
    <Container>
      <Box>
        <Image
          src="/assets/icons/logo_m.svg"
          width={277}
          height={88}
          alt="logo"
        />
        <Title>회원가입</Title>
        <Content>{props.children}</Content>
      </Box>
    </Container>
  );
};

export default Layout;

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
  align-items: flex-start;
`;

const Title = styled.div`
  color: #44515c;
  ${(props) => props.theme.fonts.regular35};
`;

const Content = styled.div`
  width: 100%;
  height: 500px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

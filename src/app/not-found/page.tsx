"use client";

import Button from "@/components/common/Button";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import styled from "styled-components";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <Layout>
      <Error>
        <Image
          src="/assets/images/404_error.svg"
          width={389}
          height={92}
          alt="Not Found"
        />
        <P>Page not found</P>
      </Error>
      <Button
        buttonType="light"
        text="뒤로 가기"
        width="218px"
        onClick={() => router.back()}
      />
    </Layout>
  );
};

export default NotFoundPage;

const Layout = styled.div`
  width: 100%;
  height: 100%;
  padding: 315px 250px;
  display: flex;
  flex-direction: column;
  gap: 119px;
`;

const Error = styled.div`
  display: flex;
  flex-direction: column;
`;

const P = styled.p`
  color: ${theme.colors.gray700};
  ${(props) => props.theme.fonts.bold32};
`;

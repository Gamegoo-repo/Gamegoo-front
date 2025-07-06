"use client";

import { useEffect } from "react";

import styled from "styled-components";

import LoadingSpinner from "@/components/common/LoadingSpinner";

const Oauth = () => {
  useEffect(() => {
    const handleCallback = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const stateParam = url.searchParams.get("state");

      if (!code || !stateParam) {
        console.error("Missing code or state");
        return;
      }
    };

    handleCallback();
  }, []);
  return (
    <LoadingContainer>
      <LoadingSpinner />
    </LoadingContainer>
  );
};

export default Oauth;

const LoadingContainer = styled.div`
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
`;

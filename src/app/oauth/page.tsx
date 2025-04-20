"use client";

import axios from "axios";
import { useEffect } from "react";
import { decode as base64urlDecode } from "js-base64";

const Oauth = () => {
  // 기존 테스트용 코드
  // useEffect(() => {
  //   const getToken = async () => {
  //     const CODE = new URL(window.location.href).searchParams.get("code");
  //     try {
  //       const formData = new URLSearchParams();
  //       formData.append("grant_type", "authorization_code");
  //       formData.append("code", CODE || "");
  //       formData.append("redirect_uri", "https://www.gamegoo.co.kr/oauth");
  //       // const response = await axios.post(
  //       //   `https://auth.riotgames.com/token`,
  //       //   formData,
  //       //   {
  //       //     auth: {
  //       //       username: "43277efb-2a7d-488f-bb73-6c49c40d7099",
  //       //       password: "qMKnKBIxNY7QEAWM1tqPw12MM-55fNy2LGM4xeeQMiD",
  //       //     },
  //       //     headers: {
  //       //       "Content-Type": "application/x-www-form-urlencoded",
  //       //     },
  //       //   }
  //       // );
  //       const re
  //       console.log(response);
  //       console.log(response.data);
  //     } catch (error) {
  //       console.error(error);
  //       return;
  //     }
  //   };
  //   getToken();
  // });

  useEffect(() => {
    const handleCallback = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const stateParam = url.searchParams.get("state");

      if (!code || !stateParam) {
        console.error("Missing code or state");
        return;
      }

      try {
        const decodedState = JSON.parse(base64urlDecode(stateParam));
        const csrfInSession = sessionStorage.getItem("csrfToken");

        if (decodedState.csrfToken !== csrfInSession) {
          console.error("CSRF token mismatch");
          return;
        }

        // 백엔드로 code와 state 전달 (GET)
        await axios.get(`/api/v2/riot/oauth/callback`, {
          params: {
            code,
            state: stateParam,
          },
        });
      } catch (err) {
        console.error("OAuth 처리 실패:", err);
      }
    };

    handleCallback();
  }, []);
  return <div>테스트</div>;
};

export default Oauth;

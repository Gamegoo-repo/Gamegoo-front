"use client";

import axios from "axios";
import { useEffect } from "react";

const Oauth = () => {
  useEffect(() => {
    const getToken = async () => {
      const CODE = new URL(window.location.href).searchParams.get("code");
      try {
        const formData = new URLSearchParams();
        formData.append("grant_type", "authorization_code");
        formData.append("code", CODE || "");
        formData.append("redirect_uri", "https://www.gamegoo.co.kr/oauth");
        const response = await axios.post(
          `https://auth.riotgames.com/token`,
          formData,
          {
            auth: {
              username: "43277efb-2a7d-488f-bb73-6c49c40d7099",
              password: "qMKnKBIxNY7QEAWM1tqPw12MM-55fNy2LGM4xeeQMiD",
            },
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        console.log(response);
        console.log(response.data);
      } catch (error) {
        console.error(error);
        return;
      }
    };
    getToken();
  });
  return <div>테스트</div>;
};

export default Oauth;

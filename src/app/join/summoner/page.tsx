"use client";

import { checkRiot, joinMember } from "@/api/join";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { RootState } from "@/redux/store";
import { theme } from "@/styles/theme";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

interface RiotErrorResponse {
  isSuccess: boolean;
  code: string;
  message: string;
}

const Summoner = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");

  const email = useSelector((state: RootState) => state.signIn.email);
  const password = useSelector((state: RootState) => state.signIn.password);

  const [isCheckRiot, setIsCheckRiot] = useState<boolean | undefined>(
    undefined
  );
  const [errorMsg, setErrorMsg] = useState("");

  const summonerNameRedux = useSelector(
    (state: RootState) => state.signIn.summonerName
  );
  const summonerTagRedux = useSelector(
    (state: RootState) => state.signIn.summonerTag
  );

  /* redux 업데이트 */
  useEffect(() => {
    setName(summonerNameRedux);
    setTag(summonerTagRedux);
  }, [summonerNameRedux, summonerTagRedux]);

  /* input focus out 시 소환사명 조회 */
  const handleCheckSummoner = async () => {
    console.log("소환사명 조회(onBlur)");
    try {
      await checkRiot({ gameName: name, tag });
      setIsCheckRiot(true);
      setErrorMsg("");
    } catch (err) {
      const error = err as AxiosError<RiotErrorResponse>;
      setIsCheckRiot(false);
      setErrorMsg(
        error.response?.data?.message || "소환사명 인증에 실패했습니다."
      );
    }
  };

  /* input 변경 시마다 소환사명 조회 */
  // useEffect(() => {
  //   const checkSummoner = async () => {
  //     try {
  //       await checkRiot({ gameName: name, tag });
  //       setIsCheckRiot(true);
  //     } catch (error) {
  //       setIsCheckRiot(false);
  //     }
  //   };

  //   if (name !== "" && tag !== "") {
  //     checkSummoner();
  //     console.log("소환사명 조회(useEffect)");
  //   }
  // }, [name, tag]);

  const handleSendJoin = async () => {
    console.log(email, password);
    if (!email || !password) {
      setErrorMsg("이메일과 비밀번호를 다시 입력해주세요.");
      return;
    }

    if (isCheckRiot) {
      try {
        await joinMember({
          email,
          password,
          gameName: name,
          tag,
        });
        router.push("/");
      } catch (err) {
        const error = err as AxiosError<RiotErrorResponse>;
        console.error(error.response?.data?.message);
        setErrorMsg(
          error.response?.data?.message ||
            "회원가입에 실패했습니다. 다시 시도해주세요."
        );
      }
    } else {
      setErrorMsg("소환사명을 인증해주세요.");
    }
  };

  return (
    <Div>
      <Label>소환사명 인증하기</Label>
      <Row>
        <Input
          inputType="input"
          value={name}
          onChange={(value) => {
            setName(value);
          }}
          onBlur={handleCheckSummoner}
          placeholder="소환사명"
          isValid={isCheckRiot}
        />
        <Input
          inputType="input"
          value={tag}
          onBlur={handleCheckSummoner}
          onChange={(value) => {
            setTag(value);
          }}
          placeholder="소환사 태그 (예시 : #KR1)"
          isValid={isCheckRiot}
        />
      </Row>
      <Error>{errorMsg}</Error>
      <Button
        buttonType="primary"
        text="회원가입 완료"
        onClick={handleSendJoin}
      />
    </Div>
  );
};

export default Summoner;

const Div = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

const Label = styled.div`
  color: #44515c;
  ${(props) => props.theme.fonts.regular25};
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  gap: 15px;
`;

const Error = styled.div`
  height: 15px;
  color: ${theme.colors.error100};
  ${(props) => props.theme.fonts.regular12}
`;

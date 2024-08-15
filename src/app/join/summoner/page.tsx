"use client";

import { checkRiot, joinMember } from "@/api/join";
import Button from "@/components/common/Button";
import ConfirmModal from "@/components/common/ConfirmModal";
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
  const [isCheckRiotModal, setIsCheckRiotModal] = useState<boolean>(false);
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

  /* 소환사명 조회 */
  const handleCheckSummoner = async () => {
    try {
      await checkRiot({ gameName: name, tag });
      setIsCheckRiotModal(true);
      setIsCheckRiot(true);
      setErrorMsg("");
    } catch (err) {
      const error = err as AxiosError<RiotErrorResponse>;
      console.log(error);
      if (error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("소환사명 인증에 실패했습니다");
      }
    }
  };

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
        console.log(error);
        if (error) {
          setErrorMsg(error.message);
        } else {
          setErrorMsg("회원가입에 실패했습니다. 다시 시도해주세요.");
        }
      }
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
            setIsCheckRiot(undefined);
            setErrorMsg("");
          }}
          placeholder="소환사명"
          errorMsg=""
          isValid={isCheckRiot}
        />
        <Input
          inputType="input"
          value={tag}
          onChange={(value) => {
            setTag(value);
            setIsCheckRiot(undefined);
            setErrorMsg("");
          }}
          placeholder="소환사 태그 (예시 : #KR1)"
          tag={true}
          errorMsg=""
          isValid={isCheckRiot}
        />
      </Row>
      <Error>{errorMsg}</Error>
      {isCheckRiot ? (
        <Button
          buttonType="primary"
          text="회원가입 완료"
          onClick={handleSendJoin}
        />
      ) : (
        <Button
          buttonType="primary"
          text="확인"
          onClick={handleCheckSummoner}
          disabled={!name || !tag}
        />
      )}
      {isCheckRiotModal && (
        <ConfirmModal
          width="540px"
          primaryButtonText="확인"
          onPrimaryClick={() => setIsCheckRiotModal(false)}
        >
          소환사명 인증이 완료되었습니다.
        </ConfirmModal>
      )}
    </Div>
  );
};

export default Summoner;

const Div = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Label = styled.div`
  color: #44515c;
  ${(props) => props.theme.fonts.regular25};
  margin-bottom: 22px;
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  gap: 15px;
  margin-bottom: 6px;
`;

const Error = styled.div`
  height: 15px;
  color: ${theme.colors.error100};
  ${(props) => props.theme.fonts.regular12};
  margin-left: 18px;
  margin-bottom: 15px;
`;

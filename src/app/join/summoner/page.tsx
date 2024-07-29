"use client";

import { joinMember } from "@/api/join";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

const Summoner = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");

  const email = useSelector((state: RootState) => state.signIn.email);
  const password = useSelector((state: RootState) => state.signIn.password);

  const handleSendJoin = async () => {
    if (!email || !password) {
      console.log("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      await joinMember({ email, password });
      router.push("/");
    } catch (error) {}
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
          placeholder="소환사명"
        />
        <Input
          inputType="input"
          value={tag}
          onChange={(value) => {
            setTag(value);
          }}
          placeholder="소환사 태그 (예시 : #KR1)"
        />
      </Row>
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

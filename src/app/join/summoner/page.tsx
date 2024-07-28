"use client";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";

const Summoner = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");

  const handleSendSummoner = async () => {
    router.push("/");
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
        onClick={handleSendSummoner}
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

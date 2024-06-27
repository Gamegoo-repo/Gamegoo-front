"use client";

import styled from "styled-components";
import { theme } from "@/styles/theme";
import Input from "@/components/common/Input";

const updateDate = "24.05.08";
const MyProfilePage = () => {
  return (
    <Wrapper>
      <MyProfileContent>
        <Profile>
          <Title>내 프로필</Title>
        </Profile>
        <Private>
          <Title>개인정보</Title>
          <Small>{`마지막 업데이트 : ${updateDate}`}</Small>
          <Input
            label="이메일"
            value="email"
            placeholder="이메일"
            onChange={() => {}}
          />
        </Private>
      </MyProfileContent>
    </Wrapper>
  );
};

export default MyProfilePage;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const MyProfileContent = styled.div`
  max-width: 1440px;
  width: 100%;
  padding: 0 80px;
`;

const Profile = styled.header`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
  margin-bottom: 32px;
`;

const Private = styled.header`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  ${(props) => props.theme.fonts.bold25};
  color: ${theme.colors.gray700};
`;

const Small = styled.h1`
  ${(props) => props.theme.fonts.bold11};
  color: ${theme.colors.gray800};
`;

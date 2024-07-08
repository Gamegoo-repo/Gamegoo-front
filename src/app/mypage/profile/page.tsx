"use client";

import styled from "styled-components";
import { theme } from "@/styles/theme";
import Input from "@/components/common/Input";
import MyPageProfile from "@/components/mypage/profile/MyPageProfile";

const userData = {
  image: "/assets/images/profile.svg",
  account: "유니콘의 비밀",
  tag: "KR1",
  tier: "B3",
  manner_level: 5,
  mic: true,
  gameStyle: [
    "이기기만 하면 뭔들",
    "과도한 핑은 사절이에요",
    "랭크 올리고 싶어요",
  ],
};

const updateDate = "24.05.08";
const MyProfilePage = () => {
  return (
    <Wrapper>
      <MyProfileContent>
        <Profile>
          <Title>내 프로필</Title>
          <MyPageProfile user={userData} />
        </Profile>
        <Private>
          <Title>
            개인정보
            <Small>{`마지막 업데이트 : ${updateDate}`}</Small>
          </Title>
          <PrivateContent>
            <Input
              label="이메일"
              value="reen330@naver.com"
              placeholder="이메일"
              onChange={() => {}}
            />
            {/* 비밀번호 */}
            <Input
              label="비밀번호"
              inputType="password"
              value="비밀번호"
              placeholder="비밀번호"
              onChange={() => {}}
            />
          </PrivateContent>
        </Private>
        <P>회원탈퇴</P>
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
  gap: 26px;
  margin-bottom: 53px;
`;

const Private = styled.header`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
  gap: 35px;
  margin-bottom: 80px;
`;

const Title = styled.h1`
  display: flex;
  align-items: flex-end;
  gap: 22px;
  ${(props) => props.theme.fonts.bold25};
  color: ${theme.colors.gray700};
`;

const Small = styled.h1`
  ${(props) => props.theme.fonts.bold11};
  color: ${theme.colors.gray800};
  margin-bottom: 5px;
`;

const PrivateContent = styled(Private)`
  gap: 31px;
`;

const P = styled.div`
  ${(props) => props.theme.fonts.bold14};
  color: ${theme.colors.gray200};
  text-decoration-line: underline;
`;

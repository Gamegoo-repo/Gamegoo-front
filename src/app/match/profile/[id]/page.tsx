"use client";

import Image from "next/image";
import styled from "styled-components";
import { useParams, useRouter } from "next/navigation";
import Profile from "@/components/match/Profile";

const UserProfile = () => {
  const router = useRouter();
  const params = useParams();
  const id = +params.id;

  return (
    <Wrapper>
      <MatchContent>
        <Header>
          <StyledImage
            onClick={() => router.back()}
            src="/assets/icons/left_arrow.svg"
            width={20}
            height={39}
            alt="back button"
          />
          <Title>장시은 님의 프로필</Title>
        </Header>
        <Main>
          <Profile profileType="hard" />
          <Title>장시은 님의 매너레벨</Title>
          <Title>매너 키워드</Title>
          <Title>비매너 키워드</Title>
        </Main>
      </MatchContent>
    </Wrapper>
  );
};

export default UserProfile;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const MatchContent = styled.div`
  max-width: 1440px;
  width: 100%;
  padding: 0 80px;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 32px;
`;

const StyledImage = styled(Image)`
  margin-right: 35px;
  cursor: pointer;
`;

const Title = styled.h1`
  ${(props) => props.theme.fonts.bold32};
  color: #393939;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
  gap: 14px;
  margin-bottom: 37px;
`;

"use client";

import ChatBox from "@/components/common/ChatBox";
import Image from "next/image";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import Profile from "@/components/match/Profile";
import Button from "@/components/common/Button";

const GameModePage = () => {
  const router = useRouter();

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
          <Title>프로필 설정</Title>
        </Header>
        <Main>
          <Profile profileType="hard" />
          <Button
            buttonType="primary"
            width="380px"
            text="매칭 시작하기"
            onClick={() => {
              router.push("/matching/progress");
            }}
          />
        </Main>
        <Footer>
          <ChatBoxContent>
            <ChatBox count={3} />
          </ChatBoxContent>
        </Footer>
      </MatchContent>
    </Wrapper>
  );
};

export default GameModePage;

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

const Footer = styled.footer`
  display: flex;
  margin-bottom: 78px;
`;

const ChatBoxContent = styled.div`
  margin-left: auto;
  margin-bottom: 37px;
`;

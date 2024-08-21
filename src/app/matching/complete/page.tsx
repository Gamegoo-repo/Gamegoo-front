"use client";

import styled from "styled-components";
import HeaderTitle from "@/components/common/HeaderTitle";
import SquareProfile from "@/components/match/SquareProfile";
import Button from "@/components/common/Button";
import { theme } from "@/styles/theme";
import { useRouter } from "next/navigation";
import ChatButton from "@/components/common/ChatButton";

const Progress = () => {
  const router = useRouter();
  return (
    <Wrapper>
      <MatchContent>
        <HeaderTitle title="매칭 완료" sub="듀오 상대를 찾았어요!" />
        <Main>
          <SquareProfile />
          <Oppnent>
            <SquareProfile opponent={true} />
            <Button
              buttonType="secondary"
              text="매칭 다시하기"
              onClick={() => router.push("/matching/progress")}
            />
            <Text>10초 뒤 자동으로 대화방이 생성됩니다.</Text>
          </Oppnent>
        </Main>
        <Footer>
          <ChatBoxContent>
            <ChatButton count={3} />
          </ChatBoxContent>
        </Footer>
      </MatchContent>
    </Wrapper>
  );
};

export default Progress;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 140px;
`;

const MatchContent = styled.div`
  max-width: 1440px;
  width: 100%;
  padding: 0 80px;
`;

const Main = styled.main`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: flex-start;
  width: 100%;
  gap: 72px;
  margin-bottom: 37px;
`;

const Oppnent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 17px;
`;

const Text = styled.div`
  color: ${theme.colors.purple100};
  ${(props) => props.theme.fonts.regular18};
`;

const Footer = styled.footer`
  display: flex;
  margin-bottom: 78px;
`;

const ChatBoxContent = styled.div`
  margin-left: auto;
`;

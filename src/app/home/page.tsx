"use client";

import ChatButton from "@/components/common/ChatButton";
import { useRouter } from "next/navigation";
import { MATCH_PAGE_DATA } from "@/data/match";
import Image from "next/image";
import styled from "styled-components";
import { theme } from "@/styles/theme";

const HomePage = () => {
  const router = useRouter();

  return (
    <Wrapper>
      <HomeContent>
        <Header>
          <Image
            src="/assets/icons/logo_m.svg"
            width={371}
            height={117}
            priority
            alt="logo"
          />
          <SubTitle>겜구 커뮤니티에 오신 것을 환영합니다.</SubTitle>
        </Header>
        <Main>
          {MATCH_PAGE_DATA.map((content) => {
            return (
              <ContentWrapper
                key={content.id}
              >
                <StyledImage
                  onClick={() => router.push(content.pathname)}
                  src={content.image}
                  width={0}
                  height={0}
                  style={{ width: '93%', height: 'auto' }}
                  alt={content.title}
                  priority
                />
                <ContentTitle>{content.title}</ContentTitle>
              </ContentWrapper>
            );
          })}
        </Main>
        <Footer>
          <ChatBoxContent>
            <ChatButton count={3} />
          </ChatBoxContent>
        </Footer>
      </HomeContent>
    </Wrapper>
  );
};

export default HomePage;

const Wrapper = styled.div`
  width: 100%;
  /* display: flex;
  justify-content: center; */
  padding-top: 140px;
`;

const HomeContent = styled.div`
  max-width: 1440px;
  width: 100%;
  padding: 0 80px;
`;

const Header = styled.header`
  margin-bottom: 52px;
`;

const SubTitle = styled.div`
  ${(props) => props.theme.fonts.regular25};
  color: #44515c;
`;

const Main = styled.main`
  display: flex;
`;

const ContentWrapper = styled.div`
  position: relative;
`;

const StyledImage = styled(Image)`
  cursor: pointer;
`;

const ContentTitle = styled.p`
  position: absolute;
  top:50%;
  left: 50%;
  transform: translate(-50%, -50%);
  ${(props) => props.theme.fonts.bold32};
  color: ${theme.colors.white};
`;

const Footer = styled.footer`
  display: flex;
  margin-bottom: 78px;
`;

const ChatBoxContent = styled.div`
  margin-left: auto;
`;

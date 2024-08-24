"use client";

import ChatButton from "@/components/common/ChatButton";
import { useRouter } from "next/navigation";
import { MATCH_PAGE_DATA } from "@/data/match";
import Image from "next/image";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { socket } from "@/socket";
import { ConnectionManager } from "@/components/common/ConnectionManager";

const HomePage = () => {
  const router = useRouter();

  const isUser = useSelector((state: RootState) => state.user);

  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      console.log(socket.id)
      const socketId = socket.id || ''
      localStorage.setItem('gamegooSocketId', socketId)
    }

    function onDisconnect() {
      setIsConnected(false);
    }


    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);


    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);


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
          <ConnectionManager />
        </Header>
        <Main>
          {MATCH_PAGE_DATA.map((content) => {
            return (
              <ContentWrapper
                key={content.id}
                onClick={() => router.push(content.pathname)}
              >
                <Image
                  src={content.image}
                  width={0}
                  height={0}
                  style={{ width: "100%", height: "100%" }}
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
  display: flex;
  justify-content: center;
  padding-top: 140px;
`;

const HomeContent = styled.div`
  max-width: 1440px;
  width: 100%;
  padding: 0px 80px;
`;

const Header = styled.header`
  margin-bottom: 35px;
`;

const SubTitle = styled.div`
  ${(props) => props.theme.fonts.regular25};
  color: #44515c;
`;

const Main = styled.main`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 59px;
  margin-bottom: 37px;

  @media (max-width: 1200px) {
    flex-direction: column;
    justify-content: center;
  }
`;

const ContentWrapper = styled.div`
  max-width: 600px;
  position: relative;
  cursor: pointer;
`;

const ContentTitle = styled.p`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  ${(props) => props.theme.fonts.bold32};
  color: ${theme.colors.white};
  white-space: nowrap;
`;

const Footer = styled.footer`
  display: flex;
  margin-bottom: 78px;
`;

const ChatBoxContent = styled.div`
  margin-left: auto;
`;

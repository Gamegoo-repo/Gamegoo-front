import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import styled from "styled-components";

import { STORAGE_KEY } from "@/constants/storage";
import { useMediaQueryContext } from "@/hooks";
import { toggleChat } from "@/redux/slices/chatSlice";
import { theme } from "@/styles/theme";

import Layout from "../chat/Layout";
import Alert from "./Alert";

import type { RootState } from "@/redux/store";

const ChatButton = () => {
  const { isMobile } = useMediaQueryContext();
  const [showAlert, setShowAlert] = useState(false);
  const [unreadChatUuids, setUnreadChatUuids] = useState<string[]>([]);
  const [chatCount, setChatCount] = useState<number>(0);

  const isUser = useSelector((state: RootState) => state.user);
  const isChatOpen = useSelector((state: RootState) => state.chat.isChatOpen);

  const dispatch = useDispatch();

  useEffect(() => {
    const localUnreadChatUuids = sessionStorage.getItem(
      STORAGE_KEY.unreadChatUuids
    );
    if (localUnreadChatUuids && localUnreadChatUuids !== "undefined") {
      setUnreadChatUuids(JSON?.parse(localUnreadChatUuids));
    }
  }, []);

  useEffect(() => {
    setChatCount(unreadChatUuids?.length || 0);
  }, [unreadChatUuids]);

  /* sessionStorage가 변경되면 상태 업데이트 */
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY.unreadChatUuids) {
        const updatedUnreadUuids = event.newValue
          ? JSON.parse(event.newValue)
          : [];
        setUnreadChatUuids(updatedUnreadUuids);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleToggleChat = () => {
    if (!isUser.gameName) {
      return setShowAlert(true);
    }
    dispatch(toggleChat());
    // dispatch(resetPosition());
  };

  return (
    <>
      {showAlert && (
        <Alert
          icon="exclamation"
          width={68}
          height={58}
          content="로그인이 필요한 서비스입니다."
          alt="경고"
          onClose={() => setShowAlert(false)}
          buttonText="확인"
        />
      )}
      {isChatOpen && <Layout />}
      {isMobile ? (
        <MoMsgIconWrapper onClick={handleToggleChat}>
          <Image
            src="/assets/icons/chat.svg"
            width={30}
            height={30}
            alt="logo"
          />
          <MoMsgCount>
            <MoCount>{chatCount}</MoCount>
          </MoMsgCount>
        </MoMsgIconWrapper>
      ) : (
        <MsgButton onClick={handleToggleChat}>
          <Image
            src="/assets/icons/chat_box.svg"
            width={36}
            height={34}
            alt="채팅"
          />
          <MsgCount>
            <Count>{chatCount}</Count>
          </MsgCount>
        </MsgButton>
      )}
    </>
  );
};

export default ChatButton;

const MoMsgIconWrapper = styled.div`
  position: relative;
`;

const MoMsgCount = styled.div`
  position: absolute;
  top: 0;
  right: 5px;
  width: 14px;
  height: 14px;
  line-height: 0%;
  background: ${theme.colors.violet600};
  border-radius: 50%;
`;
const MoCount = styled.p`
  ${(props) => props.theme.fonts.semiBold10};
  color: ${theme.colors.white};
`;

const MsgButton = styled.button`
  display: flex;
  position: relative;
  width: 89px;
  height: 89px;
  border-radius: 50%;
  background: ${theme.colors.violet600};
  position: fixed;
  bottom: 34px;
  right: 134px;
  margin-left: auto;
  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, calc(-50% + 2px));
  }
`;

const MsgCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  position: absolute;
  border-radius: 50%;
  border: 1px solid ${theme.colors.violet200};
  background: ${theme.colors.white};
  right: 5px;
`;

const Count = styled.p`
  ${(props) => props.theme.fonts.semiBold14};
  color: ${theme.colors.violet600};
`;

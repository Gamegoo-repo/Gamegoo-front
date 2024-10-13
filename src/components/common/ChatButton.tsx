import { theme } from "@/styles/theme";
import Image from "next/image";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Alert from "./Alert";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { closeChat, toggleChat } from '@/redux/slices/chatSlice';
import Layout from "../chat/Layout";

const ChatButton = () => {

  const [showAlert, setShowAlert] = useState(false);
  const [unreadChatUuids, setUnreadChatUuids] = useState<string[]>([]);

  const isUser = useSelector((state: RootState) => state.user);
  const unreadUuid = useSelector((state: RootState) => state.chat.unreadUuids);
  const isChatOpen = useSelector((state: RootState) => state.chat.isChatOpen);

  const dispatch = useDispatch();

  useEffect(() => {
    setUnreadChatUuids(unreadUuid);
  }, [unreadUuid])

  /* sessionStorage의 unreadChatUuids가 변경될 때 상태 업데이트 */
  useEffect(() => {
    const localUnreadChatUuids = sessionStorage.getItem('unreadChatUuids');
    if (localUnreadChatUuids) {
      setUnreadChatUuids(JSON.parse(localUnreadChatUuids));
    }
  }, [unreadUuid]);

  /* sessionStorage가 변경되면 상태 업데이트 */
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'unreadChatUuids') {
        const updatedUnreadUuids = event.newValue ? JSON.parse(event.newValue) : [];
        setUnreadChatUuids(updatedUnreadUuids);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const chatCount = unreadChatUuids ? unreadChatUuids.length : 0;

  const handleToggleChat = () => {
    if (!isUser.gameName) {
      return setShowAlert(true);
    }
    dispatch(toggleChat());
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
      <ChatBoxContent>
        {isChatOpen && <Layout />}
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
      </ChatBoxContent>
    </>
  );
};

export default ChatButton;

const ChatBoxContent = styled.div`
  display: flex;
`;

const MsgButton = styled.div`
  position: relative;
  width: 89px;
  height: 89px;
  border-radius: 50%;
  background: ${theme.colors.purple100};
  cursor: pointer;
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
  position: relative;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px solid ${theme.colors.purple200};
  background: ${theme.colors.white};
  left: 72%;       
`;

const Count = styled.p`
 ${(props) => props.theme.fonts.semiBold14};
  color: ${theme.colors.purple100};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

import { theme } from "@/styles/theme";
import Image from "next/image";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Alert from "./Alert";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toggleChat } from "@/redux/slices/chatSlice";
import Layout from "../chat/Layout";
import { resetPosition } from "@/redux/slices/chatPositionSlice";

const ChatButton = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [unreadChatUuids, setUnreadChatUuids] = useState<string[]>([]);
  const [chatCount, setChatCount] = useState<number>(0);

  const isUser = useSelector((state: RootState) => state.user);
  const isChatOpen = useSelector((state: RootState) => state.chat.isChatOpen);

  const dispatch = useDispatch();

  useEffect(() => {
    const localUnreadChatUuids = sessionStorage.getItem("unreadChatUuids");
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
      if (event.key === "unreadChatUuids") {
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
    </>
  );
};

export default ChatButton;

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

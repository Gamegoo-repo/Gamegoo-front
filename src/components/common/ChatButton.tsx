import { theme } from "@/styles/theme";
import Image from "next/image";
import { useEffect, useState } from "react";
import styled from "styled-components";
import ChatWindow from "../chat/ChatWindow";
import Alert from "./Alert";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface msgCountProps {
  count: number;
}

const ChatButton = (props: msgCountProps) => {
  const { count } = props;
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const isUser = useSelector((state: RootState) => state.user);

  const toggleChat = () => {
    if (!isUser.id) {
      return setShowAlert(true);
    }
    setIsChatOpen((prevState) => !prevState);
  };

  const handleChatWindowClose = () => {
    setIsChatOpen(false);
  };

  useEffect(() => {
    if (isChatOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isChatOpen]);

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
        {isChatOpen && <ChatWindow onClose={handleChatWindowClose} />}
        <MsgButton onClick={toggleChat}>
          <Image
            src="/assets/icons/chat_box.svg"
            width={36}
            height={34}
            alt="채팅"
          />
          <MsgCount>
            <Count>{count}</Count>
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

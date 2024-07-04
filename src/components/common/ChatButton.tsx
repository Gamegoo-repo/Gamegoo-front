import { theme } from "@/styles/theme";
import Image from "next/image";
import { useEffect, useState } from "react";
import styled from "styled-components";
import ChatWindow from "../chat/ChatWindow";

interface msgCountProps {
  count: number;
}

const ChatButton = (props: msgCountProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(prevState => !prevState);
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
      {isChatOpen &&
        <ChatWindow
          onClose={handleChatWindowClose} />}
      <MsgButton onClick={toggleChat}>
        <Image
          src='/assets/icons/chat_box.svg'
          width={36}
          height={34}
          alt='chat box'
        />
        <MsgCount>
          <Count>{props.count}</Count>
        </MsgCount>
      </MsgButton>
    </>
  )
};

export default ChatButton;

const MsgButton = styled.div`
            position: relative;
            width: 89px;
            height: 89px;
            border-radius: 50%;
            background: #7967EB;
            cursor: pointer;
            img{
                position: absolute;
            top:50%;
            left:50%;
            transform: translate(-50%, -50%);
            }
            `;

const MsgCount = styled.div`
            position: relative;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            border:1px solid ${theme.colors.purple200};
            background: ${theme.colors.white};
            left:72%;
            `;

const Count = styled.p`
            ${(props) => props.theme.fonts.semiBold14};
            color:${theme.colors.purple100};
            position: absolute;
            top:50%;
            left:50%;
            transform: translate(-50%, -50%);
            `;


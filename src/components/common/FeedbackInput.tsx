import { useState } from "react";
import styled from "styled-components";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import { notify } from "@/hooks/notify";
import Input from "./Input";
import Image from "next/image";
import { theme } from "@/styles/theme";

function FeedBackInput() {
  const [disabled, setDisabled] = useState(false);
  const [feedback, setFeedback] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const EMAIL_SERVICE_ID = process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID as string;
  const EMAIL_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID as string;
  const EMAIL_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAIL_PUBLIC_KEY as string;

  const handleSend = () => {
    if (feedback.trim() === "") return;

    setDisabled(true);
    setFeedback("");
    emailjs
      .send(
        EMAIL_SERVICE_ID!,
        EMAIL_TEMPLATE_ID!,
        { message: feedback },
        EMAIL_PUBLIC_KEY!
      )
      .then(() => {
        notify({
          text: "GAMEGOO를 위한 소중한 피드백 감사합니다:)",
          icon: "✨",
          type: "success",
        });
        setDisabled(false);
      })
      .catch(() =>
        notify({
          text: "전송에 실패했습니다. 다시 시도해주세요.",
          icon: "❌",
          type: "error",
        })
      );
  };

  return (
    <FeedBack>
      <span>{"Gamegoo 팀에게 소중한 피드백을 전달해주세요!"}</span>
      <div className="inputWrapper">
        <Input
          height="45px"
          value={feedback}
          onChange={(value: string) => setFeedback(value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="본 피드백은 서비스 개선에 큰 도움이 됩니다:)"
        />
        <SendIcon
          type="button"
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0 }}
          onClick={handleSend}
          disabled={disabled}
          feedbackLength={feedback.length}
        >
          <Image
            src={`/assets/icons/send_${isFocused ? "purple" : "gray"}.svg`}
            width={24}
            height={24}
            alt="전송"
          />
        </SendIcon>
      </div>
    </FeedBack>
  );
}

export default FeedBackInput;

const FeedBack = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;

  span {
    ${theme.fonts.medium14};
    margin-left: 10px;
  }

  .inputWrapper {
    display: flex;
    align-items: center;
    gap: 10px;

    input {
      width: 400px;
    }
  }
`;

const SendIcon = styled(motion.button)<{ feedbackLength: number }>`
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: none;
  opacity: ${({ feedbackLength }) => (feedbackLength > 0 ? 1 : 0.4)};
  transition: all 0.15s ease-in;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`;

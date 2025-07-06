import styled from "styled-components";
import { theme } from "@/styles/theme";
import { Chat } from "@/types/api/chat/chat";

interface MessageInputProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: (event: React.FormEvent<HTMLFormElement>) => void;
  chatEnterData: Chat | undefined;
  disabled?: boolean;
}

const MessageInput = (props: MessageInputProps) => {
  const {
    message,
    setMessage,
    sendMessage,
    chatEnterData,
    disabled = false,
  } = props;

  const getPlaceholderText = () => {
    if (!!chatEnterData?.blocked) {
      return "메세지를 보낼 수 없는 상태입니다.";
    } else if (!!chatEnterData?.blind) {
      return "탈퇴한 유저입니다.";
    }
    return "";
  };

  const handlePressEnterKey = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.nativeEvent.isComposing) {
      return;
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(event as any);
    }
  };

  return (
    <TextareaContainer>
      <Form onSubmit={sendMessage}>
        {chatEnterData && (
          <>
            <Textarea
              maxLength={1000}
              value={message}
              onChange={(event) => {
                if (message.length < 1000) {
                  setMessage(event.target.value);
                }
              }}
              onKeyDown={handlePressEnterKey}
              disabled={
                disabled || !!chatEnterData.blocked || !!chatEnterData.blind
              }
              placeholder={
                disabled
                  ? "로그인이 필요한 서비스입니다.\n지금 로그인하고 게임 친구와 대화를 시작해보세요!"
                  : getPlaceholderText()
              }
            />
            <Row>
              <TextCount $color={message.length > 0}>
                {message.length}
                {` `}/{` `}1000
              </TextCount>
              <SubmitButton
                disabled={message.length === 0 || !!chatEnterData.blocked}
                type="submit"
                className={
                  !!chatEnterData.blocked || !!chatEnterData.blind
                    ? "disabled-button"
                    : ""
                }
              >
                전송
              </SubmitButton>
            </Row>
          </>
        )}
      </Form>
    </TextareaContainer>
  );
};

export default MessageInput;

const TextareaContainer = styled.div`
  position: relative;
  background: ${theme.colors.white};
  height: 138px;
  width: 100%;
  border-radius: 0 0 20px 20px;
  @media (max-width: 700px) {
    border-radius: 0;
    position: fixed;
    bottom: 0;
  }
`;

const Form = styled.form`
  height: 100%;
  border-radius: 0 0 20px 20px;
  box-shadow: 0 4px 46.7px 0 #0000001a;
  @media (max-width: 700px) {
    border-radius: 0;
    box-shadow: none;
  }
`;

const Textarea = styled.textarea`
  border: none;
  width: 100%;
  padding: 14px 17px;
  ${(props) => props.theme.fonts.regular14};
  color: ${theme.colors.gray800};
  resize: none;
  &:focus {
    outline: none;
  }
  &:disabled {
    background-color: unset;
    &::placeholder {
      ${(props) => props.theme.fonts.semiBold14};
      color: ${theme.colors.gray800};
    }
  }

  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;
  -ms-overflow-style: none;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin: 0 20px 20px 20px;
`;

const TextCount = styled.div<{ $color: boolean }>`
  color: ${({ $color }) => ($color ? theme.colors.violet300 : "#b5b5b5")};
  ${theme.fonts.regular9};
`;

const SubmitButton = styled.button`
  ${(props) => props.theme.fonts.medium16};
  color: ${theme.colors.white};
  background: ${theme.colors.violet600};
  border-radius: 25px;
  padding: 10px 20px;
  transition: background-color 200ms;

  &:disabled {
    background: ${theme.colors.gray300};
    cursor: default;
  }
`;

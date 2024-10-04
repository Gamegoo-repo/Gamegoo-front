import styled from "styled-components";
import { theme } from "@/styles/theme";
import { Chat } from "@/interface/chat";

interface MessageInputProps {
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    sendMessage: (event: React.FormEvent<HTMLFormElement>) => void;
    chatEnterData: Chat | undefined;
}

const MessageInput = (props: MessageInputProps) => {
    const { message, setMessage, sendMessage, chatEnterData } = props;

    const getPlaceholderText = () => {
        if (!!chatEnterData?.blocked) {
            return "메시지를 보낼 수 없는 상대입니다.";
        } else if (!!chatEnterData?.blind) {
            return "탈퇴한 유저입니다.";
        }
        return "";
    };

    const handlePressEnterKey = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
                {chatEnterData &&
                    <>
                        <Textarea
                            maxLength={1000}
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            onKeyDown={handlePressEnterKey}
                            disabled={!!chatEnterData.blocked || !!chatEnterData.blind}
                            placeholder={getPlaceholderText()}
                        />
                        <SubmitButton
                            disabled={message === "" || !!chatEnterData.blocked}
                            type="submit"
                            className={!!chatEnterData.blocked || !!chatEnterData.blind ? "disabled-button" : ""}
                        >
                            전송
                        </SubmitButton>
                    </>
                }
            </Form>
        </TextareaContainer>
    )
};

export default MessageInput;

const TextareaContainer = styled.div`
    position: relative;
    background: ${theme.colors.white};
    height: 138px;
    width: 100%;
    border-radius: 0 0 20px 20px;
`;

const Form = styled.form`
    height: 100%;
    border-radius: 0 0 20px 20px;
    box-shadow: 0 4px 46.7px 0 #0000001A;
`;

const Textarea = styled.textarea`
    border:none;
    width: 100%;
    padding: 14px 17px;
    ${(props) => props.theme.fonts.regular14};
    color: ${theme.colors.gray600}; 
    resize: none; 
    &:focus{
    outline:none;
  }
  &:disabled {
    background-color: unset;
    &::placeholder {
      color: ${theme.colors.gray200}; 
    }
  }
`;

const SubmitButton = styled.button`
  position: absolute;
  right:20px;
  bottom: 19px;
  ${(props) => props.theme.fonts.semiBold15};
  color: ${theme.colors.white}; 
  background: ${theme.colors.purple100};
  border-radius: 25px;
  padding: 12px 20px;
  &.disabled-button{
    cursor: not-allowed;
  }
`;
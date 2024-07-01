import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";

const ChatWindow = () => {
    return (
        <Wrapper>
            <ChatHeader>
                <Title>메신저</Title>
            </ChatHeader>
            <ChatMain>

            </ChatMain>
        </Wrapper>
    )
};

export default ChatWindow;

const Wrapper = styled.div``;

const ChatHeader = styled.header``;

const Title = styled.p``;

const ChatMain = styled.main``;
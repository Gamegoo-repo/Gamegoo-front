import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";
import Tabs from "./Tabs";

interface ChatWindowProps {
    onClose: () => void;
}

const ChatWindow = (props: ChatWindowProps) => {
    const { onClose } = props;

    return (
        <Overlay>
            <Wrapper>
                <CloseButton>
                    <CloseImage
                        onClick={onClose}
                        src='/assets/icons/close.svg'
                        width={11}
                        height={11}
                        alt='close button' />
                </CloseButton>
                <ChatHeader>
                    <HeaderTitle>메신저</HeaderTitle>
                    <Tabs />
                </ChatHeader>
                <ChatSearch>

                </ChatSearch>
                <ChatMain>
                    <MainTitle>
                        즐겨찾기
                    </MainTitle>
                </ChatMain>
            </Wrapper>
        </Overlay>
    )
};

export default ChatWindow;

const Overlay = styled.div`
    display:flex;
    justify-content: center;
    align-items: center;
    position:fixed;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
    z-index: 1;
`;

const Wrapper = styled.div`
    background: ${theme.colors.white};
    border-radius: 20px;
`;

const CloseButton = styled.p`
    display:flex;
    margin-bottom:1px;
    padding:12px 13px 0 0;
`;

const ChatHeader = styled.header`
    padding: 0 30px;
`;

const CloseImage = styled(Image)`
    margin-left:auto;
    cursor: pointer;
`;

const HeaderTitle = styled.p`
    ${(props) => props.theme.fonts.bold20};
    color:${theme.colors.gray600};
    margin-bottom: 38px;
`;

const ChatSearch = styled.div`
    padding:15px 18px 11px;
    border-bottom: 1px solid #E2E2E2;
`;


const ChatMain = styled.main``;

const MainTitle = styled.p`
    ${(props) => props.theme.fonts.medium11};
    color:${theme.colors.gray200};      
`;

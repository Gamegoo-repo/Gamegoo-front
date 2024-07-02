import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";
import TabButton from "./TabButton";
import { useState } from "react";
import TabContent from "./TabContent";

interface ChatWindowProps {
    onClose: () => void;
}

const ChatWindow = (props: ChatWindowProps) => {
    const { onClose } = props;

    const [activeTab, setActiveTab] = useState<string>('friends');

    return (
        <Overlay>
            <Wrapper>
                <ChatHeader>
                    <CloseButton>
                        <CloseImage
                            onClick={onClose}
                            src='/assets/icons/close.svg'
                            width={11}
                            height={11}
                            alt='close button' />
                    </CloseButton>
                    <HeaderTitle>메신저</HeaderTitle>
                    <TabButton
                        onActive={activeTab}
                        handleActiveTab={setActiveTab} />
                </ChatHeader>
                <ChatSearch>
                    <SearchInput>
                        <SearchImage
                            src="/assets/icons/search.svg"
                            width={17}
                            height={16}
                            alt="검색하기" />
                        <Input type="text" placeholder="친구 검색하기" />
                    </SearchInput>
                </ChatSearch>
                <ChatMain>
                    <MainTitle>
                        즐겨찾기
                    </MainTitle>
                    <TabContent onActive={activeTab} />
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

const ChatHeader = styled.header`
    box-shadow: 0 -1px 10.7px 0 #00000026;
    border-radius: 20px 20px 0 0;
`;

const CloseButton = styled.p`
    display:flex;
    margin-bottom:1px;
    padding:12px 13px 0 0;
`;

const CloseImage = styled(Image)`
    margin-left:auto;
    cursor: pointer;
`;

const HeaderTitle = styled.p`
    padding: 0 30px;
    ${(props) => props.theme.fonts.bold20};
    color:${theme.colors.gray600};
    margin-bottom: 38px;
`;

const ChatSearch = styled.div`
    padding:15px 18px 11px;
    border-bottom: 1px solid ${theme.colors.gray400};
`;

const SearchInput = styled.div`
    position: relative;
    width:383px;
`;
const SearchImage = styled(Image)`
  position : absolute;
  top: 13px;
  left: 15px;
  margin: 0;
`;

const Input = styled.input`
  width: 100%;
  background: ${theme.colors.gray500};
  border: 1px solid ${theme.colors.gray500};
  border-radius: 10px;
  padding: 10px 15px 10px 47px;
  ${(props) => props.theme.fonts.regular14};
  color:${theme.colors.gray200};
`;


const ChatMain = styled.main`
    padding:6px 19px 0 19px;
`;

const MainTitle = styled.p`
    ${(props) => props.theme.fonts.medium11};
    color:${theme.colors.gray200};      
`;

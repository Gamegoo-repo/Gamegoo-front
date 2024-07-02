import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { useState } from "react";
import FriendsList from "./FriendsList";

interface ChatWindowProps {
    onClose: () => void;
}

const FRIENDS = [
    { id: 1, image: "/assets/icons/gray_circle.svg", userName: "김철수", online: 'on', favorites: 1 },
    { id: 2, image: "/assets/icons/gray_circle.svg", userName: "김철수", online: 'on', favorites: 0 },
    { id: 3, image: "/assets/icons/gray_circle.svg", userName: "김철수", online: 'off', favorites: 1 },
    { id: 4, image: "/assets/icons/gray_circle.svg", userName: "김철수", online: 'on', favorites: 0 },
    { id: 5, image: "/assets/icons/gray_circle.svg", userName: "김철수", online: 'off', favorites: 1 },
    { id: 6, image: "/assets/icons/gray_circle.svg", userName: "김철수", online: 'off', favorites: 1 },
    { id: 7, image: "/assets/icons/gray_circle.svg", userName: "김철수", online: 'off', favorites: 0 },
    { id: 8, image: "/assets/icons/gray_circle.svg", userName: "김철수", online: 'on', favorites: 0 },
    { id: 9, image: "/assets/icons/gray_circle.svg", userName: "김철수", online: 'off', favorites: 1 },
    { id: 10, image: "/assets/icons/gray_circle.svg", userName: "김철수", online: 'off', favorites: 0 },
    { id: 11, image: "/assets/icons/gray_circle.svg", userName: "김철수", online: 'on', favorites: 1 },
    { id: 12, image: "/assets/icons/gray_circle.svg", userName: "김철수", online: 'off', favorites: 0 },
    { id: 13, image: "/assets/icons/gray_circle.svg", userName: "김철수", online: 'off', favorites: 0 },
];

const ChatWindow = (props: ChatWindowProps) => {
    const { onClose } = props;

    const [activeTab, setActiveTab] = useState<string>('friends');

    const favoriteFriends = FRIENDS.filter(friend => friend.favorites === 1);
    const nonFavoriteFriends = FRIENDS.filter(friend => friend.favorites === 0);

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
                    <TabContainer>
                        <Tab $isActive={activeTab === 'friends'} onClick={() => setActiveTab('friends')}>
                            친구 목록
                        </Tab>
                        <Tab $isActive={activeTab === 'chat'} onClick={() => setActiveTab('chat')}>
                            대화방
                        </Tab>
                    </TabContainer>
                </ChatHeader>
                {activeTab === 'friends' &&
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
                }
                    <ChatMain>
                        <Content>
                            {activeTab === 'friends' &&
                                <div>
                                    <FriendsList
                                        list={favoriteFriends}
                                        isFavorites={true} />
                                    <FriendsList
                                        list={nonFavoriteFriends}
                                        isFavorites={false} />
                                </div>
                            }
                            {activeTab === 'chat' && <div>대화방</div>}
                        </Content>
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
    top: 50%;
    right: 8%;
    transform: translate(0, -50%);
    z-index: 1;
`;

const Wrapper = styled.div`
    background: ${theme.colors.white};
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    width: 400px;
    height: 716px;
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

const TabContainer = styled.div`
    display: flex;
    gap:40px;
    padding: 0 30px;
`;

const Tab = styled.div<{ $isActive: boolean }>`
    position: relative;
    padding: 4px 0;
    cursor: pointer;
    ${(props) => props.theme.fonts.semiBold14};
    color: #232323;
    &:after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: -2px;
        width: ${(props) => (props.$isActive ? '100%' : 'none')};
        height: 4px;
        background-color: ${theme.colors.purple100}; 
        border-radius: 60px;
        transform: translateX(-50%);
        transition: width 0.3s ease;
    }
`;

const ChatSearch = styled.div`
    padding:15px 18px 11px;
    border-bottom: 1px solid ${theme.colors.gray400};
`;

const SearchInput = styled.div`
    position: relative;
    width:100%;
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

const ChatMain = styled.div`
    padding:11px 6px 0 0;
    box-shadow: 0 13px 15px 0 #0000001A;
    border-radius: 0 0 20px 20px;
`;

const Content = styled.main`
    height: 533px; 
    overflow-y: auto; 
    &::-webkit-scrollbar {
        width: 5px;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 66px;
        background: ${theme.colors.gray300};
    }
    &::-webkit-scrollbar-track {
        border-radius: 66px;
        background: transparent;
    }
`;



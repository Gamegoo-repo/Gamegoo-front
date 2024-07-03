import styled from 'styled-components';
import { theme } from "@/styles/theme";
import Image from "next/image";
import { useState } from 'react';
import ChatWindow from './ChatWindow';
import FriendsList from "./FriendsList";
import MiniModal from "./MiniModal";
import ChatList from "./ChatList";

interface ListProps {
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

const CHAT = [
    { id: 1, image: "/assets/icons/gray_circle.svg", userName: "김철수", msg: '마지막 메시지', date: "2024-07-01 23:27" },
    { id: 2, image: "/assets/icons/gray_circle.svg", userName: "김철수", msg: '마지막 메시지', date: "2024-06-25 09:27" },
    { id: 3, image: "/assets/icons/gray_circle.svg", userName: "김철수", msg: '마지막 메시지', date: "2024-05-19 23:27" },
    { id: 4, image: "/assets/icons/gray_circle.svg", userName: "김철수", msg: '마지막 메시지', date: "2024-05-19 11:27" },
];

const List = (props: ListProps) => {
    const { onClose } = props;

    const [activeTab, setActiveTab] = useState<string>('friends');

    const favoriteFriends = FRIENDS.filter(friend => friend.favorites === 1);
    const nonFavoriteFriends = FRIENDS.filter(friend => friend.favorites === 0);

    const [isFriendDeleteBox, setIsFriendDeleteBox] = useState(false);

    return (
        <ChatWindow onClose={onClose}>
            <ChatHeader>
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
                <Content className={activeTab==='friends'?'friends':'chat'}>
                    {activeTab === 'friends' &&
                        <div>
                            <FriendsList
                                list={favoriteFriends}
                                isFavorites={true}
                            />
                            <FriendsList
                                list={nonFavoriteFriends}
                                isFavorites={false}
                                setIsDeleteBox={setIsFriendDeleteBox} />
                        </div>
                    }
                    {activeTab === 'chat' &&
                        <ChatList list={CHAT} />}
                </Content>
            </ChatMain>
        </ChatWindow>
    )
};

export default List;

const ChatHeader = styled.header``;

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
    box-shadow: inset 0 12px 10px -11px #00000026;
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
    &.friends{
        height: 533px; 
    }
    &.chat{
        height: 603px; 
    }
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